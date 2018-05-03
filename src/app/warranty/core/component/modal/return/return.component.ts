import { Component, Output, Input, EventEmitter, ViewChild } from '@angular/core';
import { LocalStorage } from '../../localStorage/localStorage.component';
import { AppService, NetworkConfig } from '../../../../../app.service';
import { ReturnSave, ReturnApprove } from '../models/return.model';
import { Message } from 'primeng/primeng';
import { UploadComponent } from '../../upload/upload.component';
import { ComponentService } from '../../component.service';
import { ToastService } from '../../../service/toast.service';
import { ReturnService } from './return.service';
import { HistoryData } from '../models/document.model';
import { AttachmentService } from '../../../service/attachment.service';
import { ViewChildren } from '@angular/core/src/metadata/di';

@Component({
    selector: 'app-return-modal',
    templateUrl: './return.component.html',
})

export class ReturnComponent {
    @ViewChild('lastFilesControl') lastFilesControl: any;
    @ViewChild('filesControl') filesControl: UploadComponent;
    // @ViewChild('lastFilesControl') lastFilesControl: UploadComponent;
    @Output('_onModalClose') _onModalClose: EventEmitter<any> = new EventEmitter<any>();
    @Input('historyData') historyData: HistoryData;
    @Input('returnSave') returnSave: ReturnSave = new ReturnSave();
    @Input('uploadedFiles') uploadedFiles: Array<any> = [];
    @Input('lastUploadedFiles') lastUploadedFiles: Array<any> = [];
    @Input('pageType') pageType: string;
    @Input('taskData') taskData: any = {};
    @Input('isHistory') isHistory: Boolean = false;
    disabled: Boolean = false;
    returnApprove: ReturnApprove = new ReturnApprove();
    display: any;
    userInfo: any = {};
    saveDeleteFiles: any = [];
    lastSveDeleteFiles: any = [];
    checkMsgs: any[] = [];
    saveAddFiles = [];
    isManager = false;
    history: Boolean = true;
    historyTableCols = [];
    uploadConfig = {
        uploadUrl: NetworkConfig.domain + NetworkConfig.path.uploadFiles,
        uploadMode: 'multiple',
        sourceType: 'TT_DE_OF_RE_PA'
    };

    constructor(
        private ls: LocalStorage,
        private appService: AppService,
        private componentService: ComponentService,
        private returnService: ReturnService,
        private toastService: ToastService,
        private attachmentService: AttachmentService
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
        this._onModalClose.emit('returnModal');
        this.checkMsgs = [];
        this.returnSave = new ReturnSave();
        this.returnApprove = new ReturnApprove();
        if (this.filesControl) {
            this.filesControl.uploadedFiles = [];
            this.filesControl.fileControl.files = [];
        }
        this.lastUploadedFiles = [];
        this.disabled = false;
    }

    formSubmit(type) {
        this.checkMsgs = [];
        if (!this.taskData.canDeny && !this.isManager) {
            this.returnSave.createdBy = this.userInfo.userId;
            this.returnSave.creatorName = this.userInfo.userName;
        }
        this.checkStatus(type);
        if (!this.checkMsgs.length) {
            console.log(this.returnSave);
            this.returnSave.documentType = 'TT_FR_OIL_CH';
            if (type === 'save' || type === 'return') {
                this.returnService.saveReturn(this.returnSave).subscribe((data) => {
                    if (data.code === 'SUCCESS') {
                        this.returnSave = data.data;
                        this.filesControl.checkAddAttachment(data.data.documentNumber);
                        if (this.lastFilesControl) {
                            // 检查 销毁供应商有没有闪出 和添加附件
                            this.checkAddAttachment('save');
                        }
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
                this.returnService.submitReturn(this.returnSave).subscribe((data) => {
                    console.log(data);
                    if (data.code === 'SUCCESS') {
                        this.returnSave = data.data;
                        this.filesControl.checkAddAttachment(data.data.documentNumber);
                        this.toastService.showSuccess('SUCCESS', data.msg);
                        this.componentService.setPublicHistory('submit', data.data, '', '');
                        this.modalClose();
                    } else {
                        this.toastService.showError('ERROR', data.msg);
                    }
                    if (!this.returnSave.documentNumber || (this.returnSave.documentNumber && this.pageType === 'create')) {
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
            if (!this.returnSave.title) {
                this.toastService.showError('ERROR', this.display.titleRequired);
                this.checkMsgs.push(1);
            }
        } else {
            if (!this.returnSave.title) {
                this.toastService.showError('ERROR', this.display.titleRequired);
                this.checkMsgs.push(1);
            }
            if (!this.returnSave.orderNo) {
                this.toastService.showError('ERROR', this.display.orderNoRequired);
                this.checkMsgs.push(1);
            }
            if (!this.returnSave.desQuantity) {
                this.toastService.showError('ERROR', this.display.desQuantityRequired);
                this.checkMsgs.push(1);
            }
            if (!this.returnSave.batchNo) {
                this.toastService.showError('ERROR', this.display.batchNoRequired);
                this.checkMsgs.push(1);
            }
            if (!this.returnSave.desAmount) {
                this.toastService.showError('ERROR', this.display.desAmountRequired);
                this.checkMsgs.push(1);
            }
            if (!this.returnSave.phone) {
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
    lastFilesRemove(event) {

    }

    approve() {
        console.log(this.returnApprove);
        if (this.taskData.canDeny && this.taskData.isCreated) {
            this.formSubmit('return');
        } else {
            if (this.taskData.lastNode) {
                if (!this.lastUploadedFiles.length) {
                    // 请上传附件
                    this.toastService.showInfo('INFO', '请先上传附件！');
                } else {
                    this.checkAddAttachment('approve');
                }
            } else if (this.taskData.onlyCanApprove) {
                this.returnApprove.selectedValue = 'APPROVE';
                this.doApprove('approve');
            } else {
                if (!this.returnApprove.selectedValue) {
                    this.toastService.showInfo('INFO', this.display.ApproveMessage);
                } else if (this.returnApprove.selectedValue !== 'APPROVE' && !this.returnApprove.approvalComment) {
                    this.toastService.showInfo('INFO', '请先填写审批意见！');
                } else {
                    this.doApprove('approve');
                }
            }
        }
        // if (this.taskData.lastNode) {
        //     if (!this.lastUploadedFiles.length) {
        //         // 请上传附件
        //         this.toastService.showInfo('INFO', '请先上传附件！');
        //     } else {
        //         this.checkAddAttachment('approve');
        //     }
        // } else if (this.taskData.onlyCanApprove) {
        //     this.returnApprove.selectedValue = 'APPROVE';
        //     this.doApprove('approve');
        // } else {
        //     if (!this.returnApprove.selectedValue) {
        //         this.toastService.showInfo('INFO', this.display.ApproveMessage);
        //     } else if (this.returnApprove.selectedValue !== 'APPROVE' && !this.returnApprove.approvalComment) {
        //         this.toastService.showInfo('INFO', '请先填写审批意见！');
        //     } else {
        //         this.doApprove('approve');
        //     }
        // }
    }

    doApprove(type) {
        this.componentService.doApprove(type, 'returnModal', this.taskData, this.returnApprove);
    }

    delete() {
        this.componentService.deleteProcess(this.taskData, 'returnModal');
    }

    onRemove(item, type, index) {
        let filesArr = [];
        if (type === 'before') {
            filesArr = this.lastFilesControl.files;
            for (let i = 0; i < filesArr.length; i++) {
                if (filesArr[i].name === item.name && filesArr[i].lastModified === item.lastModified) {
                    this.lastFilesControl.files.splice(i, 1);
                }
            }
        } else if (type === 'after') {
            filesArr = this.lastUploadedFiles;
            if (filesArr && filesArr.length) {
                if (item.attachmentId) {
                    this.saveDeleteFiles.push(item.attachmentId);
                }
                // const saveDeleteFilesStr = this.saveDeleteFiles.join(',');
            }
            filesArr.splice(index, 1);
            // this.saveDeleteFiles = [];
        }
    }

    onUpload(event) {
        const uploadResponse = JSON.parse(event.xhr.response);
        if (uploadResponse.code === 'SUCCESS') {
            if (uploadResponse.data && uploadResponse.data.length) {
                const filesArr = uploadResponse.data;
                for (const fileItem of filesArr) {
                    const obj = {
                    };
                    for (const item in fileItem.data) {
                        if (fileItem.code === 'SUCCESS') {
                            obj['attachmentName'] = fileItem.data.fileName;
                            obj['downloadUrl'] = fileItem.data.downloadUrl;
                            obj['fileName'] = fileItem.data.fileName;
                            obj['createdBy'] = this.ls.get('userId');
                            obj['creationDate'] = new Date();
                            obj['sourceType'] = this.uploadConfig.sourceType + '-last';
                            obj['lastModified'] = fileItem.data.lastModified;
                            obj['fileMsg'] = fileItem.data.fileName + fileItem.msg;
                            obj['sourceId'] = this.returnSave.documentNumber;
                            obj['isAdd'] = false;
                        } else {
                            obj['fileMsg'] = fileItem.msg;
                        }
                    }
                    this.lastUploadedFiles.push(obj);
                }
            }
        }
    }

    select(e) {
        console.log(e);
    }

    checkAddAttachment(type) {
        const filesArr = this.lastUploadedFiles;
        if (filesArr && filesArr.length) {
            for (const item of filesArr) {
                if (!item.attachmentId && !item.isAdd) {
                    this.saveAddFiles.push(item);
                }
            }
            if (this.saveAddFiles.length > 0) {
                this.attachmentService.addAttachmentInfo(this.saveAddFiles)
                    .subscribe((res) => {
                        if (res.code === 'SUCCESS') {
                            console.log('addAttachmentInfo success');
                            for (const item of filesArr) {
                                item.isAdd = true;
                            }
                            if (type === 'approve') {
                                this.returnApprove.selectedValue = 'APPROVE';
                                this.componentService.doApprove('approve', 'returnModal', this.taskData, this.returnApprove);
                            } else {
                            }
                        } else {
                            if (type === 'approve') {
                                this.toastService.showError('ERROR', '附件上传失败，无法审批！');
                            } else {
                                this.toastService.showError('ERROR', res.msg || this.display.makeError);
                            }
                        }
                    });
                this.saveAddFiles = [];
                // this.lastUploadedFiles = [];
            }
        }
    }
}
