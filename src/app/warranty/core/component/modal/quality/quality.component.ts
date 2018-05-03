import { Component, Output, Input, EventEmitter, ViewChild } from '@angular/core';
import { LocalStorage } from '../../localStorage/localStorage.component';
import { AppService, NetworkConfig } from '../../../../../app.service';
import { Message } from 'primeng/primeng';
import { QualitySave, QualityApprove } from '../models/quality.model';
import { ToastService } from '../../../service/toast.service';
import { QualityService } from './quality.service';
import { ComponentService } from '../../component.service';
import { UploadComponent } from '../../upload/upload.component';
import { PromotionsSave } from '../models/promotions.model';
import { HistoryData } from '../models/document.model';

@Component({
    selector: 'app-quality-modal',
    templateUrl: './quality.component.html',
})

export class QualityComponent {
    @ViewChild('filesControl') filesControl: UploadComponent;
    @Output('_onModalClose') _onModalClose: EventEmitter<any> = new EventEmitter<any>();
    @Input('historyData') historyData: HistoryData;
    @Input('qualitySave') qualitySave: QualitySave = new QualitySave();
    @Input('uploadedFiles') uploadedFiles: Array<any> = [];
    @Input('pageType') pageType: string;
    @Input('taskData') taskData: any = {};
    @Input('isHistory') isHistory: Boolean = false;

    qualityApprove: QualityApprove = new QualityApprove();
    display: any;
    disabled: Boolean = false;
    kdQuotation = {};
    showChoose = false;
    saveDeleteFiles = '';
    tableType: string;  // chooseDialog的源数据类型
    tableData: Array<any> = []; // chooseDialog的源数据
    tableCols: Array<any> = []; // chooseDialog的表格列
    selectionMode: string; // chooseDialog的选择类型
    checkMsgs: any[] = [];
    isManager = false;
    saveAddFiles = [];
    userInfo: any = {};
    history: Boolean = true;
    historyTableCols = [];
    uploadConfig = {
        uploadUrl: NetworkConfig.domain + NetworkConfig.path.uploadFiles,
        uploadMode: 'multiple',
        sourceType: 'TT_QU_DE'
    };

    constructor(
        private ls: LocalStorage,
        private appService: AppService,
        private toastService: ToastService,
        private qualityService: QualityService,
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
        this._onModalClose.emit('qualityModal');
        this.checkMsgs = [];
        this.qualityApprove = new QualityApprove();
        this.qualitySave = new QualitySave();
        if (this.filesControl) {
            this.filesControl.uploadedFiles = [];
            this.filesControl.fileControl.files = [];
        }
        this.disabled = false;
    }

    formSubmit(type) {
        this.checkMsgs = [];
        if (!this.taskData.canDeny && !this.isManager) {
            this.qualitySave.createdBy = this.userInfo.userId;
            this.qualitySave.creatorName = this.userInfo.userName;
        }
        this.checkStatus(type);
        if (!this.checkMsgs.length) {
            console.log(this.qualitySave);
            this.qualitySave.documentType = 'TT_QU_DE';
            if (type === 'save' || type === 'return') {
                this.qualityService.saveQualitySave(this.qualitySave).subscribe((data) => {
                    if (data.code === 'SUCCESS') {
                        this.qualitySave = data.data;
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
                this.qualityService.submitQualitySave(this.qualitySave).subscribe((data) => {
                    console.log(data);
                    if (data.code === 'SUCCESS') {
                        this.qualitySave = data.data;
                        this.filesControl.checkAddAttachment(data.data.documentNumber);
                        this.toastService.showSuccess('SUCCESS', data.msg);
                        this.componentService.setPublicHistory('submit', data.data, '', '');
                        this.modalClose();
                    } else {
                        this.toastService.showError('ERROR', data.msg);
                    }
                    if (!this.qualitySave.documentNumber || (this.qualitySave.documentNumber && this.pageType === 'create')) {
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
            if (!this.qualitySave.title) {
                this.toastService.showError('ERROR', this.display.titleRequired);
                this.checkMsgs.push(1);
            }
        } else {
            if (!this.qualitySave.title) {
                this.toastService.showError('ERROR', this.display.titleRequired);
                this.checkMsgs.push(1);
            }
            if (!this.qualitySave.customerCode) {
                this.toastService.showError('ERROR', this.display.customerCodeRequired);
                this.checkMsgs.push(1);
            }
            if (!this.qualitySave.desQuantity) {
                this.toastService.showError('ERROR', this.display.desQuantityRequired);
                this.checkMsgs.push(1);
            }
            if (!this.qualitySave.phone) {
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

    // 查找经销商
    showChooseDialog(type, mode) {
        this.tableType = type;
        this.selectionMode = mode;
        this.tableCols = this.componentService.getTableCols(type);
        this.getChoose();
        this.showChoose = true;
    }

    getChoose() {
        this.componentService.getCumList().subscribe((res) => {
            this.tableData = res;
        });
    }

    setCustomer(e) {
        console.log(e);
        this.qualitySave.customerCode = e.customerName;
        this.closeChoose();
    }

    // 关闭选择
    closeChoose() {
        this.appService.isCloseFun(true);
        this.showChoose = false;
    }

    approve() {
        console.log(this.qualityApprove);
        if (this.taskData.canDeny && this.taskData.isCreated) {
            this.formSubmit('return');
        } else {
            if (this.taskData.onlyCanApprove) {
                this.qualityApprove.selectedValue = 'APPROVE';
                this.doApprove('approve');
            } else if (!this.qualityApprove.selectedValue) {
                this.toastService.showInfo('INFO', this.display.ApproveMessage);
            } else if (this.qualityApprove.selectedValue !== 'APPROVE' && !this.qualityApprove.approvalComment) {
                this.toastService.showInfo('INFO', this.display.OpinionMessage);
            } else {
                this.doApprove('approve');
            }
        }
        // if (this.taskData.onlyCanApprove) {
        //     this.qualityApprove.selectedValue = 'APPROVE';
        //     this.doApprove('approve');
        // } else if (!this.qualityApprove.selectedValue) {
        //     this.toastService.showInfo('INFO', this.display.ApproveMessage);
        // } else if (this.qualityApprove.selectedValue !== 'APPROVE' && !this.qualityApprove.approvalComment) {
        //     this.toastService.showInfo('INFO', this.display.OpinionMessage);
        // } else {
        //     this.doApprove('approve');
        // }
    }

    doApprove(type) {
        this.componentService.doApprove(type, 'qualityModal', this.taskData, this.qualityApprove);
    }

    delete() {
        this.componentService.deleteProcess(this.taskData, 'qualityModal');
    }
}
