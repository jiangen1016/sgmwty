import { Component, OnInit, TemplateRef, ViewChild, ElementRef, Input, Output } from '@angular/core';
import { NgForm, NgControl } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { TableComponent } from '../../../core/component/table/table.component';
import { ApplyListPage, ApplyListSearch, ApplyListSearchResponse, MutileApprove } from '../models/applyListModel';
import { ApproveListService } from '../approveList/approveList.service';
import { LocalStorage } from '../../../core/component/localStorage/localStorage.component';
import { WorkBenchService } from '../workbench.service';
import { AttachmentService, GetAttachmentRequest, Attachment } from '../../../core/service/attachment.service';
import { ValueListRequest, ComponentService, ValueListResponse } from '../../../core/component/component.service';
import { NetworkConfig } from '../../../../app.service';
import { AppService } from '../../../../app.service';
import { ToastService } from '../../../core/service/toast.service';
import { Subject } from 'rxjs/Subject';
import { ReplaceComponent } from '../../../core/component/modal/replace/replace.component';
import { ExpiredComponent } from '../../../core/component/modal/expired/expired.component';
import { PromotionsComponent } from '../../../core/component/modal/promotions/promotions.component';
import { QualityComponent } from '../../../core/component/modal/quality/quality.component';
import { ReturnComponent } from '../../../core/component/modal/return/return.component';
import { NormalComponent } from '../../../core/component/modal/document/document.component';
import { SceneComponent } from '../../../core/component/modal/scene/scence.component';
import { RemoteComponent } from '../../../core/component/modal/remote/remote.component';
import { SummaryComponent } from '../../../core/component/modal/summary/summary.component';

@Component({
    selector: 'app-approve-list',
    templateUrl: './approveList.component.html'
})
export class ApproveListComponent implements OnInit {
    @ViewChild('replaceModal') replaceModal: ModalDirective;
    @ViewChild('expiredModal') expiredModal: ModalDirective;
    @ViewChild('promotionsModal') promotionsModal: ModalDirective;
    @ViewChild('qualityModal') qualityModal: ModalDirective;
    @ViewChild('returnModal') returnModal: ModalDirective;
    @ViewChild('normalModal') normalModal: ModalDirective;
    @ViewChild('scenceModal') scenceModal: ModalDirective;
    @ViewChild('remoteModal') remoteModal: ModalDirective;
    @ViewChild('summaryModal') summaryModal: ModalDirective;

    @ViewChild('replaceComponent') replaceComponent: ReplaceComponent;
    @ViewChild('expiredComponent') expiredComponent: ExpiredComponent;
    @ViewChild('promotionsComponent') promotionsComponent: PromotionsComponent;
    @ViewChild('qualityComponent') qualityComponent: QualityComponent;
    @ViewChild('returnComponent') returnComponent: ReturnComponent;
    @ViewChild('normalComponent') normalComponent: NormalComponent;
    @ViewChild('scenceComponent') scenceComponent: SceneComponent;
    @ViewChild('remoteComponent') remoteComponent: RemoteComponent;
    @ViewChild('summaryComponent') summaryComponent: SummaryComponent;

    @ViewChild('approveModal') approveModal: ModalDirective;

    @ViewChild('titleCell') titleCell: TemplateRef<any>;
    @ViewChild('approveTable') approveTable: TableComponent;
    applyListSearch: ApplyListSearch = new ApplyListSearch();
    applyListPage: ApplyListPage = new ApplyListPage();
    mutileApprove: MutileApprove = new MutileApprove();
    attachments: Array<Attachment> = [];
    returnAttachments: Array<Attachment> = [];
    pageType: String = 'approve'; // modal 类型
    detailData: any = {}; // 列表数据
    historyData = { historyList: [], historyTotal: 0 }; // 审批历史 数据
    taskData: any = {}; // 单个表格数据
    tableData: Array<any> = [];
    brandList: Array<any> = [];
    totalRecords = 0;
    historyTotal = 0;
    quarterlyList: Array<any> = [];
    allSummaryData = { data: [], total: 0 };

    loading = false;
    modalService: any;
    tableConfig = {
        isNumber: false,
        isSelect: true,
        selectionMode: 'multiple'
    };
    tableCols = [];
    types: Array<any> = [
        { 'name': '类型1' },
        { 'name': '类型2' },
        { 'name': '类型3' }
    ];
    getAttachmentRequest: GetAttachmentRequest = new GetAttachmentRequest();
    valueListRequest: ValueListRequest = new ValueListRequest();
    DocumentStatus: any;
    ProcessNames: Array<any> = [];
    display: any = {};
    disabled = false;
    modalConfig: any = this.appService.modalConfig;

    constructor(
        private approveListService: ApproveListService,
        private ls: LocalStorage,
        private workBenchService: WorkBenchService,
        private attachmentService: AttachmentService,
        private componentService: ComponentService,
        private appService: AppService,
        private toastService: ToastService
    ) { }

    ngOnInit() {
        this.display = this.ls.getObject('display'); // 获取显示字段
        this.applyListPage.pageNum = 1;
        this.applyListPage.pageSize = 10;
        this.tableCols = [
            { 'header': this.display.DocumentNo, 'field': 'documentNumber', 'width': '20%', 'isSort': true },
            {
                'header': this.display.Title, 'cellTemplate': this.titleCell,
                'field': 'title', 'width': '30%', 'left': true, 'isSort': true
            },
            { 'header': this.display.Processname, 'field': 'processName', 'width': '20%', 'left': true, 'isSort': true },
            { 'header': this.display.Processnode, 'field': 'nodeName', 'width': '20%', 'left': true, 'isSort': true },
            { 'header': this.display.CurrentApprover, 'field': 'assigneeName', 'width': '15%', 'isSort': true },
            { 'header': this.display.AuthorizedPerson, 'field': 'surrogateName', 'width': '15%', 'isSort': true },
            { 'header': this.display.Status, 'field': 'statusMeaning', 'width': '10%', 'isSort': true },
            { 'header': this.display.Initiator, 'field': 'creatorName', 'width': '10%', 'left': true, 'isSort': true },
            { 'header': this.display.ApplicationDate, 'field': 'creationDate', 'width': '10%', 'isSort': true }
        ];
        this.search();
        this.getLookupValueList();
    }

    /**
     * 审批列表 分页
     * jiangen 2018年04月13日15:30:05
     * @param {any} data  当前的pageSize和pageNum
     * @memberof ApproveListComponent
     */
    tableGetPage(data) {
        this.applyListPage.pageNum = data.page * 1 + 1;
        this.applyListPage.pageSize = data.rows;
        this.search(true);
    }

    /**
     * 获取审批列表列表
     * jiangen  2018年04月13日15:30:15
     * @memberof ApproveListComponent
     */
    search(boolean?) {
        if (!boolean) {
            this.applyListPage.pageNum = 1;
        }
        this.applyListSearch.languageCode = this.ls.get('language');
        this.applyListSearch = this.appService.setDate(this.applyListSearch, ['beginDate', 'endDate']);
        this.approveListService.getApproveList(this.applyListPage, this.applyListSearch).subscribe((data: ApplyListSearchResponse) => {
            if (data.code === 'SUCCESS') {
                this.tableData = data.data.list;
                this.totalRecords = data.data.total;
                this.loading = false;
            }
        });
    }

    /**
     * 打开详情弹窗
     * jn  2018年04月13日15:30:21
     * @param e
     * @memberof ApproveListComponent
     */
    openModal(e) {
        let attachmentType = '';
        this.pageType = 'approve';
        this.taskData = e;
        if (this.taskData.status === 'RETURN') {
            this.taskData.canDeny = true;
            this.taskData.editApprove = true;
            this.pageType = 'create';
            if (this.taskData.createdBy === this.ls.get('userId')) {
                this.taskData.isCreated = true;
            }
        }
        // 过期索赔
        if (e.receiptType === 'TT_OV_CL_AP') {
            attachmentType = 'getOtherAttachmentInfo';
        } else {
            attachmentType = 'getAttachmentInfo';
        }
        // 回运零件
        if (e.receiptType === 'TT_DE_OF_RE_PA') {
            if (e.nodeName === 'Parts Scrapping Supplier Confirm' && e.status === 'PROCESSING') {
                this.taskData.lastNode = true;
                this.taskData.onlyCanApprove = true;
            } else if (e.nodeName === 'FD Commercial Control Director Confirm') {
                this.taskData.onlyCanApprove = true;
            }
        }
        // 质量销毁  最后一个节点 只能确认
        if (e.receiptType === 'TT_QU_DE') {
            if (e.nodeName === 'Warranty Staff' && e.status === 'PROCESSING') {
                this.taskData.onlyCanApprove = true;
            }
        }
        if (e.receiptType === 'TT_CL_AU_X' || e.receiptType === 'TT_CL_AU_Y') {
            this.getSuoPeiFiles(e);
        } else if (e.receiptType === 'TT_CL_AU_SUM_OF_FIN_PE') {
            //  获取 季度的表格  和所有的索赔 表格
            this.getSummaryData(e);
        } else {
            this.getAttachmentInfo(e, attachmentType);
        }
        this.getApproveHistory(e);
        this.getApplyInfo(e);
        setTimeout((data) => {
            switch (e.receiptType || e.documentType) {
                // 免费换油
                case 'TT_FR_OIL_CH':
                    this.replaceModal.show();
                    break;
                // 过期索赔
                case 'TT_OV_CL_AP':
                    this.expiredModal.show();
                    break;
                // 促销活动
                case 'TT_BR_CA_TE_SU':
                    this.promotionsModal.show();
                    break;
                //  质量销毁
                case 'TT_QU_DE':
                    this.qualityModal.show();
                    break;
                // 零件回运
                case 'TT_DE_OF_RE_PA':
                    console.log(this.taskData);
                    this.returnModal.show();
                    break;
                // 文档审批
                case 'TT_OTH_PRC':
                    this.normalModal.show();
                    break;
                // 现场索赔
                case 'TT_CL_AU_X':
                    this.scenceModal.show();
                    break;
                // 远程索赔
                case 'TT_CL_AU_Y':
                    this.remoteModal.show();
                    break;
                // 索赔汇总
                case 'TT_CL_AU_SUM_OF_FIN_PE':
                    this.summaryModal.show();
                    break;
            }
            this.modalService = this.appService.closeModal$.subscribe((modalType: string) => {
                this.modalService.unsubscribe();
                this.closeModal(modalType);
            });
        }, 200);
    }

    /**
     * 关闭打开的modal
     * jn 2018年04月13日15:30:31
     * @param {any} modalType  modal类型
     * @memberof ApproveListComponent
     */
    closeModal(modalType) {
        switch (modalType) {
            case 'replaceModal':
                this.replaceModal.hide();
                break;
            case 'expiredModal':
                this.expiredModal.hide();
                break;
            case 'promotionsModal':
                this.promotionsModal.hide();
                break;
            case 'qualityModal':
                this.qualityModal.hide();
                break;
            case 'returnModal':
                this.returnModal.hide();
                break;
            case 'normalModal':
                this.normalModal.hide();
                break;
            case 'scenceModal':
                this.scenceModal.hide();
                break;
            case 'remoteModal':
                this.remoteModal.hide();
                break;
            case 'summaryModal':
                this.summaryModal.hide();
                break;
        }
        this.search();
        this.modalService.unsubscribe();
    }

    /**
     * 获取 附件信息
     * jn  2018年04月13日15:30:55
     * @param {any} e 订单数据
     * @param {any} fun 调用的方法
     * @memberof ApproveListComponent
     */
    getAttachmentInfo(e, fun) {
        let params = {};
        params = {
            sourceId: e.documentNumber,
            sourceType: e.receiptType
        };
        this.attachmentService[fun](params)
            .subscribe((res) => {
                if (res.code === 'SUCCESS') {
                    console.log(res);
                    this.attachments = res.data;
                }
            });
    }

    getSuoPeiFiles(e) {
        const params = {
            sourceId: e.documentNumber
        };
        this.attachmentService.getSuoPeiFiles(params).subscribe((res) => {
            if (res.code === 'SUCCESS') {
                this.attachments = res.data;
            } else {
                this.toastService.showError('ERROR', res.msg || '附件查询失败！');
            }
        });
    }


    getSummaryData(e) {
        const params = [
            {
                'url': NetworkConfig.path.getQuarterlyInfo, 'params': {
                    sourceId: e.documentNumber,
                    sourceType: e.receiptType
                }
            },
            {
                'url': NetworkConfig.path.getAllSummary, 'params': {
                    pageSize: 10,
                    pageNum: 1
                }
            }
        ];
        this.attachmentService.getAllSummary(params).subscribe((res) => {
            console.log(res);
            if (res[0].code === 'SUCCESS' && res[0].data && res[0].data !== 'undefind') {
                this.quarterlyList = res[0].data;
                console.log(this.quarterlyList);
            }
            if (res[1].code === 'SUCCESS') {
                this.allSummaryData.data = res[1].data.list;
                this.allSummaryData.total = res[1].data.total;
            }
        });
    }

    /**
     * 单据详情获取
     * jn  2018年04月13日15:31:20
     * @param {any} e  表格单据数据
     * @memberof DraftsBoxComponent
     */
    getApplyInfo(e) {
        const params = {
            receiptType: e.receiptType,
            documentNumber: e.documentNumber
        };
        this.componentService.getApproveInfo(params).subscribe((data: any) => {
            if (data.code === 'SUCCESS') {
                this.detailData = data.data;
            }
        });
    }

    /**
     * 获取审批历史记录
     * jiangen 2018年04月13日15:31:29
     * @param {any} e
     * @memberof ApproveListComponent
     */
    getApproveHistory(e) {
        const params = {
            sourceId: e.documentNumber
        };
        this.componentService.getHistory(params).subscribe((data => {
            if (data.code === 'SUCCESS') {
                this.historyData.historyList = data.data.list;
                this.historyData.historyTotal = data.data.total;
            }
        }));
    }


    /**
     * 根据lookupType获取对应的值列表
     * zw  2017年11月29日15:20:04
     */
    getLookupValueList() {
        // 获取品牌    会改动
        this.componentService.getBrandList().subscribe((res) => {
            this.brandList = res;
        });
        // 获取状态
        const statusParams = {
            lookupType: 'DocumentStatus'
        };
        this.componentService.getLookupValueList(statusParams)
            .subscribe((res: ValueListResponse) => {
                if (res.code === 'SUCCESS') {
                    this.DocumentStatus = res.data.list;
                    for (let i = 0; i < this.DocumentStatus.length; i++) {
                        if (this.DocumentStatus[i]['meaning'] === 'Saved') {
                            this.DocumentStatus.splice(i, 1);
                            break;
                        }
                    }
                }
            });

        // 获取 流程名称 列表
        this.componentService.getAllProcess().subscribe((data: any) => {
            this.ProcessNames = data.data;
        });
    }

    // 选择
    onSelectRow(e) {

    }

    // 批量审批
    batchApprve() {
        console.log(this.approveTable.selectedTable);
        if (!this.approveTable.selectedTable.length) {
            this.toastService.showInfo('INFO', '请先选择一个流程！');
        } else {
            this.approveModal.show();
        }
    }

    /**
     * 关闭  批量审批modal
     * @memberof ApproveListComponent
     */
    approveModalHide() {
        this.approveModal.hide();
        this.mutileApprove = new MutileApprove();
        this.disabled = false;
    }

    doMutileApprove() {
        this.disabled = true;
        if (!this.mutileApprove.selectedValue) {
            this.toastService.showInfo('INFO', this.display.ApproveMessage);
        } else if (this.mutileApprove.selectedValue !== 'APPROVE' && !this.mutileApprove.approvalComment) {
            this.toastService.showInfo('INFO', this.display.OpinionMessage);
        } else {
            // 这里调用批量审批的接口
            console.log(this.approveTable.selectedTable);
            const getTokenParams = {
                approver: this.approveTable.selectedTable[0].assignee
            };
            const taskIdArr = this.approveTable.selectedTable.map(item => item.taskId);
            console.log(taskIdArr);
            // this.componentService.getToken(getTokenParams).subscribe((data) => {
            //     if (data.resultCode === 'SUCCESS') {
            //         const params = {
            //             taskId: taskIdArr.join(';'),
            //             outcome: this.mutileApprove.selectedValue,
            //             token: data.token
            //         };
            //         console.log('审批传这个');
            //         console.log(params);
            //         this.componentService.approve(params).subscribe((result) => {
            //             // resultCode errorMsg
            //             console.log(result);
            //             if (taskIdArr && taskIdArr.length === 1) {
            //                 if (result.resultCode === 'SUCCESS') {
            //                     this.toastService.showSuccess('SUCCESS', this.display.makeSuccess);
            //                 } else {
            //                     this.toastService.showError('ERROR', this.display.makeError);
            //                 }
            //             } else {
            //                 if (result.successTaskIs) {
            //                 }
            //             }
            //         });
            //     }
            // });
            // this.toastService.showSuccess('SUCCESS', '审批成功');
            // this.approveModalHide();
        }
    }
}
