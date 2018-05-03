import { Component, Output, Input, EventEmitter, ViewChild } from '@angular/core';
import { LocalStorage } from '../../localStorage/localStorage.component';
import { AppService, NetworkConfig } from '../../../../../app.service';
import { Message } from 'primeng/primeng';
import { DocumentSave, HistoryData, DocumentApprove, Manage } from '../models/document.model';
import { UploadComponent } from '../../upload/upload.component';
import { ToastService } from '../../../service/toast.service';
import { ComponentService } from '../../component.service';
import { DocumentService } from './document.service';

@Component({
    selector: 'app-normal-modal',
    templateUrl: './document.component.html',
})

export class NormalComponent {
    @ViewChild('filesControl') filesControl: UploadComponent;
    @Output('_onModalClose') _onModalClose: EventEmitter<any> = new EventEmitter<any>();
    @Input('documentSave') documentSave: DocumentSave = new DocumentSave();
    @Input('uploadedFiles') uploadedFiles: Array<any> = [];
    @Input('historyData') historyData: HistoryData;
    @Input('taskData') taskData: any = {};
    @Input('pageType') pageType: string;
    @Input('isHistory') isHistory: Boolean = false;
    disabled: Boolean = false;
    tableData: any;
    showChoose: Boolean = false;
    tableCols: any[];
    selectionMode: any;
    tableType: any;
    documentApprove: DocumentApprove = new DocumentApprove();
    // manageInfo: Manage = new Manage();
    display: any;
    userInfo: any = {};
    checkMsgs: any[] = [];
    history: Boolean = true;
    historyTableCols = [];
    saveDeleteFiles = '';
    isManager = false;
    saveAddFiles = [];
    uploadConfig = {
        uploadUrl: NetworkConfig.domain + NetworkConfig.path.uploadFiles,
        uploadMode: 'multiple',
        sourceType: 'TT_OTH_PRC'
    };

    constructor(
        private ls: LocalStorage,
        private appService: AppService,
        private toastService: ToastService,
        private componentService: ComponentService,
        private documentService: DocumentService
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
        // 获取主管信息
        const params = {
            empUid: this.userInfo.userId
        };
        this.documentService.getManagerInfo(params).subscribe((res) => {
            this.documentSave.lineManagerName = ',test01()';
            this.documentSave.lineManagerUid = 'test01';
        });
        this.documentSave.creatorName = this.userInfo.userName;
    }

    // 关闭modal
    modalClose() {
        this._onModalClose.emit('normalModal');
        this.documentSave = new DocumentSave();
        this.documentApprove = new DocumentApprove();
        this.checkMsgs = [];
        if (this.filesControl) {
            this.filesControl.uploadedFiles = [];
            this.filesControl.fileControl.files = [];
        }
        this.documentSave.creatorName = this.userInfo.userName;
        this.disabled = false;
    }

    formSubmit(type) {
        this.checkMsgs = [];
        if (!this.taskData.canDeny && !this.isManager) {
            this.documentSave.createdBy = this.userInfo.userId;
        }
        this.checkStatus(type);
        if (!this.checkMsgs.length) {
            this.documentSave.documentType = 'TT_OTH_PRC';
            if (type === 'save' || type === 'return') {
                console.log(this.documentSave);
                this.documentService.saveDocument(this.documentSave).subscribe((data) => {
                    if (data.code === 'SUCCESS') {
                        this.documentSave = data.data;
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
                console.log(this.documentSave);
                this.disabled = true;
                this.documentService.submitDocument(this.documentSave).subscribe((data) => {
                    console.log(data);
                    if (data.code === 'SUCCESS') {
                        this.documentSave = data.data;
                        this.filesControl.checkAddAttachment(data.data.documentNumber);
                        this.toastService.showSuccess('SUCCESS', data.msg);
                        this.componentService.setPublicHistory('submit', data.data, '', '');
                        // 添加历史记录
                        this.modalClose();
                    } else {
                        this.toastService.showError('ERROR', data.msg);
                    }
                    if (!this.documentSave.documentNumber || (this.documentSave.documentNumber && this.pageType === 'create')) {
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
            if (!this.documentSave.title) {
                this.toastService.showError('ERROR', this.display.titleRequired);
                this.checkMsgs.push(1);
            }
        } else {
            if (!this.documentSave.title) {
                this.toastService.showError('ERROR', this.display.titleRequired);
                this.checkMsgs.push(1);
            }
            if (!this.documentSave.phone) {
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

    showChooseDialog(tableType, selectionMode) {
        this.tableType = tableType;
        this.selectionMode = selectionMode;
        this.tableCols = this.componentService.getTableCols('transferPerson');
        this.getChooseList();
        this.showChoose = true;
    }

    closeChoose() {
        this.appService.isCloseFun(true);
        this.showChoose = false;
    }

    getChooseList() {
        this.tableData = [];
        const params = {
            roleCode: this.tableType
        };
        this.componentService.getRoleMemberList(params).subscribe((data) => {
            if (data.code === 'SUCCESS') {
                console.log(data);
                this.tableData = data.data.list;
            }
        });
    }

    getChoose(e) {
        switch (this.tableType) {
            case 'Warranty Staff':
                this.documentSave.stockClaimsAgentName = '';
                this.documentSave.stockClaimsAgentUid = '';
                for (const item of e) {
                    this.documentSave.stockClaimsAgentName += item.userName ? (item.userName + ';') : '';
                    this.documentSave.stockClaimsAgentUid += item.userUid ? (item.userUid + ',') : '';
                }
                this.documentSave.stockClaimsAgentName = this.documentSave.stockClaimsAgentName.
                    substring(0, this.documentSave.stockClaimsAgentName.lastIndexOf(';'));
                this.documentSave.stockClaimsAgentUid = this.documentSave.stockClaimsAgentUid.
                    substring(0, this.documentSave.stockClaimsAgentUid.lastIndexOf(','));
                break;
            case 'AS Warranty Senior Manager':
                this.documentSave.seniorManagerClaimName = '';
                this.documentSave.seniorManagerClaimUid = '';
                for (const item of e) {
                    this.documentSave.seniorManagerClaimName += item.userName ? (item.userName + ';') : '';
                    this.documentSave.seniorManagerClaimUid += item.userUid ? (item.userUid + ',') : '';
                }
                this.documentSave.seniorManagerClaimName = this.documentSave.seniorManagerClaimName.
                    substring(0, this.documentSave.seniorManagerClaimName.lastIndexOf(';'));
                this.documentSave.seniorManagerClaimUid = this.documentSave.seniorManagerClaimUid.
                    substring(0, this.documentSave.seniorManagerClaimUid.lastIndexOf(','));
                break;
            case 'AS Technology Director':
                this.documentSave.tecnicalDirectorClaimName = '';
                this.documentSave.tecnicalDirectorClaimUid = '';
                for (const item of e) {
                    this.documentSave.tecnicalDirectorClaimName += item.userName ? (item.userName + ';') : '';
                    this.documentSave.tecnicalDirectorClaimUid += item.userUid ? (item.userUid + ',') : '';
                }
                this.documentSave.tecnicalDirectorClaimName = this.documentSave.tecnicalDirectorClaimName.
                    substring(0, this.documentSave.tecnicalDirectorClaimName.lastIndexOf(';'));
                this.documentSave.tecnicalDirectorClaimUid = this.documentSave.tecnicalDirectorClaimUid.
                    substring(0, this.documentSave.tecnicalDirectorClaimUid.lastIndexOf(','));
                break;
            case 'AS General Director':
                this.documentSave.asGeneralDirectorUid = '';
                this.documentSave.asGeneralDirectorName = '';
                for (const item of e) {
                    this.documentSave.asGeneralDirectorName += item.userName ? (item.userName + ';') : '';
                    this.documentSave.asGeneralDirectorUid += item.userUid ? (item.userUid + ',') : '';
                }
                this.documentSave.asGeneralDirectorName = this.documentSave.asGeneralDirectorName.
                    substring(0, this.documentSave.asGeneralDirectorName.lastIndexOf(';'));
                this.documentSave.asGeneralDirectorUid = this.documentSave.asGeneralDirectorUid.
                    substring(0, this.documentSave.asGeneralDirectorUid.lastIndexOf(','));
                break;
        }
        this.closeChoose();
    }

    approve() {
        console.log(this.documentApprove);
        if (this.taskData.canDeny && this.taskData.isCreated) {
            this.formSubmit('return');
        } else {
            if (!this.documentApprove.selectedValue) {
                this.toastService.showInfo('INFO', this.display.ApproveMessage);
            } else if (this.documentApprove.selectedValue !== 'APPROVE' && !this.documentApprove.approvalComment) {
                this.toastService.showInfo('INFO', this.display.OpinionMessage);
            } else {
                this.doApprove('approve');
            }
        }
    }

    doApprove(type) {
        this.componentService.doApprove(type, 'normalModal', this.taskData, this.documentApprove);
    }

    delete() {
        this.componentService.deleteProcess(this.taskData, 'normalModal');
    }
}
