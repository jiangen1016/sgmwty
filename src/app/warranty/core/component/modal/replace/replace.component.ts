import { Component, Output, Input, EventEmitter, ViewChild } from '@angular/core';
import { LocalStorage } from '../../localStorage/localStorage.component';
import { AppService, NetworkConfig } from '../../../../../app.service';
import { ReplaceService } from './replace.service';
import { ReplaceSave, ReplaceApprove } from '../models/replace.model';
import { UploadComponent } from '../../upload/upload.component';
import { Message } from 'primeng/primeng';
import { ToastService } from '../../../service/toast.service';
import { ComponentService } from '../../component.service';
import { HistoryData } from '../models/document.model';

@Component({
    selector: 'app-replace-modal',
    templateUrl: './replace.component.html',
})

export class ReplaceComponent {
    @ViewChild('filesControl') filesControl: UploadComponent;
    @Output('_onModalClose') _onModalClose: EventEmitter<any> = new EventEmitter<any>();
    @Input('historyData') historyData: HistoryData;
    @Input('replaceSave') replaceSave: ReplaceSave = new ReplaceSave();
    @Input('uploadedFiles') uploadedFiles: Array<any> = [];
    @Input('pageType') pageType: string;
    @Input('brandList') brandList: any;
    @Input('taskData') taskData: any = {};
    @Input('isHistory') isHistory: Boolean = false;
    disabled: Boolean = false;
    display: any;
    // pageType = 'create';
    saveDeleteFiles = '';
    userInfo: any = {};
    checkMsgs: any[] = [];
    isManager = false;
    saveAddFiles = [];
    history: Boolean = true;
    historyTableCols = [];
    replaceApprove: ReplaceApprove = new ReplaceApprove();
    uploadConfig = {
        uploadUrl: NetworkConfig.domain + NetworkConfig.path.uploadFiles,
        uploadMode: 'multiple',
        sourceType: 'TT_FR_OIL_CH'
    };

    constructor(
        private ls: LocalStorage,
        private appService: AppService,
        private replaceService: ReplaceService,
        private toastService: ToastService,
        private componentService: ComponentService
    ) {
        this.display = this.ls.getObject('display');
        this.userInfo = this.appService.getUserInfo();
        this.historyTableCols = [
            { 'header': this.display.ProcessNodeName, 'field': 'nodeName', 'width': '20%', 'isSort': true },
            { 'header': this.display.Approver, 'field': 'approverName', 'width': '10%', 'isSort': true, },
            { 'header': this.display.Date, 'field': 'creationDate', 'width': '15%', 'isSort': true },
            { 'header': this.display.action, 'field': 'approvalActive', 'width': '15%', 'isSort': true },
            { 'header': this.display.Suggestion, 'field': 'approvalComment', 'width': '30%', 'isSort': true },
        ];
        if (this.userInfo.roles.indexOf('ITManager') !== -1 || this.userInfo.roles.indexOf('BusinessManager') !== -1) {
            this.isManager = true;
        }
    }

    // 关闭modal
    modalClose() {
        this._onModalClose.emit('replaceModal');
        this.checkMsgs = [];
        this.replaceSave = new ReplaceSave();
        this.replaceApprove = new ReplaceApprove();
        if (this.filesControl) {
            this.filesControl.fileControl.files = [];
            this.filesControl.uploadedFiles = [];
        }
    }

    formSubmit(type) {
        this.checkMsgs = [];
        if (!this.taskData.canDeny && !this.isManager) {
            this.replaceSave.createdBy = this.userInfo.userId;
            this.replaceSave.creatorName = this.userInfo.userName;
        }
        this.checkStatus(type);
        if (!this.checkMsgs.length) {
            console.log(this.replaceSave);
            this.replaceSave.documentType = 'TT_DE_OF_RE_PA';
            if (type === 'save' || type === 'return') {
                this.replaceService.saveReplace(this.replaceSave).subscribe((data) => {
                    if (data.code === 'SUCCESS') {
                        this.replaceSave = data.data;
                        this.filesControl.checkAddAttachment(data.data.documentNumber);
                        if (type === 'return') {
                            this.doApprove('return');
                        } else {
                            this.toastService.showSuccess('SUCCESS', data.msg);
                        }
                    } else {
                        this.toastService.showError('ERROR', data.msg);
                    }
                });
            } else {
                // 这里是提交
                this.disabled = true;
                this.replaceService.submitReplace(this.replaceSave).subscribe((data) => {
                    console.log(data);
                    if (data.code === 'SUCCESS') {
                        this.replaceSave = data.data;
                        this.filesControl.checkAddAttachment(data.data.documentNumber);
                        this.toastService.showSuccess('SUCCESS', data.msg);
                        this.componentService.setPublicHistory('submit', data.data, '', '');
                        this.modalClose();
                    } else {
                        this.toastService.showError('ERROR', data.msg);
                    }
                    if (!this.replaceSave.documentNumber || (this.replaceSave.documentNumber && this.pageType === 'create')) {
                        this.disabled = false;
                    }
                });
            }
            if (this.saveDeleteFiles) {
                this.componentService.deleteAttachment(this.saveDeleteFiles);
            }
        }
    }

    checkStatus(type) {
        if (type === 'save') {
            if (!this.replaceSave.title) {
                this.toastService.showError('ERROR', this.display.titleRequired);
                this.checkMsgs.push(1);
            }
        } else {
            if (!this.replaceSave.title) {
                this.toastService.showError('ERROR', this.display.titleRequired);
                this.checkMsgs.push(1);
            }
            if (!this.replaceSave.brandCode) {
                this.toastService.showError('ERROR', this.display.brandCodeRequired);
                this.checkMsgs.push(1);
            }
            if (!this.replaceSave.quantity) {
                this.toastService.showError('ERROR', this.display.quantityRequired);
                this.checkMsgs.push(1);
            }
            if (!this.replaceSave.phone) {
                this.toastService.showError('ERROR', this.display.phoneRequired);
                this.checkMsgs.push(1);
            }
            if (!this.uploadedFiles.length) {
                this.toastService.showError('ERROR', this.display.pleaseCheckFiles);
                this.checkMsgs.push(1);
            }
        }
    }

    onUploadSuccess(event) {
        this.uploadedFiles = event;
    }

    onFilesRemove(event) {
        this.saveDeleteFiles = event;
    }

    approve() {
        console.log(this.replaceApprove);
        if (this.taskData.canDeny && this.taskData.isCreated) {
            this.formSubmit('return');
        } else {
            if (!this.replaceApprove.selectedValue) {
                this.toastService.showInfo('INFO', this.display.ApproveMessage);
            } else if (this.replaceApprove.selectedValue !== 'APPROVE' && !this.replaceApprove.approvalComment) {
                this.toastService.showInfo('INFO', this.display.OpinionMessage);
            } else {
                this.doApprove('approve');
            }
        }
        // if (!this.replaceApprove.selectedValue) {
        //     this.toastService.showInfo('INFO', this.display.ApproveMessage);
        // } else if (this.replaceApprove.selectedValue !== 'APPROVE' && !this.replaceApprove.approvalComment) {
        //     this.toastService.showInfo('INFO', this.display.OpinionMessage);
        // } else {
        //     this.doApprove('approve');
        // }
    }

    doApprove(type) {
        this.componentService.doApprove(type, 'replaceModal', this.taskData, this.replaceApprove);
    }

    delete() {
        this.componentService.deleteProcess(this.taskData, 'replaceModal');
    }
}
