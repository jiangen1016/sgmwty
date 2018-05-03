import { Component, Input, Output, EventEmitter, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { LocalStorage } from '../../localStorage/localStorage.component';
import { HistoryData } from '../models/document.model';
import { SummaryDetails, SummaryApprove, QuarterlyInfo, SummaryPage } from '../models/summaryModel';
import { AppService } from '../../../../../app.service';
import { AttachmentService } from '../../../service/attachment.service';
import { ToastService } from '../../../service/toast.service';
import { ComponentService } from '../../component.service';
import { ModalDirective } from 'ngx-bootstrap';
import { SummaryService } from './summary.service';

@Component({
    selector: 'app-summary-modal',
    templateUrl: './summary.component.html'
})

export class SummaryComponent implements OnInit {
    @ViewChild('scenceModal') scenceModal: ModalDirective;
    @ViewChild('remoteModal') remoteModal: ModalDirective;

    @Input('pageType') pageType: string;
    @Input('summaryDetails') summaryDetails: SummaryDetails = new SummaryDetails();
    @Input('summaryApprove') summaryApprove: SummaryApprove = new SummaryApprove();
    @Input('quarterlyList') quarterlyList = [];
    @Input('allSummaryData') allSummaryData: any = { data: [], total: 0 };
    @Input('historyData') historyData: HistoryData;
    @Input('taskData') taskData: any = {};

    @Output('_onModalClose') _onModalClose: EventEmitter<any> = new EventEmitter<any>();

    @ViewChild('titleCell') titleCell: TemplateRef<any>;
    @ViewChild('fileCell') fileCell: TemplateRef<any>;
    @ViewChild('opationCell') opationCell: TemplateRef<any>;
    summaryPage: SummaryPage = new SummaryPage();
    qualitySave = {};
    display: any = {};
    history: Boolean = true;
    detailData: any = {};
    userInfo: any = {};
    attachments: Array<any> = [];
    quarterlyTableCols: Array<any> = [];
    allSummaryTableCols: Array<any> = [];
    historyTableCols: Array<any> = [];
    modalConfig: any = this.appService.modalConfig;
    openPageType = 'detail';
    constructor(
        private ls: LocalStorage,
        private appService: AppService,
        private toastService: ToastService,
        private attachmentService: AttachmentService,
        private componentService: ComponentService,
        private summaryService: SummaryService
    ) {
    }


    ngOnInit(): void {
        this.userInfo = this.appService.getUserInfo();
        this.display = this.ls.getObject('display');
        this.quarterlyTableCols = [{ 'header': this.display.yeaer, 'field': 'year', 'width': '20%', 'center': true },
        { 'header': this.display.quarterly, 'field': 'quarter', 'width': '30%', 'center': true },
        { 'header': this.display.documentName, 'field': 'fileName', 'width': '50%', 'cellTemplate': this.fileCell }];
        this.allSummaryTableCols = [
            { 'header': this.display.number, 'field': 'documentNumber', 'width': '20%', 'center': true },
            { 'header': this.display.documentTypeDet, 'field': 'documentTypeDet', 'width': '30%', 'center': true },
            { 'header': this.display.documentName, 'field': 'docName', 'width': '50%', 'cellTemplate': this.titleCell },
            { 'header': this.display.Initiator, 'field': 'createdBy', 'width': '30%' },
            { 'header': this.display.applicationStatus, 'field': 'statusMeaning', 'width': '30%' },
            { 'header': this.display.Operation, 'field': '_', 'width': '10%', 'cellTemplate': this.opationCell, 'center': true }
        ];
        this.historyTableCols = [
            { 'header': this.display.ProcessNodeName, 'field': 'nodeName', 'width': '20%', 'isSort': true },
            { 'header': this.display.Approver, 'field': 'approverName', 'width': '10%', 'isSort': true, },
            { 'header': this.display.Date, 'field': 'creationDate', 'width': '15%', 'isSort': true },
            { 'header': this.display.action, 'field': 'approvalActive', 'width': '15%', 'isSort': true },
            { 'header': this.display.Suggestion, 'field': 'approvalComment', 'width': '30%', 'isSort': true }
        ];
    }

    modalClose() {
        this._onModalClose.emit('summaryModal');
        this.summaryApprove = new SummaryApprove();
        this.summaryPage = new SummaryPage();
    }

    approve() {
        if (!this.summaryApprove.selectedValue) {
            this.toastService.showInfo('INFO', this.display.ApproveMessage);
        } else if (this.summaryApprove.selectedValue !== 'APPROVE' && !this.summaryApprove.approvalComment) {
            this.toastService.showInfo('INFO', this.display.OpinionMessage);
        } else {
            this.doApprove('approve');
        }
    }

    doApprove(type) {
        if (this.taskData.nodeName === 'Warranty Staff' && this.taskData.status === 'PROCESSING') {
            console.log(this.summaryDetails);
            this.summaryDetails.createdBy = this.userInfo.userId;
            this.summaryService.updateSummary(this.summaryDetails).subscribe((res) => {
                if (res.code === 'SUCCESS') {
                    this.componentService.doApprove(type, 'summaryModal', this.taskData, this.summaryApprove);
                } else {
                    this.toastService.showError('ERROR', res.msg);
                }
            });
        } else {
            this.componentService.doApprove(type, 'summaryModal', this.taskData, this.summaryApprove);
        }
    }

    tableGetPage(data) {
        this.summaryPage.pageNum = data.page * 1 + 1;
        this.summaryPage.pageSize = data.rows;
        this.getTable();
    }

    openModal(e) {
        if (e && e.documentNumber && e.documentType) {
            this.getSuoPeiFiles(e);
            this.getApplyInfo(e);
            if (e.documentType === 'TT_CL_AU_X') {
                this.scenceModal.show();
            }
            if (e.documentType === 'TT_CL_AU_Y') {
                this.remoteModal.show();
            }
        }
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

    getApplyInfo(e) {
        const params = {
            receiptType: e.documentType,
            documentNumber: e.documentNumber
        };
        this.componentService.getApproveInfo(params).subscribe((data: any) => {
            if (data.code === 'SUCCESS') {
                this.detailData = data.data;
            }
        });
    }

    closeModal(e) {
        switch (e) {
            case 'scenceModal':
                this.scenceModal.hide();
                break;
            case 'remoteModal':
                this.remoteModal.hide();
                break;
        }
    }

    getTable() {
        this.summaryService.getTableBySize(this.summaryPage).subscribe((res) => {
            if (res.code === 'SUCCESS') {
                this.allSummaryData.data = res.data.list;
                this.allSummaryData.total = res.data.total;
            }
        });

    }
}
