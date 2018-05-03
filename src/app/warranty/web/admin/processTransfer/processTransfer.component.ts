import { Component, ViewChild, ElementRef, TemplateRef, OnInit } from '@angular/core';
import { TableComponent } from '../../../core/component/table/table.component';
import { ModalDirective, BsModalService } from 'ngx-bootstrap/modal';
import { ProcessTransferService } from './processTransfer.service';
import { AppService, NetworkConfig } from '.././../../../app.service';
import { ProcessTransferSearch, ProcessTransferPage, ProcessTransferResponse, ProcessTransfePerson } from '../models/processTransfer';
import { LocalStorage } from '../../../core/component/localStorage/localStorage.component';
import { AdminService } from '../admin.service';
import { AttachmentService, GetAttachmentRequest, Attachment } from '../../../core/service/attachment.service';
import { ComponentService } from '../../../core/component/component.service';
import { MessageService } from 'primeng/components/common/messageservice';
import { ConfirmationService } from 'primeng/primeng';
import { ToastService } from '../../../core/service/toast.service';

@Component({
    selector: 'app-process-transfer',
    templateUrl: './processTransfer.component.html',
    providers: [ConfirmationService]
})

export class ProcessTranferComponent implements OnInit {
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
    tableConfig = {
        isNumber: true,
        isSelect: true,
        selectionMode: 'single'
    };

    processTransferSearch: ProcessTransferSearch = new ProcessTransferSearch();
    processTransferPage: ProcessTransferPage = new ProcessTransferPage();
    ProcessNames: Array<any> = [];
    totalRecords = 0;
    historyTotal = 0;
    historyData = { historyList: [], historyTotal: 0 };
    pageType = 'detail';
    modalService: any;
    trasnferPerson = '';
    selectionMode = 'multiple';
    // isHistory = true;
    loading = false;
    tableData: Array<any> = [];
    showChoose = false;
    detailData: any = {}; // 列表数据
    selectTask: any = {};
    taskData: any = {}; // 单个表格数据
    tableCols = [];
    personTableData = [];
    personTableCols = [];
    brandList: Array<any> = [];
    getAttachmentRequest: GetAttachmentRequest = new GetAttachmentRequest();
    processTransfePerson: ProcessTransfePerson = new ProcessTransfePerson();
    attachments: Array<Attachment> = [];
    returnAttachments: Array<Attachment> = [];
    modalConfig: any = this.appService.modalConfig;
    quarterlyList: Array<any> = [];
    allSummaryData = { data: [], total: 0 };

    display: any = {};

    constructor(
        private processTransferService: ProcessTransferService,
        private ls: LocalStorage,
        private appService: AppService,
        private adminService: AdminService,
        private attachmentService: AttachmentService,
        private componentService: ComponentService,
        private toastService: ToastService,
        private confirmationService: ConfirmationService
    ) { }

    ngOnInit(): void {
        this.display = this.ls.getObject('display'); // 获取显示字段
        this.tableCols = [
            { 'header': this.display.DocumentNo, 'field': 'documentNumber', 'width': '10%', 'isSort': true },
            {
                'header': this.display.Title, 'cellTemplate': this.titleCell,
                'field': 'title', 'width': '30%', 'left': true, 'isSort': true
            },
            { 'header': this.display.Processname, 'field': 'processName', 'width': '20%', 'left': true, 'isSort': true },
            { 'header': this.display.Approver, 'field': 'assigneeName', 'width': '20%', 'isSort': true },
            { 'header': this.display.StartDate, 'field': 'creationDate', 'width': '20%', 'isSort': true },
            { 'header': this.display.Founder, 'field': 'creatorName', 'width': '10%', 'isSort': true },
            { 'header': this.display.Status, 'field': 'state', 'width': '10%', 'isSort': false }
        ];
        this.search();
        this.getLookUp();
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
     * 审批列表审批 分页
     * jiangen  2017年11月18日15:51:46
     * @param {any} data  当前的pageSize和pageNum
     * @memberof ApproveListComponent
     */
    tableGetPage(data) {
        this.processTransferPage.pageNum = data.page * 1 + 1;
        this.processTransferPage.pageSize = data.rows;
        this.search(true);
    }

    /**
     * 获取流程转移数据
     * jiangen 2017年11月26日15:15:57
     * @memberof ProcessTranferComponent
     */
    search(boolean?) {
        if (!boolean) {
            this.processTransferPage.pageNum = 1;
        }
        this.processTransferSearch.languageCode = this.ls.get('language');
        this.processTransferSearch = this.appService.setDate(this.processTransferSearch, ['creationBeginDate', 'creationEndDate']);
        this.processTransferService.getProcessTransferData(this.processTransferPage, this.processTransferSearch).subscribe((data) => {
            if (data.code === 'SUCCESS') {
                this.getProcessStatus(data.data.list);
                this.tableData = data.data.list;
                this.totalRecords = data.data.total;
                this.loading = false;
            }
        });
    }

    /**
     * 单据详情获取
     *jiangen  2017年11月26日15:15:41
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
     * 流程管理 - 更新状态显示
     * jiangen 2017年12月22日15:54:07
     * @param {any} arr
     * @memberof ProcessTranferComponent
     */
    getProcessStatus(arr) {
        if (arr && arr.length) {
            for (const item of arr) {
                switch (item.state) {
                    case 'ASSIGNED':
                        item.state = this.display['normal'];
                        break;
                    case 'SUSPENDED':
                        item.state = this.display['stop'];
                        break;
                    case 'CANCELED':
                        item.state = this.display['end'];
                        break;
                }
            }
        }
    }

    /**
     * 流程转移
     * jiangen   2017年12月4日18:48:11
     * @memberof ProcessTranferComponent
     */
    processTransfer() {
        if (!this.selectTask.taskId) {
            this.toastService.showInfo('info', this.display.chooseProcess);
        } else {
            this.personTableCols = this.componentService.getTableCols('transferPerson');
            // 请求数据
            this.getPersonList();
            this.selectionMode = 'multiple';
            this.showChoose = true;
        }
    }

    /**
     * 接受选择到的流程
     * jiangen  2017-12-4 19:19:36
     * @memberof ProcessTranferComponent
     */
    selectRow(data) {
        const roleCode = data.nodeName.split(' ');
        this.processTransfePerson.roleCode = roleCode.slice(0, roleCode.length - 1).join('');
        this.processTransfePerson.documentCode = data.receiptType;
        this.selectTask = data;
    }

    /**
     * 人员列表
     * jiangen 2017年12月18日14:07:52
     * @memberof ProcessTranferComponent
     */
    getPersonList() {
        this.processTransferService.getTransferPerson().subscribe((data) => {
            if (data.code === 'SUCCESS') {
                this.personTableData = data.data;
            }
        });
    }

    /**
     * 流程节点  - 路由
     * jiangen 2017年12月18日14:37:23
     * @memberof ProcessTranferComponent
     */
    getProcessonList() {
        const params = {
            'instanceId': this.selectTask.bpmInstanceId
        };
        this.processTransferService.getProcessList(params).subscribe((data) => {
            if (data.code === 'SUCCESS') {
                for (let i = 0; i < data.data.length; i++) {
                    // if (data.data[i].activityName === 'ITO Initiator Submmit') {
                    //     data.data.splice(i, 1);
                    //     break;
                    // }
                }
                this.personTableData = data.data;
            }
        });
    }

    /**
     * 取消选择
     * jiangen 2017年12月18日14:08:17
     * @param {any} data
     * @memberof ProcessTranferComponent
     */
    unSelect(data) {
        if (data) {
            this.selectTask = {};
            this.processTransfePerson = new ProcessTransfePerson();
        }
    }

    /**
     * 选择的人
     * jiangen 2017年12月18日14:09:12
     * @param {any} e
     * @memberof ProcessTranferComponent
     */
    getChoose(e) {
        if (e) {
            if (e.activityName) {
                const getTokenParams = {
                    approver: 'wlsadmin',
                };
                this.componentService.getToken(getTokenParams).subscribe((data) => {
                    if (data.resultCode === 'SUCCESS') {
                        const params = {
                            instanceId: this.selectTask.bpmInstanceId,
                            targetActivity: e.activityName,
                            token: data.token
                        };
                        this.doRoute(params);
                        this.closeChoose(true);
                    }
                });
            } else {
                if (e && e.length) {
                    for (const item of e) {
                        if (item.userUid === this.ls.get('userId')) {
                            this.toastService.showInfo('INFO', this.display.canotChoose);
                            this.trasnferPerson = '';
                            break;
                        } else {
                            this.trasnferPerson = '';
                            this.trasnferPerson += (item.userUid + ',');
                            this.trasnferPerson = this.trasnferPerson.substring(0, this.trasnferPerson.lastIndexOf(','));
                        }
                    }
                    if (this.trasnferPerson) {
                        const getTokenParams = {
                            approver: 'wlsadmin',
                        };
                        this.componentService.getToken(getTokenParams).subscribe((data) => {
                            if (data.resultCode === 'SUCCESS') {
                                const params = {
                                    taskId: this.selectTask.taskId,
                                    assignees: this.trasnferPerson,
                                    token: data.token
                                };
                                this.doTransfer(params);
                                this.closeChoose(true);
                                // this.search();
                            }
                        });
                    }
                } else {
                    this.toastService.showSuccess('INFO', this.display.plesaseChoosePerson);
                }
            }
        } else {
            this.toastService.showSuccess('INFO', this.display.plesaseChoosePerson);
        }
    }

    /**
     * 关闭选择
     * jiangen  2017年12月11日10:29:11
     * @param {any} data
     * @memberof ProcessTranferComponent
     */
    closeChoose(data) {
        if (data) {
            this.showChoose = false;
            this.personTableData = [];
            this.search();
        }
    }

    sendClose() {
        this.appService.isCloseFun(true);
    }

    /**
     * 流程管理   - 转接
     * jiangen  2017年12月11日10:29:39
     * @param {any} params
     * @memberof ProcessTranferComponent
     */
    doTransfer(params) {
        this.processTransferService.doTransfer(params).subscribe((data) => {
            if (data.resultCode === 'SUCCESS') {
                this.closeChoose(true);
                this.toastService.showSuccess('SUCCESS', this.display.makeSuccess);
            } else {
                this.toastService.showError('ERROR', this.display.makeError);
            }
        });
    }

    /**
     * 流程管理 - 终止
     * jiangen  2017年12月11日11:33:02
     * @param {any} text
     * @memberof ProcessTranferComponent
     */
    processEnd(text) {
        if (this.selectTask.bpmInstanceId) {
            this.confirmationService.confirm({
                message: this.display.confirm,
                accept: () => {
                    const getTokenParams = {
                        approver: 'wlsadmin',
                    };
                    this.componentService.getToken(getTokenParams).subscribe((data) => {
                        if (data.resultCode === 'SUCCESS') {
                            const params = {
                                'instanceId': this.selectTask.bpmInstanceId,
                                'token': data.token
                            };
                            this.processTransferService.doEnd(params).subscribe((res) => {
                                if (res.resultCode === 'SUCCESS') {
                                    this.toastService.showSuccess('SUCCESS', this.display.makeSuccess);
                                    this.search();
                                } else {
                                    this.toastService.showError('ERROR', this.display.makeError);
                                }
                            });
                        }
                    });
                }
            });
        } else {
            this.toastService.showInfo('info', this.display.chooseProcess);
        }
    }

    /**
     * 流程管理 - 暂停
     * jiangen   2017年12月11日13:16:09
     * @memberof ProcessTranferComponent
     */
    processStop(text) {
        if (this.selectTask.taskId) {
            this.confirmationService.confirm({
                message: this.display.confirm,
                accept: () => {
                    const getTokenParams = {
                        approver: 'wlsadmin',
                    };
                    this.componentService.getToken(getTokenParams).subscribe((data) => {
                        if (data.resultCode === 'SUCCESS') {
                            const params = {
                                'taskId': this.selectTask.taskId,
                                'token': data.token
                            };
                            this.processTransferService.doSuspendTask(params).subscribe((res) => {
                                if (res.resultCode === 'SUCCESS') {
                                    this.toastService.showSuccess('SUCCESS', this.display.makeSuccess);
                                    this.search();
                                } else {
                                    this.toastService.showError('ERROR', this.display.makeError);
                                }
                            });
                        }
                    });

                }
            });
        } else {
            this.toastService.showInfo('info', this.display.chooseProcess);
        }
    }

    /**
     * 流程管理 - 激活
     * jiangen   2017年12月11日13:26:57
     * @memberof ProcessTranferComponent
     */
    processActived(text) {
        if (this.selectTask.taskId) {
            this.confirmationService.confirm({
                message: this.display.confirm,
                accept: () => {
                    const getTokenParams = {
                        approver: 'wlsadmin',
                    };
                    this.componentService.getToken(getTokenParams).subscribe((data) => {
                        if (data.resultCode === 'SUCCESS') {
                            const params = {
                                'taskId': this.selectTask.taskId,
                                'token': data.token
                            };
                            this.processTransferService.doResumeTask(params).subscribe((res) => {
                                if (res.resultCode === 'SUCCESS') {
                                    this.toastService.showSuccess('SUCCESS', this.display.makeSuccess);
                                    this.search();
                                } else {
                                    this.toastService.showError('ERROR', this.display.makeError);
                                }
                            });
                        }
                    });

                }
            });
        } else {
            this.toastService.showInfo('info', this.display.chooseProcess);
        }
    }

    /**
     * 流程管理  - 路由
     * jiangen 2017年12月18日14:15:12
     * @memberof ProcessTranferComponent
     */
    processRoute(text) {
        if (!this.selectTask.bpmInstanceId) {
            this.toastService.showInfo('info', this.display.chooseProcess);
        } else {
            // 请求数据
            this.personTableCols = this.componentService.getTableCols('ProcessList');
            this.getProcessonList();
            this.selectionMode = 'single';
            this.showChoose = true;
        }
    }

    /**
     * 流程管理 - 路由
     * jiagnen 2017年12月18日13:45:18
     * @memberof ProcessTranferComponent
     */
    doRoute(params) {
        this.processTransferService.doRoute(params).subscribe((data) => {
            if (data.resultCode === 'SUCCESS') {
                this.toastService.showSuccess('SUCCESS', this.display.makeSuccess);
                this.closeChoose(true);
            } else {
                this.toastService.showError('ERROR', this.display.makeError);
            }
        });
    }

    /**
     * 获取流程名称
     * jiagnen 2017年12月13日18:01:33
     * @memberof ProcessTranferComponent
     */
    getLookUp() {
        this.componentService.getAllProcess().subscribe((data: any) => {
            this.ProcessNames = data.data;
        });
        this.componentService.getBrandList().subscribe((res) => {
            this.brandList = res;
            console.log(res);
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

