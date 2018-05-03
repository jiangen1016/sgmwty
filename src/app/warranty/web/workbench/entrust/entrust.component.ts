import { Component, TemplateRef, ViewChild, OnInit } from '@angular/core';
import { LocalStorage } from '../../../core/component/localStorage/localStorage.component';
import { DomSanitizer } from '@angular/platform-browser';
import { ValueListRequest, ComponentService, ValueListResponse } from '../../../core/component/component.service';
import { EntrustSearch, EntrustListPage } from '../models/entrustModel';
import { Router } from '@angular/router';
import { EntrustService } from './entrut.service';
import { AppService } from '../../../../app.service';
import { MessageService } from 'primeng/components/common/messageservice';
import { ConfirmationService } from 'primeng/primeng';

@Component({
    selector: 'app-my-entrust',
    templateUrl: './entrust.component.html',
    providers: [MessageService, ConfirmationService]
})

export class EntrustComponent implements OnInit {
    @ViewChild('opationCell') opationCell: TemplateRef<any>;

    tableCols: Array<any> = [];
    tableData: Array<any> = [];
    display: any = {};
    totalRecords: Number = 0;
    loading: Boolean = false;
    isManager: Boolean = false; // 是否是管理员
    userInfo: any = {}; // 用户信息
    entrustStatus: Array<any> = [];
    entrustProcess: Array<any> = [];
    valueListRequest: ValueListRequest = new ValueListRequest();
    entrustSearch: EntrustSearch = new EntrustSearch();
    entrustListPage: EntrustListPage = new EntrustListPage();

    constructor(
        private ls: LocalStorage,
        private sanitizer: DomSanitizer,
        private router: Router,
        private componentService: ComponentService,
        private entrustService: EntrustService,
        private appService: AppService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {

    }

    ngOnInit(): void {
        this.display = this.ls.getObject('display'); // 获取显示字段
        this.tableCols = [
            // { 'header': 'SN', 'field': 'number', 'width': '10%', 'isSort': true },
            { 'header': this.display.Founder, 'field': 'creatorName', 'width': '10%', 'isSort': true },
            { 'header': this.display.Authorizer, 'field': 'grantorName', 'width': '10%', 'isSort': true },
            { 'header': this.display.AuthorizedPerson, 'field': 'surrogateName', 'width': '10%', 'isSort': true },
            // { 'header': this.display.Application, 'field': 'applicationName', 'width': '10%', 'isSort': true },
            // { 'header': this.display.Process, 'field': 'applicationFlowDisplayname', 'width': '30%', 'isSort': true },
            { 'header': this.display.StartDate, 'field': 'startDate', 'width': '10%', 'isSort': true, 'date': true },
            { 'header': this.display.EndDate, 'field': 'endDate', 'width': '10%', 'isSort': true, 'date': true },
            { 'header': this.display.Status, 'field': 'status', 'width': '10%', 'isSort': true },
            { 'header': this.display.Remarks, 'field': 'remark', 'width': '15%', 'isSort': true, 'left': true },
            {
                'header': this.display.Operation,
                'cellTemplate': this.opationCell, 'field': 'do', 'width': '8%', 'isSort': false, 'edit': true
            }
        ];
        this.entrustListPage.pageNum = 1;
        this.entrustListPage.pageSize = 10;
        this.search();
        // this.getLookupValueList();
        this.userInfo = this.appService.getUserInfo();
        if (this.userInfo.roles.indexOf('ITManager') !== -1 || this.userInfo.roles.indexOf('BusinessManager') !== -1) {
            this.isManager = true;
        }
    }

    /**
     * 外出授权查询
     * jiangen  2017年12月21日13:31:25
     * @memberof EntrustComponent
     */
    search(boolean?) {
        if (!boolean) {
            this.entrustListPage.pageNum = 1;
        }
        this.entrustSearch = this.appService.setDate(this.entrustSearch, ['startBegDate', 'startEndDate', 'endBegDate', 'endOverDate']);
        this.entrustService.search(this.entrustListPage, this.entrustSearch).subscribe((data) => {
            if (data.code === 'SUCCESS') {
                this.tableData = data.data.list;
                const user = this.ls.get('userId');
                for (let i = 0; i < this.tableData.length; i++) {
                    this.tableData[i].canEdit = false;
                    if (this.tableData[i].status === 'DELETE') {
                        this.tableData[i].canEdit = true;
                    } else {
                        if (this.tableData[i].surrogateUid === user && !this.isManager) {
                            this.tableData[i].edit = true;
                        } else {
                            this.tableData[i].edit = false;
                        }
                    }
                }
                this.totalRecords = data.data.total;
                this.loading = false;
            }
        });
    }

    /**
     * 安全url
     * jiagnen 2017年12月4日10:36:07
     * @param {any} url
     * @returns
     * @memberof MyInfoComponent
     */
    safeUrl(url) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }

    /**
     * 跳转到新增
     * jiangen 2017年12月21日13:30:53
     * @memberof EntrustComponent
     */
    goNew() {
        this.router.navigate(['work/entrust/entrustNew', { type: 'creat' }]);
    }

    /**
     * 外出授权 - 分页查询
     * jiagnen 2017年12月21日17:50:41
     * @param {any} data
     * @memberof EntrustComponent
     */
    tableGetPage(data) {
        this.entrustListPage.pageNum = data.page * 1 + 1;
        this.entrustListPage.pageSize = data.rows;
        this.search(true);
    }

    /**
     * 外出授权 - 删除
     * @param {any} data
     * @memberof EntrustComponent
     */
    deleteItem(e) {
        this.confirmationService.confirm({
            message: this.display.DeleteMessage,
            accept: () => {
                if (e && e.id) {
                    this.componentService.getZPStoken().subscribe((res) => {
                        if (res.code === 'SUCCESS') {
                            const params = {
                                id: e.id,
                                token: res.data
                            };
                            this.entrustService.deleteEntrust(params).subscribe((data) => {
                                if (data.code === 'SUCCESS') {
                                    this.messageService.add({ severity: 'success', summary: 'success', detail: this.display.makeSuccess });
                                    this.search();
                                } else {
                                    this.messageService.add({
                                        severity: 'error', summary: 'error',
                                        detail: data.msg || this.display.makeError
                                    });
                                }
                            });
                        }
                    });
                }
            }
        });
    }

    /**
     * 外出授权  - 编辑
     * jiagnen 2017年12月22日09:31:15
     * @memberof EntrustComponent
     */
    editItem(data) {
        if (data) {
            this.router.navigate(['work/entrust/entrustNew', { type: 'detail', id: data.id }]);
        }
    }

    /**
     * 外出授权  - 获取查询下拉框值
     * @memberof EntrustComponent
     */
    getLookupValueList() {
        this.valueListRequest.lookupType = 'entrustStatus';
        this.componentService.getLookupValueList(this.valueListRequest)
            .subscribe((res: ValueListResponse) => {
                if (res.code === 'SUCCESS') {
                    this.entrustStatus = res.data;
                }
            });

        // this.entrustService.getProcess().subscribe((data) => {
        //     if (data.code === 'SUCCESS') {
        //         this.entrustProcess = data.data;
        //     }
        // });
    }
}
