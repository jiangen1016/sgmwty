import { Component, Input, EventEmitter, Output, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { LocalStorage } from '../../localStorage/localStorage.component';
import { HistoryData } from '../models/document.model';
import { ScenceDetails, ScenceApprove } from '../models/scenceModel';
import { ToastService } from '../../../service/toast.service';
import { ComponentService } from '../../component.service';
import { RemoteDetails, RemoteApprove } from '../models/remoteModel';

@Component({
    selector: 'app-remote-modal',
    templateUrl: './remote.component.html'
})

export class RemoteComponent implements OnInit {
    @Input('pageType') pageType: string;
    @Input('remoteDetails') remoteDetails: RemoteDetails = new RemoteDetails();
    @Input('remoteApprove') remoteApprove: RemoteApprove = new RemoteApprove();
    @Input('historyData') historyData: HistoryData;
    @Input('docFiles') docFiles = [];
    @Input('taskData') taskData: any = {};

    @Output('_onModalClose') _onModalClose: EventEmitter<any> = new EventEmitter<any>();

    @ViewChild('titleCell') titleCell: TemplateRef<any>;
    display: any = {};
    history: Boolean = true;
    tableCols: Array<any> = [];
    historyTableCols: Array<any> = [];
    constructor(
        private ls: LocalStorage,
        private toastService: ToastService,
        private componentService: ComponentService
    ) {
    }

    ngOnInit(): void {
        this.display = this.ls.getObject('display');
        this.tableCols = [
            { 'header': this.display.documentType, 'field': 'docCategory', 'width': '20%' },
            { 'header': this.display.number, 'field': 'docNumber', 'width': '30%', 'center': true },
            { 'header': this.display.documentName, 'field': 'docName', 'width': '50%', 'cellTemplate': this.titleCell }
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
        this._onModalClose.emit('remoteModal');
    }

    approve() {
        if (!this.remoteApprove.selectedValue) {
            this.toastService.showInfo('INFO', this.display.ApproveMessage);
        } else if (this.remoteApprove.selectedValue !== 'APPROVE' && !this.remoteApprove.approvalComment) {
            this.toastService.showInfo('INFO', this.display.OpinionMessage);
        } else {
            this.doApprove('approve');
        }
    }

    doApprove(type) {
        this.componentService.doApprove(type, 'remoteModal', this.taskData, this.remoteApprove);
    }
}
