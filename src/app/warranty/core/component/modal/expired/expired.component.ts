import { Component, Output, Input, EventEmitter, ViewChild } from '@angular/core';
import { ExpiredService } from './expired.service';
import { LocalStorage } from '../../localStorage/localStorage.component';
import { AppService, NetworkConfig } from '../../../../../app.service';
import { ExpiredSave, ExpiredApprove } from '../models/expired.model';
import { Message } from 'primeng/primeng';
import { ToastService } from '../../../service/toast.service';
import { AttachmentService } from '../../../service/attachment.service';
import { ComponentService } from '../../component.service';
import { HistoryData } from '../models/document.model';

@Component({
    selector: 'app-expired-modal',
    templateUrl: './expired.component.html',
})

export class ExpiredComponent {
    @ViewChild('fileControla') fileControla: any;
    @ViewChild('fileControlb') fileControlb: any;
    @ViewChild('fileControlc') fileControlc: any;
    @Output('_onModalClose') _onModalClose: EventEmitter<any> = new EventEmitter<any>();
    @Input('historyData') historyData: HistoryData;
    @Input('isHistory') isHistory: Boolean = false;
    @Input('expiredSave') expiredSave: ExpiredSave = new ExpiredSave();
    @Input('brandList') brandList: any = [];
    @Input('pageType') pageType: string;
    @Input('taskData') taskData: any = {};
    @Input('uploadedFiles') uploadedFiles: Array<any> = [[], [], []];

    disabled: Boolean = false;
    display: any;
    showChoose = false;
    history: Boolean = true;
    tableType: string;  // chooseDialog的源数据类型
    tableData: Array<any> = []; // chooseDialog的源数据
    tableCols: Array<any> = []; // chooseDialog的表格列
    selectionMode: string; // chooseDialog的选择类型
    cumList: Array<any> = [];
    isManager = false;
    userInfo: any = {};
    saveDeleteFiles = [];
    saveAddFiles = [];
    historyTableCols = [];
    expiredApprove: ExpiredApprove = new ExpiredApprove();
    checkMsgs: any[] = [];
    // uploadUrl: string = NetworkConfig.domain + NetworkConfig.paths.fileUpload;
    uploadUrl = NetworkConfig.domain + NetworkConfig.path.uploadFiles;


    constructor(
        private ls: LocalStorage,
        private expiredService: ExpiredService,
        private appService: AppService,
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
        this._onModalClose.emit('expiredModal');
        this.checkMsgs = [];
        this.uploadedFiles = [[], [], []];
        this.expiredSave = new ExpiredSave();
        this.expiredApprove = new ExpiredApprove();
        this.disabled = false;
    }

    // 保存 提交
    formSubmit(type) {
        this.checkMsgs = [];
        if (!this.taskData.canDeny && !this.isManager) {
            this.expiredSave.createdBy = this.userInfo.userId;
            this.expiredSave.creatorName = this.userInfo.userName;
        }
        this.checkStatus(type);
        if (!this.checkMsgs.length) {
            console.log(this.expiredSave);
            this.expiredSave.documentType = 'TT_OV_CL_AP';
            if (type === 'save' || type === 'return') {
                this.expiredService.saveExpired(this.expiredSave).subscribe((data) => {
                    if (data.code === 'SUCCESS') {
                        this.expiredSave = data.data;
                        this.checkAddAttachment(data.data.documentNumber);
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
                this.expiredService.submitExpired(this.expiredSave).subscribe((data) => {
                    console.log(data);
                    if (data.code === 'SUCCESS') {
                        this.expiredSave = data.data;
                        this.checkAddAttachment(data.data.documentNumber);
                        this.toastService.showSuccess('SUCCESS', data.msg);
                        this.componentService.setPublicHistory('submit', data.data, '', '');
                        this.modalClose();
                    } else {
                        this.toastService.showError('ERROR', data.msg);
                    }
                    if (!this.expiredSave.documentNumber || (this.expiredSave.documentNumber && this.pageType === 'create')) {
                        this.disabled = false;
                    }
                });
            }
            if (this.saveDeleteFiles && this.saveDeleteFiles.length) {
                const deleteStr = this.saveDeleteFiles.join(',');
                this.componentService.deleteAttachment(deleteStr);
            }
        }
    }

    checkStatus(type) {
        if (type === 'save') {
            if (!this.expiredSave.title) {
                this.toastService.showError('ERROR', this.display.titleRequired);
                this.checkMsgs.push(1);
            }
        } else {
            if (!this.expiredSave.title) {
                this.toastService.showError('ERROR', this.display.titleRequired);
                this.checkMsgs.push(1);
            }
            if (!this.expiredSave.brandCode) {
                this.toastService.showError('ERROR', this.display.brandCodeRequired);
                this.checkMsgs.push(1);
            }
            if (!this.expiredSave.customerCode) {
                this.toastService.showError('ERROR', this.display.customerExpiredCodeRequired);
                this.checkMsgs.push(1);
            }
            if (!this.expiredSave.amount) {
                this.toastService.showError('ERROR', this.display.amountRequired);
                this.checkMsgs.push(1);
            }
            if (!this.expiredSave.quantity) {
                this.toastService.showError('ERROR', this.display.quantityRequired);
                this.checkMsgs.push(1);
            }
            if (!this.expiredSave.phone) {
                this.toastService.showError('ERROR', this.display.phoneRequired);
                this.checkMsgs.push(1);
            }
            if (!this.uploadedFiles[0].length || !this.uploadedFiles[1].length || !this.uploadedFiles[2].length) {
                this.toastService.showError('ERROR', this.display.pleaseCheckFiles);
                this.checkMsgs.push(1);
            }
        }
    }

    // 查找经销商
    showChooseDialog(type, mode) {
        this.tableType = type;
        this.selectionMode = mode;
        this.tableCols = this.componentService.getTableCols(type);
        this.getChoose();
        this.showChoose = true;
    }

    // 选择经销商
    getChoose() {
        this.componentService.getCumList().subscribe((res) => {
            this.tableData = res;
        });
    }

    setCustomer(e) {
        console.log(e);
        this.expiredSave.regionName = e.regionName;
        this.expiredSave.regionManagerName = e.regionManager;
        this.expiredSave.customerCode = e.customerCode;
        this.expiredSave.customerName = e.customerName;
        this.expiredSave.claimCode = e.claimCode;
        this.closeChoose();
    }

    // 关闭选择
    closeChoose() {
        this.appService.isCloseFun(true);
        this.showChoose = false;
    }

    onRemove(item, type, index, file) {
        if (type === 'before') {
            console.log(file);
            console.log(this['fileControl' + file]);
            const filesArr = this['fileControl' + file].files;
            for (let i = 0; i < filesArr.length; i++) {
                if (filesArr[i].name === item.name && filesArr[i].lastModified === item.lastModified) {
                    console.log(filesArr);
                    filesArr.splice(i, 1);
                }
            }
        } else if (type === 'after') {
            const filesArr = this.uploadedFiles[file];
            if (this.uploadedFiles[file] && this.uploadedFiles[file].length) {
                if (item.attachmentId) {
                    this.saveDeleteFiles.push(item.attachmentId);
                }
            }
            filesArr.splice(index, 1);
            console.log(this.saveDeleteFiles);
        }

    }

    onUpload(event, index, type) {
        const uploadResponse = JSON.parse(event.xhr.response);
        if (uploadResponse.code === 'SUCCESS') {
            if (uploadResponse.data && uploadResponse.data.length) {
                const filesArr = uploadResponse.data;
                for (let i = 0; i < filesArr.length; i++) {
                    const obj = {
                    };
                    for (const item in filesArr[i]) {
                        if (filesArr[i].code === 'SUCCESS') {
                            obj['attachmentName'] = filesArr[i].data.fileName;
                            obj['downloadUrl'] = filesArr[i].data.downloadUrl;
                            obj['createdBy'] = this.ls.get('userId');
                            obj['creationDate'] = new Date();
                            obj['sourceType'] = 'TT_OV_CL_AP-' + type + i;
                            obj['lastModified'] = filesArr[i].data.lastModified;
                            obj['fileMsg'] = filesArr[i].data.fileName + filesArr[i].msg;
                            obj['sourceId'] = '';
                        }
                    }
                    this['uploadedFiles'][index].push(obj);
                }
            }
        }
        console.log(this['uploadedFiles' + type]);
    }

    checkAddAttachment(number) {
        let filesArr = [];
        filesArr = [].concat(this.uploadedFiles[0], this.uploadedFiles[1], this.uploadedFiles[2]);
        if (filesArr && filesArr.length) {
            for (const item of filesArr) {
                if (!item.attachmentId && !item.isAdd) {
                    this.saveAddFiles.push(item);
                }
            }
            if (this.saveAddFiles.length > 0) {
                // TODO: 多文件
                for (const item of this.saveAddFiles) {
                    item.sourceId = number;
                }
                this.attachmentService.addAttachmentInfo(this.saveAddFiles)
                    .subscribe((res) => {
                        if (res.code === 'SUCCESS') {
                            console.log('addAttachmentInfo success');
                            for (const item of filesArr) {
                                item.isAdd = true;
                            }
                        }
                    });
                this.saveAddFiles = [];
            }
        }
    }

    approve() {
        console.log(this.expiredApprove);
        if (this.taskData.canDeny && this.taskData.isCreated) {
            this.formSubmit('return');
        } else {
            if (!this.expiredApprove.selectedValue) {
                this.toastService.showInfo('INFO', this.display.ApproveMessage);
            } else if (this.expiredApprove.selectedValue !== 'APPROVE' && !this.expiredApprove.approvalComment) {
                this.toastService.showInfo('INFO', this.display.OpinionMessage);
            } else {
                this.doApprove('approve');
            }
        }
        // if (!this.expiredApprove.selectedValue) {
        //     this.toastService.showInfo('INFO', this.display.ApproveMessage);
        // } else if (this.expiredApprove.selectedValue !== 'APPROVE' && !this.expiredApprove.approvalComment) {
        //     this.toastService.showInfo('INFO', this.display.OpinionMessage);
        // } else {
        //     this.doApprove('approve');
        // }
    }

    doApprove(type) {
        this.componentService.doApprove(type, 'expiredModal', this.taskData, this.expiredApprove);
    }

    delete() {
        this.componentService.deleteProcess(this.taskData, 'expiredModal');
    }
}
