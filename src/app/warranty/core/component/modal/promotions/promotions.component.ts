import { Component, Output, Input, EventEmitter, ViewChild } from '@angular/core';
import { LocalStorage } from '../../localStorage/localStorage.component';
import { AppService, NetworkConfig } from '../../../../../app.service';
import { PromotionsService } from './promotions.service';
import { Message } from 'primeng/primeng';
import { PromotionsSave, PromotionApprove } from '../models/promotions.model';
import { ToastService } from '../../../service/toast.service';
import { AttachmentService } from '../../../service/attachment.service';
import { ComponentService } from '../../component.service';
import { UploadComponent } from '../../upload/upload.component';
import { HistoryData } from '../models/document.model';

@Component({
    selector: 'app-promotions-modal',
    templateUrl: './promotions.component.html',
})

export class PromotionsComponent {
    @ViewChild('filesControl') filesControl: UploadComponent;
    @Output('_onModalClose') _onModalClose: EventEmitter<any> = new EventEmitter<any>();
    @Input('historyData') historyData: HistoryData;
    @Input('promotionsSave') promotionsSave: PromotionsSave = new PromotionsSave();
    @Input('uploadedFiles') uploadedFiles: Array<any> = [];
    @Input('brandList') brandList: any;
    @Input('pageType') pageType: string;
    @Input('taskData') taskData: any = {};
    @Input('isHistory') isHistory: Boolean = false;

    promotionApprove: PromotionApprove = new PromotionApprove();
    disabled: Boolean = false;
    display: any;
    kdQuotation = {};
    saveAddFiles = [];
    saveDeleteFiles = '';
    // taskData = {};
    isManager = false;
    history: Boolean = true;
    historyTableCols = [];
    userInfo: any = {};
    uploadConfig = {
        uploadUrl: NetworkConfig.domain + NetworkConfig.path.uploadFiles,
        uploadMode: 'multiple',
        sourceType: 'TT_BR_CA_TE_SU'
    };

    checkMsgs: any[] = [];
    constructor(
        private ls: LocalStorage,
        private appService: AppService,
        private promotionsService: PromotionsService,
        private toastService: ToastService,
        private attachmentService: AttachmentService,
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
        this._onModalClose.emit('promotionsModal');
        this.checkMsgs = [];
        this.promotionApprove = new PromotionApprove();
        this.promotionsSave = new PromotionsSave();
        if (this.filesControl) {
            this.filesControl.uploadedFiles = [];
            this.filesControl.fileControl.files = [];
        }
        this.disabled = false;
    }

    formSubmit(type) {
        this.checkMsgs = [];
        if (!this.taskData.canDeny && !this.isManager) {
            this.promotionsSave.createdBy = this.userInfo.userId;
            this.promotionsSave.creatorName = this.userInfo.userName;
        }
        this.checkStatus(type);
        if (!this.checkMsgs.length) {
            console.log(this.promotionsSave);
            this.promotionsSave.documentType = 'TT_BR_CA_TE_SU';
            if (type === 'save' || type === 'return') {
                this.promotionsService.savePromotions(this.promotionsSave).subscribe((data) => {
                    if (data.code === 'SUCCESS') {
                        this.promotionsSave = data.data;
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
                this.promotionsService.submitPromotions(this.promotionsSave).subscribe((data) => {
                    console.log(data);
                    if (data.code === 'SUCCESS') {
                        this.promotionsSave = data.data;
                        this.filesControl.checkAddAttachment(data.data.documentNumber);
                        this.toastService.showSuccess('SUCCESS', data.msg);
                        this.componentService.setPublicHistory('submit', data.data, '', '');
                        this.modalClose();
                    } else {
                        this.toastService.showError('ERROR', data.msg);
                    }
                    if (!this.promotionsSave.documentNumber || (this.promotionsSave.documentNumber && this.pageType === 'create')) {
                        this.disabled = false;
                    }
                });
            }
            if (this.saveDeleteFiles) {
                console.log(this.saveDeleteFiles);
                this.componentService.deleteAttachment(this.saveDeleteFiles);
            }
        }
    }

    checkStatus(type) {
        if (type === 'save') {
            if (!this.promotionsSave.title) {
                this.toastService.showError('ERROR', this.display.titleRequired);
                this.checkMsgs.push(1);
            }
        } else {
            if (!this.promotionsSave.title) {
                this.toastService.showError('ERROR', this.display.titleRequired);
                this.checkMsgs.push(1);
            }
            if (!this.promotionsSave.brandCode) {
                this.toastService.showError('ERROR', this.display.brandCodeRequired);
                this.checkMsgs.push(1);
            }
            if (!this.promotionsSave.prNo) {
                this.toastService.showError('ERROR', this.display.prNoRequired);
                this.checkMsgs.push(1);
            }
            if (!this.promotionsSave.amount) {
                this.toastService.showError('ERROR', this.display.amountRequired);
                this.checkMsgs.push(1);
            }
            if (!this.promotionsSave.phone) {
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
        console.log(this.promotionApprove);
        if (this.taskData.canDeny && this.taskData.isCreated) {
            this.formSubmit('return');
        } else {
            if (!this.promotionApprove.selectedValue) {
                this.toastService.showInfo('INFO', this.display.ApproveMessage);
            } else if (this.promotionApprove.selectedValue !== 'APPROVE'
                && !this.promotionApprove.approvalComment) {
                this.toastService.showInfo('INFO', this.display.OpinionMessage);
            } else {
                this.doApprove('approve');
            }
        }
        // if (!this.promotionApprove.selectedValue) {
        //     this.toastService.showInfo('INFO', this.display.ApproveMessage);
        // } else if (this.promotionApprove.selectedValue !== 'APPROVE'
        //     && !this.promotionApprove.approvalComment) {
        //     this.toastService.showInfo('INFO', this.display.OpinionMessage);
        // } else {
        //     this.doApprove('approve');
        // }
    }

    doApprove(type) {
        this.componentService.doApprove(type, 'promotionsModal', this.taskData, this.promotionApprove);
    }

    delete() {
        this.componentService.deleteProcess(this.taskData, 'promotionsModal');
    }
}
