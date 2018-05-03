import { Component, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { MyapplyService } from './myApply.service';
import { MyApplySearch, MyApplySearchResponse, MyApplyPage } from '../models/myApplyModel';
import { ModalDirective } from 'ngx-bootstrap';
import { WorkBenchService } from '../workbench.service';
import { LocalStorage } from '../../../core/component/localStorage/localStorage.component';
import { AppService, NetworkConfig } from '../../../../app.service';
import { AttachmentService, GetAttachmentRequest, Attachment } from '../../../core/service/attachment.service';
import { ValueListRequest, ValueListResponse, ComponentService } from '../../../core/component/component.service';
import { MessageService } from 'primeng/components/common/messageservice';
import { ToastService } from '../../../core/service/toast.service';

@Component({
    selector: 'app-my-apply',
    templateUrl: './myApply.component.html',
    providers: [MessageService]
})

export class MyApplyComponent implements OnInit {
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

    private myApplyPage: MyApplyPage = new MyApplyPage();
    myApplySearch: MyApplySearch = new MyApplySearch();
    quarterlyList: Array<any> = [];
    allSummaryData = { data: [], total: 0 };
    pageType: String = 'detail';
    totalRecords: Number = 0;
    historyTotal: Number = 0;
    detailData: any = {}; // 列表数据
    loading: Boolean = true;

    historyData = { historyList: [], historyTotal: 0 };
    taskData: any = {}; // 单个表格数据
    tableData: Array<any> = [];
    tableConfig = {
        isNumber: false,
        isSelect: false
    };
    tableCols = [];

    getAttachmentRequest: GetAttachmentRequest = new GetAttachmentRequest();
    attachments: Array<Attachment> = [];
    returnAttachments: Array<Attachment> = [];

    valueListRequest: ValueListRequest = new ValueListRequest();
    ProcessNames: Array<any> = [];
    DocumentStatus: any;
    display: any = {};
    modalConfig: any = this.appService.modalConfig;

    constructor(
        private myapplyService: MyapplyService,
        private workBenchService: WorkBenchService,
        private ls: LocalStorage,
        private appService: AppService,
        private attachmentService: AttachmentService,
        private componentService: ComponentService,
        private toastService: ToastService
    ) { }

    ngOnInit(): void {
        this.display = this.ls.getObject('display'); // 获取显示字段
        this.tableCols = [
            { 'header': this.display.DocumentNo, 'field': 'documentNumber', 'width': '20%', 'isSort': true },
            {
                'header': this.display.Title, 'cellTemplate': this.titleCell,
                'field': 'title', 'width': '60%', 'left': true, 'isSort': true
            },
            { 'header': this.display.Processname, 'field': 'processName', 'width': '20%', 'left': true, 'isSort': true },
            { 'header': this.display.CurrentNode, 'field': 'nodeName', 'width': '20%', 'left': true, 'isSort': true },
            { 'header': this.display.CurrentApprover, 'field': 'assigneeName', 'width': '20%', 'isSort': true },
            { 'header': this.display.Status, 'field': 'statusMeaning', 'width': '20%', 'isSort': true },
            { 'header': this.display.ApplicationDate, 'field': 'creationDate', 'width': '20%', 'isSort': true }
        ];
        this.myApplyPage.pageNum = 1;
        this.myApplyPage.pageSize = 10;
        this.search(true);
        this.getLookupValueList();
    }

    /**
     * 我的申请数据请求
     * jiangen 2017年11月18日12:09:02
     * @memberof MyApplyComponent
     */
    search(boolean?) {
        if (!boolean) {
            this.myApplyPage.pageNum = 1;
        }
        this.myApplySearch = this.appService.setDate(this.myApplySearch, ['beginDate', 'endDate']);
        this.myApplySearch.languageCode = this.ls.get('language');
        this.myapplyService.getMyapplyData(this.myApplyPage, this.myApplySearch).subscribe((data: MyApplySearchResponse) => {
            if (data.code === 'SUCCESS') {
                this.tableData = data.data.list;
                this.totalRecords = data.data.total;
                this.loading = false;
            }
        });
    }

    /**
    * 我的申请 分页
    * jiangen  2017年11月22日09:56:21
    * @param {any} data  当前的pageSize和pageNum
    * @memberof ApproveListComponent
    */
    tableGetPage(data) {
        this.myApplyPage.pageNum = data.page * 1 + 1;
        this.myApplyPage.pageSize = data.rows;
        this.search(true);
    }

    /**
     * 打开详情弹窗
     * zw 2017年11月21日14:19:06
     * @param e
     * @memberof ApproveListComponent
     */
    openModal(e) {// TODO: 调用接口获取数据
        let attachmentType = '';
        this.taskData = e;
        this.getApplyInfo(e);
        if (e.receiptType === 'TT_OV_CL_AP') {
            attachmentType = 'getOtherAttachmentInfo';
        } else {
            attachmentType = 'getAttachmentInfo';
        }
        if (e.receiptType === 'TT_CL_AU_SUM_OF_FIN_PE') {
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
        // 现场索赔  和  远程索赔
        if (e.receiptType === 'TT_CL_AU_X' || e.receiptType === 'TT_CL_AU_Y') {
            this.getSuoPeiFiles(e);
        } else if (e.receiptType === 'TT_CL_AU_SUM_OF_FIN_PE') {
            //  获取 季度的表格  和所有的索赔 表格
            this.getSummaryData(e);
        } else {
            this.getAttachmentInfo(e, attachmentType);
        }
        this.getApproveHistory(e);
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
     * @param {any} e 表格行数据
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
     * 获取 附件信息
     * jn  2018年04月13日15:30:55
     * @param {any} e 订单数据
     * @param {any} fun 调用的方法
     * @memberof ApproveListComponent
     */
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

        // 获取所有流程
        this.componentService.getAllProcess().subscribe((data: any) => {
            this.ProcessNames = data.data;
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
