import { Component, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { ApplyTrackService } from './applyTrack.service';
import { Location } from '@angular/common';
import { ApplyTrackSearch, ApplyTrackPage, ApplyTrackSearchResponse } from '../models/applyTrackModel';
import { ModalDirective } from 'ngx-bootstrap';
import { WorkBenchService } from '../workbench.service';
import { AppService } from '../../../../app.service';
import { Message } from 'primeng/components/common/api';
import { LocalStorage } from '../../../core/component/localStorage/localStorage.component';
import { AttachmentService, GetAttachmentRequest, Attachment } from '../../../core/service/attachment.service';
import { ComponentService, ValueListRequest, ValueListResponse } from '../../../core/component/component.service';
import { NetworkConfig } from '../../../../app.service';
import { MessageService } from 'primeng/components/common/messageservice';
import { ToastService } from '../../../core/service/toast.service';

declare var $;

@Component({
    selector: 'app-apply-track',
    templateUrl: './applyTrack.component.html'
})

export class ApplyTrackComponent implements OnInit {
    @ViewChild('replaceModal') replaceModal: ModalDirective;
    @ViewChild('expiredModal') expiredModal: ModalDirective;
    @ViewChild('promotionsModal') promotionsModal: ModalDirective;
    @ViewChild('qualityModal') qualityModal: ModalDirective;
    @ViewChild('returnModal') returnModal: ModalDirective;
    @ViewChild('normalModal') normalModal: ModalDirective;
    @ViewChild('scenceModal') scenceModal: ModalDirective;
    @ViewChild('remoteModal') remoteModal: ModalDirective;
    @ViewChild('summaryModal') summaryModal: ModalDirective;

    @ViewChild('titleCell') titleCell: TemplateRef<any>;

    applyTrackSearch: ApplyTrackSearch = new ApplyTrackSearch();
    applyTrackPage: ApplyTrackPage = new ApplyTrackPage();
    ProcessNames: Array<any> = [];
    pageType: String = 'detail';
    loading: Boolean = false;
    showSearchBread: Boolean = false;

    detailData: any = {}; // 列表数据
    tableData: Array<any> = []; // 表格数据
    quarterlyList: Array<any> = [];
    allSummaryData = { data: [], total: 0 };
    historyData = { historyList: [], historyTotal: 0 };
    taskData: any = {}; // 单个表格数据
    totalRecords: Number = 0;
    tableConfig = {     // 表格配置信息
        isNumber: false,
        isSelect: false
    };
    tableCols = [];

    getAttachmentRequest: GetAttachmentRequest = new GetAttachmentRequest();
    attachments: Array<Attachment> = [];
    returnAttachments: Array<Attachment> = [];

    valueListRequest: ValueListRequest = new ValueListRequest();
    BusinessType: any;
    TradeTerm: any;
    DocumentStatus: any;
    display: any = {};
    modalConfig: any = this.appService.modalConfig;

    constructor(
        private applyTrackService: ApplyTrackService,
        private workBenchService: WorkBenchService,
        private ls: LocalStorage,
        private appService: AppService,
        private attachmentService: AttachmentService,
        private componentService: ComponentService,
        private toastService: ToastService
    ) {

    }

    ngOnInit(): void {
        const locationHas = location.hash;
        locationHas.indexOf('QueryCenter/DocumentInquiry') === -1 ? this.showSearchBread = false : this.showSearchBread = true;
        this.display = this.ls.getObject('display'); // 获取显示字段
        this.tableCols = [
            { 'header': this.display.DocumentNo, 'field': 'documentNumber', 'width': '50%', 'isSort': true },
            {
                'header': this.display.Title, 'cellTemplate': this.titleCell,
                'field': 'title', 'width': '80%', 'left': true, 'isSort': true
            },
            { 'header': this.display.Processname, 'field': 'documentName', 'width': '50%', 'left': true, 'isSort': true },
            { 'header': this.display.CurrentNode, 'field': 'nodeName', 'width': '40%', 'left': true, 'isSort': true },
            { 'header': this.display.CurrentApprover, 'field': 'assigneeName', 'width': '40%', 'isSort': true },
            { 'header': this.display.Status, 'field': 'statusMeaning', 'width': '40%', 'isSort': true },
            { 'header': this.display.ApplicationDate, 'field': 'creationDate', 'width': '40%', 'isSort': true },
            { 'header': this.display.Initiator, 'field': 'creatorName', 'width': '40%', 'isSort': true },
            { 'header': '品牌', 'field': 'brandCode', 'width': '40%', 'left': true, 'isSort': true },
            { 'header': '经销商', 'field': 'customerCode', 'width': '40%', 'left': true, 'isSort': true },
            { 'header': '索赔代码', 'field': 'claimCode', 'width': '40%', 'left': true, 'isSort': true },
            { 'header': '大区', 'field': 'regionName', 'width': '40%', 'left': true, 'isSort': true },
            { 'header': '大区经理', 'field': 'regionManagrName', 'width': '40%', 'left': true, 'isSort': true },
            { 'header': 'PR号', 'field': 'prNo', 'width': '40%', 'left': true, 'isSort': true },
            { 'header': '批次', 'field': 'batchNo', 'width': '40%', 'left': true, 'isSort': true },
            { 'header': '订单号', 'field': 'orderNo', 'width': '40%', 'left': true, 'isSort': true },
            { 'header': '申请条数', 'field': 'quantity', 'width': '40%', 'left': true, 'isSort': true },
            { 'header': '申请金额', 'field': 'amount', 'width': '40%', 'left': true, 'isSort': true },
            { 'header': '罚款金额', 'field': 'penaltAmount', 'width': '40%', 'left': true, 'isSort': true },
            { 'header': '罚款总金额', 'field': 'totalFineCase', 'width': '40%', 'left': true, 'isSort': true },
            { 'header': '销毁总数量', 'field': 'desQuantity', 'width': '40%', 'left': true, 'isSort': true },
            { 'header': '销毁总金额', 'field': 'desAmount', 'width': '40%', 'left': true, 'isSort': true }
        ];
        this.applyTrackPage.pageNum = 1;
        this.applyTrackPage.pageSize = 10;
        this.search();
        this.getLookupValueList();
    }

    /**
     * 审批列表审批 分页
     * jiangen  2017年11月18日15:51:46
     * @param {any} data  当前的pageSize和pageNum
     * @memberof ApproveListComponent
     */
    tableGetPage(data) {
        this.applyTrackPage.pageNum = data.page * 1 + 1;
        this.applyTrackPage.pageSize = data.rows;
        this.search(true);
    }

    /**
     * 请求申请单追踪数据
     * jiangen  2017年11月18日10:56:21
     * @memberof ApplyTrackComponent
     */
    search(boolean?) {
        if (!boolean) {
            this.applyTrackPage.pageNum = 1;
        }
        this.applyTrackSearch = this.appService.setDate(
            this.applyTrackSearch, ['beginDate', 'endDate']);
        this.applyTrackSearch.languageCode = this.ls.get('language');
        // this.applyTrackSearch.roleName = this.ls.get("userId");
        this.applyTrackService.getApplyTrackData(this.applyTrackPage, this.applyTrackSearch).subscribe((data: ApplyTrackSearchResponse) => {
            if (data.code === 'SUCCESS') {
                this.tableData = data.data.list;
                this.totalRecords = data.data.total;
                this.loading = false;
            }
        });
    }

    /**
 * 打开详情弹窗
 * zw 2017年11月21日14:19:06
 * @param e
 * @memberof ApproveListComponent
 */
    openModal(e) {
        this.taskData = e;
        let attachmentType = '';
        // 如果是过期索赔
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
        // 现场索赔  和  远程索赔
        if (e.receiptType === 'TT_CL_AU_X' || e.receiptType === 'TT_CL_AU_Y') {
            this.getSuoPeiFiles(e);
        } else if (e.receiptType === 'TT_CL_AU_SUM_OF_FIN_PE') {
            //  获取 季度的表格  和所有的索赔 表格
            this.getSummaryData(e);
        } else {
            this.getAttachmentInfo(e, attachmentType);
        }
        // 回运零件   如果是最后一个节点
        if (e.receiptType === 'TT_DE_OF_RE_PA') {
            if (e.status === 'COMPLETED') {
                this.taskData.lastNode = true;
                this.taskData.lastType = true;
            }
        }
        this.getApproveHistory(e);
        this.getApplyInfo(e);
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
    }

    /**
     * 关闭打开的modal
     * zw  2017年11月21日14:20:32
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
    }

    /**
     * 获取审批历史记录
     * jiangen 2017年11月28日16:52:24
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
        this.valueListRequest.lookupType = 'DocumentStatus';
        this.componentService.getLookupValueList(this.valueListRequest)
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
        //   获取所有流程
        this.componentService.getAllProcess().subscribe((data: any) => {
            this.ProcessNames = data.data;
        });
    }

    /**
     * 页面加载完毕  表格滚动时  计算距离
     * jiagnen  2017年12月18日10:15:31
     * @memberof ApplyTrackComponent
     */
    // tslint:disable-next-line:use-life-cycle-interface
    ngAfterViewInit() {
        $(function () {
            const table = $('.ui-datatable').eq(0);
            $(table).on('scroll', function () {
                const left = $(this).find('.ui-datatable-tablewrapper').eq(0).offset().left;
                $('.fixed-div').eq(0).css('left', left);
            });
        });
    }

    getAttachmentInfo(e, fun) {
        let params = {};
        if (e.receiptType !== 'TT_DE_OF_RE_PA' ||
            (e.receiptType === 'TT_DE_OF_RE_PA' && e.status !== 'COMPLETED')) {
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
        } else if (e.receiptType === 'TT_DE_OF_RE_PA' && e.status === 'COMPLETED') {
            params = [
                {
                    'url': NetworkConfig.path.getuploadFiles, 'params': {
                        sourceId: e.documentNumber,
                        sourceType: e.receiptType
                    }
                },
                {
                    'url': NetworkConfig.path.getuploadFiles, 'params': {
                        sourceId: e.documentNumber,
                        sourceType: e.receiptType + '-last'
                    }
                }
            ];
            this.attachmentService.getReturnLast(params).subscribe((data) => {
                console.log(data);
                if (data[0].code === 'SUCCESS') {
                    this.attachments = data[0].data;
                }
                if (data[1].code === 'SUCCESS') {
                    this.returnAttachments = data[1].data;
                }
            });
        }
    }

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
}

