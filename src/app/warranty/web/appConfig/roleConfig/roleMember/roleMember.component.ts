import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { RoleMemberService } from './roleMember.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap';
import {
    RoleMemberListSearch, RoleMemberListPage, RoleMember, RoleMemberListResponse, RoleMemberRequest,
    RoleMemberResponse, RoleMemberDeleteRequest, RoleMemberDeleteResponse, RoleConfigRequest, EmpInfoListSearch,
    EmpInfoListPage, EmployeeInfoResponse
} from '../../models/roleConfigModel';
import { AppService } from '../../../../../app.service';
import { LocalStorage } from '../../../../core/component/localStorage/localStorage.component';
import { ComponentService } from '../../../../core/component/component.service';
import { MessageService } from 'primeng/components/common/messageservice';
import { ConfirmationService } from 'primeng/primeng';
import { ToastService } from '../../../../core/service/toast.service';

@Component({
    selector: 'app-role-congif',
    templateUrl: './roleMember.component.html',
    providers: [MessageService, ConfirmationService]
})
export class RoleMemberComponent implements OnInit {
    @ViewChild('opationCell') opationCell: TemplateRef<any>;
    @ViewChild('PersonAddModal') PersonAddModal: ModalDirective;
    roleMemberListSearch: RoleMemberListSearch = new RoleMemberListSearch();
    roleMemberListPage: RoleMemberListPage = new RoleMemberListPage();

    empInfoListSearch: EmpInfoListSearch = new EmpInfoListSearch();
    empInfoListPage: EmpInfoListPage = new EmpInfoListPage();
    roleMember: RoleMember = new RoleMember();
    documentCodeList: Array<any> = [];
    loading = false;
    roleName: string;

    personName = '';
    tableConfig = {
        isNumber: true,
        isSelect: false
    };
    tableCols = [];
    tableProcessCols = [];
    tableData: Array<any> = [];
    tableProcessData: Array<any> = [];
    totalRecords = 0;

    mergeType: string;
    roleId: number;
    tableType: string; // 弹窗表格类型
    selectionMode: string; // 表格选择方式
    showChoose: Boolean = false;
    showProcess: Boolean = false;
    modalConfig: any = this.appService.modalConfig;
    originData = [];
    sourceData = [];
    targetData = [];
    display: any = {};


    constructor(
        private roleMemberService: RoleMemberService,
        private activatedRoute: ActivatedRoute,
        private appService: AppService,
        private ls: LocalStorage,
        private router: Router,
        private componentService: ComponentService,
        private toastService: ToastService,
        private confirmationService: ConfirmationService
    ) {
        this.display = this.ls.getObject('display'); // 获取显示字段

    }

    ngOnInit() {
        this.tableCols = [
            { 'header': this.display.RoleCode, 'field': 'roleCode', 'width': '31%', 'isSort': true },
            { 'header': this.display.RoleName, 'field': 'roleName', 'width': '31%', 'isSort': true },
            { 'header': this.display.Name, 'field': 'userName', 'width': '31%', 'isSort': true },
            { 'header': this.display.Operation, 'cellTemplate': this.opationCell, 'field': 'do', 'width': '10%', 'isSort': false }
        ];
        this.roleMemberListPage.pageNum = 1;
        this.roleMemberListPage.pageSize = 10;
        this.roleMember = new RoleMember();
        this.roleId = parseInt(this.activatedRoute.snapshot.paramMap.get('roleId'), undefined);
        // this.roleMember.roleCode = this.activatedRoute.snapshot.paramMap.get('roleCode');
        this.roleMember.roleName = this.roleName = this.activatedRoute.snapshot.paramMap.get('roleName');
        const roleInfo: RoleConfigRequest = new RoleConfigRequest();
        roleInfo.roleId = this.roleId;
        this.roleMemberListSearch.roleInfo = roleInfo;
        // this.getChoosePeople();
        this.getRoleMemberList();
        // this.getDocunmentCodeList();
    }

    /**
     * 获取角色成员列表
     * zw 2017年11月20日11:50:26
     * @memberof RoleMemberComponent
     */
    getRoleMemberList(boolean?) {
        // this.roleMemberListPage.languageCode = this.ls.get('language');
        if (!boolean) {
            this.roleMemberListPage.pageNum = 1;
        }
        // this.roleMemberListPage.roleId = this.roleId;
        const params = {
            roleId: this.roleId
        };
        this.roleMemberService.getRoleMembers(this.roleMemberListPage, params)
            .subscribe((res: RoleMemberListResponse) => {
                if (res.code === 'SUCCESS') {
                    this.tableData = res.data.list;
                    this.totalRecords = res.data.total;
                    this.loading = false;
                }
            });

    }

    /**
     * 角色成员列表 分页
     * zw  2017年11月20日14:13:01
     * @param {any} data  当前的pageSize和pageNum
     * @memberof RoleMemberComponent
     */
    tableGetPage(data) {
        this.roleMemberListPage.pageNum = data.page * 1 + 1;
        this.roleMemberListPage.pageSize = data.rows;
        this.getRoleMemberList(true);
    }

    /**
     * 维护角色成员列表
     * zw 2017年11月20日15:05:05
     * @param mergeType 维护类型
     * @memberof RoleMemberComponent
     */
    merge(mergeType: string) {
        // else if (this.roleMember.roleCode !== 'ITManager' &&
        //     this.roleMember.roleCode !== 'BusinessManager' &&
        //     this.roleMember.roleCode !== 'DataOperator' &&
        //     this.roleMember.roleCode !== 'LeastPrivilege' &&
        //     !this.roleMember.roleCode) {
        //     this.toastService.showError('ERROR', this.display.RequiredMessage);
        // }
        if (!this.roleMember.userName) {
            this.toastService.showError('ERROR', this.display.RequiredMessage);
        } else {
            // if (mergeType === 'create') {
            //     for (const item of this.tableData) {
            //         if (this.roleMember.userName.indexOf(item.userName) > -1 &&
            //             item.documentCode === this.roleMember.documentCode) {
            //             this.messageService.add({ severity: 'info', summary: 'info', detail: this.display.RoleMemberMessage });
            //             return;
            //         }
            //     }
            // }
            this.roleMember.enabledFlag = 'Y';
            this.roleMember.roleId = this.roleId;
            if (mergeType === 'create') {
                this.roleMember.createdBy = this.roleMember.lastUpdatedBy = this.ls.get('userId');
            } else {
                this.roleMember.lastUpdatedBy = this.ls.get('userId');
            }
            console.log(this.roleMember);
            this.mergeRoleMember(this.roleMember, mergeType);
            // this.modalClose();
        }
    }

    /**
     * 维护角色成员列表
     * zw 2017年11月16日18:10:13
     * @param mergeType 维护类型 create,update
     * @memberof RoleMemberComponent
     */
    mergeRoleMember(param: RoleMember, mergeType: string) {
        if (mergeType === 'create') {
            this.roleMemberService.mergeRoleMember(param)
                .subscribe((res) => {
                    this.roleMember = new RoleMember();
                    this.showToast(res);
                });
        } else {
            this.roleMemberService.updateRoleMember(param)
                .subscribe((res) => {
                    this.showToast(res);
                });
        }
    }

    showToast(res) {
        if (res.code === 'SUCCESS') {
            this.toastService.showSuccess('SUCCESS', this.display.makeSuccess);
            this.getRoleMemberList();
            this.modalClose();
        } else {
            this.toastService.showError('ERROR', res.msg || this.display.makeError);
        }
    }

    /**
     * 删除角色成员
     * zw 2017年11月20日14:04:01
     * @param param
     * @memberof RoleMemberComponent
     */
    deleteRoleMember(param: RoleMember) {
        this.componentService.getZPStoken().subscribe((data) => {
            if (data.code === 'SUCCESS') {
                const roleMemberDeleteRequest: RoleMemberDeleteRequest = new RoleMemberDeleteRequest();
                roleMemberDeleteRequest.memberId = param.memberId;
                const urlParams = {
                    token: data.data
                };
                this.roleMemberService.deleteRoleMembers(urlParams, roleMemberDeleteRequest)
                    .subscribe((res) => {
                        this.showToast(res);
                    });
            }
        });

    }

    // /**
    //  * 角色新增 - 流程多选
    //  * jiangen  2017年12月25日16:04:11
    //  * @memberof RoleMemberComponent
    //  */
    // showProcessDialog(tableType, selectionMode) {
    //     this.tableType = tableType;
    //     this.selectionMode = selectionMode;
    //     this.tableProcessCols = this.componentService.getTableCols('process');
    //     this.getProcess();
    //     this.showProcess = true;
    // }

    // /**
    //  * 编辑角色成员列表
    //  * zw 2017年11月20日11:51:53
    //  * @param param
    //  * @memberof RoleMemberComponent
    //  */
    // editItem(e) {
    //     this.roleMember.userUid = e.userUid;
    //     this.roleMember.userName = e.userName;
    //     this.roleMember.documentCode = e.documentCode;
    //     this.roleMember.memberId = e.memberId;
    //     this.openModal();
    //     this.mergeType = 'update';
    // }

    /**
     * 删除角色成员列表
     * zw 2017年11月20日11:52:32
     * @param param
     * @memberof RoleMemberComponent
     */
    deleteItem(e) {
        this.confirmationService.confirm({
            message: this.display.DeleteMessage,
            accept: () => {
                this.roleMember.memberId = e.memberId;
                this.deleteRoleMember(this.roleMember);
            }
        });
    }

    /**
     * 打开Modal框
     * zw 2017年11月16日14:40:36
     * @param event
     * @memberof RoleMemberComponent
     */
    openModal(item, type) {
        if (type === 'create') {
            this.mergeType = 'create';
        } else {
            this.roleMember = Object.assign({}, item);
            this.mergeType = 'edit';
        }
        this.roleMember.roleName = this.roleName;
        this.PersonAddModal.show();
    }

    /**
     * 关闭Modal框
     * zengwei 2017年11月16日14:40:36
     * @param event
     * @memberof RoleMemberComponent
     */
    modalClose() {
        this.PersonAddModal.hide();
        this.roleMember.userName = '';
    }

    /**
     * 角色配置 -   选的人
     * jiagnen  2017年12月25日16:21:55
     * @memberof RoleMemberComponent
     */
    getChoosePeople() {
        this.roleMemberService.getEmployeeInfo(this.empInfoListPage, this.empInfoListSearch)
            .subscribe((res: EmployeeInfoResponse) => {
                if (res.code === 'SUCCESS') {
                    this.sourceData = res.data.list;
                    // this.sourceData = [];
                    this.originData = Object.assign([], this.sourceData);
                }
            });
    }

    // /**
    //  * 角色配置  - 选的流程
    //  * jiagnen  2017年12月25日16:22:25
    //  * @memberof RoleMemberComponent
    //  */
    // getChooseProcess(data) {
    //     // if (data) {
    //     //     switch (this.tableType) {
    //     //         case 'process':
    //     //             this.roleMember.documentCode = '';
    //     //             this.roleMember.documentName = '';
    //     //             for (const item of data) {
    //     //                 this.roleMember.documentCode += (item.documentCode + ',');
    //     //                 this.roleMember.documentName += (item.documentName + ',');
    //     //             }
    //     //             this.roleMember.documentCode = this.roleMember.documentCode.substring(0, this.roleMember.documentCode.lastIndexOf(','));
    //     //             this.roleMember.documentName = this.roleMember.documentName.substring(0, this.roleMember.documentName.lastIndexOf(','));
    //     //             break;
    //     //     }
    //     //     this.showProcess = false;
    //     // }
    // }

    // /**
    //  * 角色配置 - 关闭选择流程
    //  * jiangen  2017年12月25日16:26:10
    //  * @memberof RoleMemberComponent
    //  */
    // closeChoose() {
    //     this.showProcess = false;
    // }

    /**
     * 确定选择人员
     * zw 2017年11月20日19:06:11
     * @memberof RoleMemberComponent
     */
    selectPerson(e) {
        this.roleMember.userName = '';
        this.roleMember.userUid = '';
        this.roleMember.departmentName = '';
        this.roleMember.empId = '';
        for (const item of e) {
            this.roleMember.userName += item.displayName ? (item.displayName + ';') : '';
            this.roleMember.userUid += item.empUid ? (item.empUid + ',') : '';
            this.roleMember.departmentName += item.deptAbbr ? (item.deptAbbr + ',') : '';
            this.roleMember.empId += item.empId ? (item.empId + ',') : '';
        }
        this.roleMember.userName = this.roleMember.userName.substring(0, this.roleMember.userName.lastIndexOf(';'));
        this.roleMember.userUid = this.roleMember.userUid.substring(0, this.roleMember.userUid.lastIndexOf(','));
        this.roleMember.departmentName = this.roleMember.departmentName.substring(0, this.roleMember.departmentName.lastIndexOf(','));
        this.roleMember.empId = this.roleMember.empId.substring(0, this.roleMember.empId.lastIndexOf(','));
    }

    /**
     * 关闭选人对话框
     * zw 2017年11月20日19:03:43
     * @memberof RoleMemberComponent
     */
    cancleEvent(e) {
        if (e) {
            this.showChoose = false;
        }
    }

    reset() {
        this.roleMemberListPage.userName = '';
    }

    // /**
    //  * 获取流程列表
    //  * @memberof RoleMemberComponent
    //  */
    // getDocunmentCodeList() {
    //     this.roleMemberService.getDocunmentCodeList().subscribe((res) => {
    //         if (res.code === 'SUCCESS') {
    //             this.documentCodeList = res.data;
    //         }
    //     });
    // }

    /**
     * 返回
     */
    goBack() {
        this.router.navigate(['/config/role']);
    }

    // /**
    //  * 获取全部流程
    //  * jiangen  2017年12月25日16:06:41
    //  * @memberof RoleMemberComponent
    //  */
    // getProcess() {
    //     this.roleMemberService.getProcess().subscribe((data) => {
    //         if (data.code === 'SUCCESS') {
    //             this.tableProcessData = data.data;
    //         }
    //     });
    // }

    /**
     * 清除输入
     * jiagnen   2017年12月25日13:39:4
     * @memberof KdAsPtContracModalComponet
     */
    clear(type) {
        if (type) {
            this.roleMember[type] = '';
        }
    }
}
