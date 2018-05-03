import { Component, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { DraftsBoxSearch, DraftsBoxSearchResponse, DraftsBoxPage } from '../models/draftsBoxModel';
import { DraftsBoxService } from './draftsBox.service';
import { ModalDirective } from 'ngx-bootstrap';
import { WorkBenchService } from '../workbench.service';
import { AppService } from '../../../../app.service';
import { LocalStorage } from '../../../core/component/localStorage/localStorage.component';
import { AttachmentService, GetAttachmentRequest, Attachment } from '../../../core/service/attachment.service';
import { ValueListRequest, ComponentService, ValueListResponse } from '../../../core/component/component.service';
import { ConfirmationService } from 'primeng/primeng';
import { ToastService } from '../../../core/service/toast.service';

@Component({
    selector: 'app-drafts-box',
    templateUrl: './draftsBox.component.html',
    providers: [ConfirmationService]
})

export class DraftsBoxComponent implements OnInit {

    @ViewChild('replaceModal') replaceModal: ModalDirective;
    @ViewChild('expiredModal') expiredModal: ModalDirective;
    @ViewChild('promotionsModal') promotionsModal: ModalDirective;
    @ViewChild('qualityModal') qualityModal: ModalDirective;
    @ViewChild('returnModal') returnModal: ModalDirective;
    @ViewChild('normalModal') normalModal: ModalDirective;

    @ViewChild('titleCell') titleCell: TemplateRef<any>;
    @ViewChild('opationCell') opationCell: TemplateRef<any>;

    draftsBoxSearch: DraftsBoxSearch = new DraftsBoxSearch();
    private draftsBoxPage: DraftsBoxPage = new DraftsBoxPage();
    processNames: Array<any> = [];
    brandList: Array<any> = [];
    cumList: Array<any> = [];
    pageType: String = 'create';
    detailData: any = {}; // 列表数据
    tableData: Array<any> = []; // 表格显示的数据
    totalRecords: Number = 0;
    loading: Boolean = true;

    BusinessType: any;
    TradeTerm: any;
    // 表格配置
    tableConfig = {
        isNumber: true,
        isSelect: false
    };
    // 表格参数
    tableCols = [];

    getAttachmentRequest: GetAttachmentRequest = new GetAttachmentRequest();
    valueListRequest: ValueListRequest = new ValueListRequest();
    attachments: Array<Attachment> = [];
    display: any = {};
    modalConfig: any = this.appService.modalConfig;


    constructor(
        private draftsBoxService: DraftsBoxService,
        private workBenchService: WorkBenchService,
        private ls: LocalStorage,
        private appService: AppService,
        private attachmentService: AttachmentService,
        private componentService: ComponentService,
        private toastService: ToastService,
        private confirmationService: ConfirmationService
    ) {

    }

    ngOnInit(): void {
        this.display = this.ls.getObject('display'); // 获取显示字段
        this.draftsBoxPage.pageNum = 1;
        this.draftsBoxPage.pageSize = 4;
        this.search();
        this.getLookupValueList();
        this.tableCols = [
            { 'header': this.display.DocumentNo, 'field': 'documentNumber', 'width': '20%', 'isSort': true },
            {
                'header': this.display.Title, 'cellTemplate': this.titleCell,
                'field': 'title', 'width': '30%', 'left': true, 'isSort': true
            },
            { 'header': this.display.Processname, 'field': 'processName', 'width': '30%', 'left': true, 'isSort': true },
            { 'header': this.display.ApplicationDate, 'field': 'creationDate', 'width': '20%', 'isSort': true },
            { 'header': this.display.Operation, 'cellTemplate': this.opationCell, 'field': 'do', 'width': '10%', 'isSort': false }
        ];
    }

    /**
    * 审批列表审批 分页
    * jiangen  2017年11月18日15:51:46
    * @param {any} data  当前的pageSize和pageNum
    * @memberof ApproveListComponent
    */
    tableGetPage(data) {
        console.log(data);
        this.draftsBoxPage.pageNum = data.page * 1 + 1;
        this.draftsBoxPage.pageSize = data.rows;
        this.search(true);
    }

    /**
     * 草稿箱数据请求
     * jiangen  2017年11月16日13:44:41
     * @params 请求参数
     * @memberof DraftsBoxComponent
     */
    search(boolean?) {
        if (!boolean) {
            this.draftsBoxPage.pageNum = 1;
        }
        this.draftsBoxSearch = this.appService.setDate(this.draftsBoxSearch, ['beginDate', 'endDate']);
        this.draftsBoxSearch.languageCode = this.ls.get('language');
        this.draftsBoxSearch.createdBy = this.ls.get('userId');
        this.draftsBoxService.getDraftsBoxData(this.draftsBoxPage, this.draftsBoxSearch).subscribe((data: DraftsBoxSearchResponse) => {
            if (data.code = 'SUCCESS') {
                this.tableData = data.data.list;
                this.totalRecords = data.data.total;
                this.loading = false;
            } else {
                this.tableData = [];
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
        // TODO: 调用接口获取数据
        let attachmentType = '';
        this.getApplyInfo(e);
        if (e.receiptType === 'TT_OV_CL_AP') {
            attachmentType = 'getOtherAttachmentInfo';
        } else {
            attachmentType = 'getAttachmentInfo';
        }
        this.getAttachmentInfo(e, attachmentType);
        switch (e.receiptType) {
            // 免费换油
            case 'TT_FR_OIL_CH':
                this.replaceModal.show();
                break;
            // 过期索赔
            case 'TT_OV_CL_AP':
                this.expiredModal.show();
                break;
            case 'TT_BR_CA_TE_SU':
                this.promotionsModal.show();
                break;
            case 'TT_QU_DE':
                this.qualityModal.show();
                break;
            case 'TT_DE_OF_RE_PA':
                this.returnModal.show();
                break;
            case 'TT_OTH_PRC':
                this.normalModal.show();
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
        }
        this.search();
    }

    /**
     * 草稿箱删除
     * jiangen 2017年11月23日10:09:59
     * @param {any} e
     * @memberof DraftsBoxComponent
     */
    deleteItem(e) {
        this.confirmationService.confirm({
            message: this.display.DeleteMessage,
            accept: () => {
                this.deleteDraftBox(e);
            }
        });
    }

    /**
     * 单据详情获取
     *jiangen  2018年3月19日10:18:00
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
     * 删除草稿箱
     * jiangen 2017年11月23日13:06:42
     * @param {any} e  表格数据
     * @memberof DraftsBoxComponent
     */
    deleteDraftBox(e) {
        this.componentService.getZPStoken().subscribe((data) => {
            if (data.code === 'SUCCESS') {
                const params = {
                    receiptType: e.receiptType,
                    documentNumber: e.documentNumber,
                    token: data.data
                };
                this.draftsBoxService.deleteDraftBox(params).subscribe((res: any) => {
                    if (res.code === 'SUCCESS') {
                        this.toastService.showSuccess('SUCCESS', this.display.makeSuccess);
                        this.search();
                    } else {
                        this.toastService.showError('ERROR', this.display.makeError);
                    }
                });
            }
        });
    }

    /**
     * 获取 附件信息
     * jn  2018年04月13日15:30:55
     * @param {any} e 订单数据
     * @param {any} fun 调用的方法
     * @memberof ApproveListComponent
     */
    getAttachmentInfo(e, fun) {
        const params = {
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

    /**
     * 根据lookupType获取对应的值列表
     * zw  2017年11月29日15:20:04
     */
    getLookupValueList() {
        this.componentService.getBrandList().subscribe((res) => {
            this.brandList = res;
            console.log(res);
        });

        this.componentService.getCumList().subscribe((res) => {
            this.cumList = res;
        });

        this.componentService.getAllProcess().subscribe((res) => {
            if (res.code === 'SUCCESS') {
                this.processNames = res.data;
            }
        });
    }
}
