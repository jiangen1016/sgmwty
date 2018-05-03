import { Component, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { HandleBillService } from './handleBill.service';
import { ModalDirective } from 'ngx-bootstrap';
import { AppService } from '.././../../../app.service';
import { HandleService } from '../handle.service';
import { HandleBillSearch, HandleBillPage, HandleBillResponse } from '../models/handleBill';
import { LocalStorage } from '../../../core/component/localStorage/localStorage.component';
import { AttachmentService, GetAttachmentRequest, Attachment } from '../../../core/service/attachment.service';
import { ValueListRequest, ComponentService, ValueListResponse } from '../../../core/component/component.service';
import { NetworkConfig } from '../../../../app.service';
import { MessageService } from 'primeng/components/common/messageservice';
import { ToastService } from '../../../core/service/toast.service';

declare var $;
@Component({
    selector: 'app-handle-bill',
    templateUrl: './handleBill.component.html'
})


export class HandleBillComponent implements OnInit {
    @ViewChild('ExpiredModal') ExpiredModal: ModalDirective;
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
    // isHistory: Boolean = true;
    handleBillSearch: HandleBillSearch = new HandleBillSearch();
    HandleBillPage: HandleBillPage = new HandleBillPage();
    loading: Boolean = true;
    ProcessNames: Array<any> = [];

    tableConfig = {
        isNumber: true,
        isSelect: false
    };
    totalRecords: Number = 0;
    modalService: any;
    detailData: any = {}; // 列表数据
    historyData = { historyList: [], historyTotal: 0 };
    taskData: any = {}; // 单个表格数据
    tableData: Array<any> = [];
    brandList: Array<any> = [];
    pageType: String = 'detail';
    tableCols = [];

    startDate: Date;
    endDate: Date;
    quarterlyList: Array<any> = [];
    allSummaryData = { data: [], total: 0 };

    getAttachmentRequest: GetAttachmentRequest = new GetAttachmentRequest();
    attachments: Array<Attachment> = [];
    returnAttachments: Array<Attachment> = [];

    valueListRequest: ValueListRequest = new ValueListRequest();
    BusinessType: any;
    TradeTerm: any;
    documentStatus: Array<any> = [];
    display: any = {};
    modalConfig: any = this.appService.modalConfig;


    constructor(
        private handleBillService: HandleBillService,
        private appService: AppService,
        private ls: LocalStorage,
        private handleService: HandleService,
        private attachmentService: AttachmentService,
        private componentService: ComponentService,
        private toastService: ToastService
        // assigneesName
    ) {
    }

    ngOnInit(): void {
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
            // // { 'header': this.display.BusinessType, 'field': 'businessCategory', 'width': '40%', 'left': true, 'isSort': true },
            // // { 'header': this.display.Customer, 'field': 'customerCode', 'width': '40%', 'left': true, 'isSort': true },
            // // { 'header': this.display.Project, 'field': 'projectCode', 'width': '40%', 'left': true, 'isSort': true },
            // // { 'header': 'Model Year', 'field': 'modelYear', 'width': '40%', 'isSort': true },
            // // { 'header': this.display.TradeTerm, 'field': 'tradeTermCode', 'width': '40%', 'left': true, 'isSort': true },
            // // // qsNumber
            // // { 'header': this.display.ContractNo, 'field': 'ctNumber', 'width': '40%', 'left': true, 'isSort': true },
            // // { 'header': this.display.COSContractNo, 'field': 'cosNumber', 'width': '40%', 'left': true, 'isSort': true },
            // // { 'header': this.display.QuoteNumber, 'field': 'qsNumber', 'width': '40%', 'left': true, 'isSort': true },
            // // { 'header': this.display.ManufacturingStage, 'field': 'phaseCode', 'width': '40%', 'left': true, 'isSort': true },
            // // { 'header': this.display.Quantity, 'field': 'sampVehCount', 'width': '40%', 'left': true, 'isSort': true },
            // // { 'header': this.display.TotalAmount, 'field': 'totalAmount', 'width': '40%', 'left': true, 'isSort': true },
            // // { 'header': this.display.Currency, 'field': 'currency', 'width': '40%', 'left': true, 'isSort': true },
            // // { 'header': this.display.ExchangeRate, 'field': 'exchangeRate', 'width': '40%', 'left': true, 'isSort': true },
            // { 'header': this.display.EffectiveDate, 'field': 'activeDate', 'width': '40%', 'isSort': true }
        ];

        this.HandleBillPage.pageNum = 1;
        this.HandleBillPage.pageSize = 10;
        this.search();
        this.getLookupValueList();
    }

    /**
     * 获取单据处理表格数据
     * jiangen 2017年11月25日17:30:39
     * @memberof HandleBillComponent
     */
    search(boolean?) {
        if (!boolean) {
            this.HandleBillPage.pageNum = 1;
        } this.handleBillSearch = this.appService.setDate(
            this.handleBillSearch, ['endDate', 'beginDate']);
        this.handleBillSearch.languageCode = this.ls.get('language');
        this.handleBillService.getHandleBillData(this.HandleBillPage, this.handleBillSearch).subscribe((data) => {
            if (data.code === 'SUCCESS') {
                this.tableData = data.data.list;
                this.totalRecords = data.data.total;
                this.loading = false;
            }
        });
    }

    /**
    * 单据处理 分页
    * jiangen  2017年11月18日15:51:46
    * @param {any} data  当前的pageSize和pageNum
    * @memberof ApproveListComponent
    */
    tableGetPage(data) {
        this.HandleBillPage.pageNum = data.page * 1 + 1;
        this.HandleBillPage.pageSize = data.rows;
        this.search(true);
    }


    /**
    * 打开详情弹窗
    * zw 2017年11月21日14:19:06
    * @param e
    * @memberof ApproveListComponent
    */
    openModal(e) {
        // this.pageType = 'detail';
        let attachmentType = '';
        this.taskData = e;
        if (e.receiptType === 'TT_OV_CL_AP') {
            attachmentType = 'getOtherAttachmentInfo';
        } else {
            attachmentType = 'getAttachmentInfo';
        }
        // 回运零件
        if (e.receiptType === 'TT_DE_OF_RE_PA') {
            if ((e.nodeName === 'Parts Scrapping Supplier Confirm' && e.status === 'PROCESSING') || e.status === 'COMPLETED') {
                this.taskData.lastNode = true;
                this.taskData.lastType = true;
                this.taskData.onlyCanApprove = true;
            } else if (e.nodeName === 'FD Commercial Control Director Confirm') {
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
        this.getApplyInfo(e);
        // this.getAttachmentInfo(e, attachmentType);
        this.getApproveHistory(e);
        setTimeout((data) => {
            switch (e.receiptType) {
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
        }, 100);
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
        this.search();
        this.modalService.unsubscribe();
    }

    /**
     * 单据详情获取
     *jiangen  2017年11月23日11:30:09
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

    getAttachmentInfo(e, fun) {
        let params = {};
        if (e.receiptType !== 'TT_DE_OF_RE_PA' || (e.receiptType === 'TT_DE_OF_RE_PA' &&
            (e.status !== 'COMPLETED' && !this.taskData.lastNode))) {
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
        } else if (e.receiptType === 'TT_DE_OF_RE_PA' && (e.status === 'COMPLETED' || this.taskData.lastNode)) {
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
                if (data[0].code === 'SUCCESS') {
                    this.attachments = data[0].data;
                }
                if (data[1].code === 'SUCCESS') {
                    this.returnAttachments = data[1].data;
                }
            });
        }
    }

    /**
     * 根据lookupType获取对应的值列表
     * zw  2017年11月29日15:20:04
     */
    getLookupValueList() {
        this.componentService.getAllProcess().subscribe((data: any) => {
            this.ProcessNames = data.data;
        });

        this.valueListRequest.lookupType = 'DocumentStatus';
        this.componentService.getLookupValueList(this.valueListRequest)
            .subscribe((res: ValueListResponse) => {
                if (res.code === 'SUCCESS') {
                    this.documentStatus = res.data.list;
                    for (let i = 0; i < this.documentStatus.length; i++) {
                        if (this.documentStatus[i]['meaning'] === 'Saved') {
                            this.documentStatus.splice(i, 1);
                            break;
                        }
                    }
                }
            });
        this.componentService.getBrandList().subscribe((res) => {
            this.brandList = res;
            console.log(res);
        });
    }

    /**
     * 导出功能
     * tangwei 2017年12月5日19点05分
     * @memberof ApproveListComponent
     */
    export() {
        // tslint:disable-next-line:prefer-const
        let DownLoadFile = function (options) {
            const config = $.extend(true, { method: 'post' }, options);
            const $iframe = $('<iframe id="down-file-iframe" />');
            const $form = $('<form target="down-file-iframe" method="' + config.method + '" />');
            $form.attr('action', config.url);
            // tslint:disable-next-line:forin
            for (const key in config.data) {
                $form.append('<input type="hidden" name="' + key + '" value="' + config.data[key] + '" />');
            }
            $iframe.append($form);
            $(document.body).append($iframe);
            $form[0].submit();
            $iframe.remove();
        };

        const newObj = {};
        for (const obj in this.handleBillSearch) {
            if (this.handleBillSearch[obj]) {
                newObj[obj] = this.handleBillSearch[obj];
            }
        }
        DownLoadFile({
            url: NetworkConfig.domain + NetworkConfig.path.exportApproveList, // 请求的url
            data: newObj // 要发送的数据
        });
    }

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
