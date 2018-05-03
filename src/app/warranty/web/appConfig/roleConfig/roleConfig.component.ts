import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { RoleConfigService } from './roleConfig.service';
import {
    RoleConfigListSearch, RoleConfigListPage, RoleConfigListResponse,
    RoleConfigDeleteRequest, RoleConfigDeleteResponse, RoleConfig, RoleConfigRequest, RoleConfigResponse
} from '../models/roleConfigModel';
import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap';
import { LocalStorage } from '../../../core/component/localStorage/localStorage.component';
import { ComponentService } from '../../../core/component/component.service';
import { AppService } from '../../../../app.service';
import { MessageService } from 'primeng/components/common/messageservice';
import { ConfirmationService } from 'primeng/primeng';
import { ToastService } from '../../../core/service/toast.service';


@Component({
    selector: 'app-role-congif',
    templateUrl: './roleConfig.component.html',
    providers: [MessageService, ConfirmationService]
})

export class RoleConfigComponent implements OnInit {
    @ViewChild('titleCell') titleCell: TemplateRef<any>;
    @ViewChild('opationCell') opationCell: TemplateRef<any>;
    @ViewChild('PersonAddModal') PersonAddModal: ModalDirective;
    roleConfigListSearch: RoleConfigListSearch = new RoleConfigListSearch();
    private roleConfigListPage: RoleConfigListPage = new RoleConfigListPage();
    loading = true;

    personName = '';
    tableConfig = {
        isNumber: true,
        isSelect: false
    };
    tableCols = [];
    tableData: Array<any> = [];
    totalRecords = 0;

    mergeType: string;
    roleConfig: RoleConfig = new RoleConfig();
    display: any = {};
    modalConfig: any = this.appService.modalConfig;

    constructor(
        private roleConfigService: RoleConfigService,
        private router: Router,
        private ls: LocalStorage,
        private componentService: ComponentService,
        private appService: AppService,
        private toastService: ToastService,
        private confirmationService: ConfirmationService
    ) {
        this.display = this.ls.getObject('display'); // 获取显示字段

    }

    ngOnInit() {
        this.roleConfigListPage.pageNum = 1;
        this.roleConfigListPage.pageSize = 10;
        this.tableCols = [
            { 'header': this.display.RoleCode, 'field': 'roleCode', 'width': '40%', 'isSort': true },
            { 'header': this.display.RoleName, 'cellTemplate': this.titleCell, 'field': 'roleName', 'width': '52%', 'isSort': true },
            { 'header': this.display.Tmcount, 'field': 'tmcount', 'width': '20%', 'isSort': true },
            { 'header': this.display.Operation, 'cellTemplate': this.opationCell, 'field': 'do', 'width': '8%', 'isSort': false }
        ];
        this.getRoleConfigList();
    }

    /**
     * 获取角色配置列表
     * zw 2017年11月20日11:50:26
     * @memberof RoleConfigComponent
     */
    getRoleConfigList(boolean?) {
        if (!boolean) {
            this.roleConfigListPage.pageNum = 1;
        }
        this.roleConfigListPage.languageCode = this.ls.get('language');
        this.roleConfigService.getRoleConfigs(this.roleConfigListPage, this.roleConfigListSearch)
            .subscribe((res: RoleConfigListResponse) => {
                if (res.code === 'SUCCESS') {
                    this.tableData = res.data.list;
                    this.totalRecords = res.data.total;
                    this.loading = false;
                }
            });
    }

    /**
     * 角色配置列表 分页
     * zw  2017年11月20日14:13:01
     * @param {any} data  当前的pageSize和pageNum
     * @memberof RoleConfigComponent
     */
    tableGetPage(data) {
        this.roleConfigListPage.pageNum = data.page * 1 + 1;
        this.roleConfigListPage.pageSize = data.rows;
        this.getRoleConfigList(true);
    }

    /**
     * 维护角色配置列表
     * zw 2017年11月20日15:05:05
     * @param mergeType 维护类型
     * @memberof RoleConfigComponent
     */
    merge(mergeType: string) {
        if (!this.roleConfig.roleCode || !this.roleConfig.roleName) {
            this.toastService.showInfo('INFO', this.display.RequiredMessage);
        } else {
            if (mergeType === 'create') {
                for (const item of this.tableData) {
                    if (item.roleCode === this.roleConfig.roleCode) {
                        this.toastService.showInfo('INFO', this.display.RoleCodeMessage);
                        return;
                    }
                }
            }
            this.mergeRoleConfig(this.roleConfig, mergeType);
            this.modalClose();
        }
    }

    /**
     * 维护角色配置列表
     * zw 2017年11月16日18:10:13
     * @param mergeType 维护类型 create,update
     * @memberof RoleConfigComponent
     */
    mergeRoleConfig(param: RoleConfig, mergeType: string) {
        const roleConfigRequest: RoleConfigRequest = new RoleConfigRequest();
        roleConfigRequest.roleCode = param.roleCode;
        roleConfigRequest.roleName = param.roleName;
        roleConfigRequest.lastUpdateDate = new Date();
        roleConfigRequest.lastUpdatedBy = 1;
        roleConfigRequest.enabledFlag = 'Y';
        if (mergeType === 'create') {
            roleConfigRequest.createdBy = this.ls.get('userId');
            roleConfigRequest.creationDate = new Date();
        } else {
            roleConfigRequest.roleId = this.roleConfig.roleId;
        }

        this.roleConfigService.mergeRoleConfig(roleConfigRequest)
            .subscribe((res: RoleConfigResponse) => {
                if (res.code === 'SUCCESS') {
                    this.getRoleConfigList();
                    this.toastService.showSuccess('SUCCESS', this.display.makeSuccess);
                } else {
                    this.toastService.showError('ERROR', res.msg || this.display.makeError);
                }
            });
    }

    /**
     * 删除角色配置
     * zw 2017年11月20日14:04:01
     * @param param
     * @memberof RoleConfigComponent
     */
    deleteRoleConfig(param: RoleConfig) {
        this.componentService.getZPStoken().subscribe((data) => {
            if (data.code === 'SUCCESS') {
                const roleConfigDeleteRequest: RoleConfigDeleteRequest = new RoleConfigDeleteRequest();
                roleConfigDeleteRequest.roleId = param.roleId;
                const urlParams = {
                    token: data.data
                };
                this.roleConfigService.deleteRoleConfigs(urlParams, roleConfigDeleteRequest)
                    .subscribe((res: RoleConfigDeleteResponse) => {
                        if (res.code === 'SUCCESS') {
                            this.toastService.showSuccess('SUCCESS', this.display.makeSuccess);
                            this.getRoleConfigList();
                        } else {
                            this.toastService.showError('ERROR', res.msg || this.display.RoleCodeDeleteMessage);
                        }
                    });
            }
        });

    }

    /**
     * 编辑角色配置列表
     * zw 2017年11月20日11:51:53
     * @param param
     * @memberof RoleConfigComponent
     */
    editItem(e) {
        this.roleConfig.roleId = e.roleId;
        this.roleConfig.roleCode = e.roleCode;
        this.roleConfig.roleName = e.roleName;
        this.openModal();
        this.mergeType = 'update';
    }

    /**
     * 删除角色配置列表
     * zw 2017年11月20日11:52:32
     * @param param
     * @memberof RoleConfigComponent
     */
    deleteItem(e) {
        this.confirmationService.confirm({
            message: this.display.DeleteMessage,
            accept: () => {
                this.roleConfig.roleId = e.roleId;
                this.deleteRoleConfig(this.roleConfig);
            }
        });
    }

    /**
     * 角色配置  - 详情
     * jiangen 2017年12月29日15:00:45
     * @param {any} e
     * @memberof RoleConfigComponent
     */
    goDetail(e) {
        this.router.navigate(['config/role/roleMember', { 'roleId': e.roleId, 'roleCode': e.roleCode, 'roleName': e.roleName }]);
    }

    /**
     * 打开Modal框
     * zw 2017年11月16日14:40:36
     * @param event
     * @memberof RoleConfigComponent
     */
    openModal() {
        this.PersonAddModal.show();
        this.mergeType = 'create';
    }

    /**
     * 关闭Modal框
     * zengwei 2017年11月16日14:40:36
     * @param event
     * @memberof RoleConfigComponent
     */
    modalClose() {
        this.PersonAddModal.hide();
        this.roleConfig = new RoleConfig();
    }
}
