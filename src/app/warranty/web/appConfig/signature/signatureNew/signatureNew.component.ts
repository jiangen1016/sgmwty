import { Component, OnInit, ViewChild } from '@angular/core';
import { LocalStorage } from '../../../../core/component/localStorage/localStorage.component';
import { Router, ActivatedRoute } from '@angular/router';
import { SignatureNew } from '../../models/signatureModel';
import { ComponentService } from '../../../../core/component/component.service';
import { SignatureNewService } from './signatureNew.service';
import { Message } from 'primeng/components/common/api';
import { NetworkConfig } from '../../../../../app.service';
import { UploadAttachmentResponse, AttachmentService } from '../../../../core/service/attachment.service';
import { resolve } from 'q';
import { ToastService } from '../../../../core/service/toast.service';

@Component({
    selector: 'app-signature-new',
    templateUrl: './signatureNew.component.html'
})

export class SignatureNewComponent {
    @ViewChild('fileControl') fileControl: any;

    display: any = {};
    checkMsgs: Message[] = [];
    msg: Message[] = [];
    showChoose = false;
    pageType: string;
    signatureId: string;
    tableType: string;
    selectionMode: string;
    roleCode: string;
    roleName: string;
    tableCols: Array<any> = [];
    tableData: Array<any> = [];
    uploadedFiles: Array<any> = [];
    saveFiles: Array<any> = [];
    roleList = [];
    uploadUrl: string = NetworkConfig.domain + NetworkConfig.path.uploadFiles;
    signatureNew: SignatureNew = new SignatureNew();
    constructor(
        private ls: LocalStorage,
        private router: Router,
        private componentService: ComponentService,
        private signatureNewService: SignatureNewService,
        private activatedRoute: ActivatedRoute,
        private toastService: ToastService,
        private attachmentService: AttachmentService
    ) {
        this.display = this.ls.getObject('display');
        this.pageType = this.activatedRoute.snapshot.paramMap.get('type');
        this.signatureId = this.activatedRoute.snapshot.paramMap.get('id');
        if (this.pageType === 'detail') {
            this.searchOne();
        }
        this.signatureNewService.getRoleList({ pageNum: 1, pageSize: 10000 }).subscribe((res) => {
            if (res.code === 'SUCCESS') {
                this.roleList = res.data.list;
            }
        });
    }

    /**
     * 签名配置 - 返回
     * jiangen  2018年1月10日17:08:44
     * @memberof SignatureNewComponent
     */
    goBack() {
        this.router.navigate(['config/signature']);
    }

    /**
     * 签名配置 - 显示dialog
     * jiangen  2018年1月11日09:42:08
     * @memberof SignatureNewComponent
     */
    showChooseDialog(tableType, selectionMode) {
        if (!this.signatureNew.roleCode) {
            this.toastService.showError('ERROR', '请先选择角色！');
        } else {
            this.tableType = tableType;
            this.selectionMode = selectionMode;
            this.tableCols = this.componentService.getTableCols(this.tableType);
            this.getChooseList();
            this.showChoose = true;
        }
    }

    /**
     * 签名新增 -  查看一个新的
     * jiangen  2018年1月16日14:41:24
     * @memberof SignatureNewComponent
     */
    searchOne() {
        if (this.signatureId) {
            const params = {
                signatureId: this.signatureId
            };
            this.signatureNewService.selectOneSignature(params).subscribe((data) => {
                if (data.code === 'SUCCESS') {
                    this.signatureNew = data.data;
                    this.uploadedFiles = [];
                    console.log(data);
                    this.uploadedFiles.push({
                        attachmentId: data.data.attachmentId,
                        attachmentName: data.data.attachmentName,
                        createdBy: this.ls.get('userId'),
                        downloadUrl: data.data.downloadUrl,
                        sourceId: data.data.sourceId,
                        sourceType: data.data.sourceType,
                        isAdd: true,
                    });
                }
            });
        }
    }

    /**
     * 签名配置 - 根据角色获取成员
     * jiangen  2018年1月11日09:56:30
     * @memberof SignatureNewComponent
     */
    getChooseList() {
        const params = {
            roleCode: this.signatureNew.roleCode + ''
        };
        this.signatureNewService.getRoleMemberList(params).subscribe((data) => {
            if (data.code === 'SUCCESS') {
                this.tableData = data.data.data;
            }
        });
    }

    /**
     * 签名配置 - 关闭弹窗
     * jiangen  2018年1月11日10:13:59
     * @param {any} data
     * @memberof SignatureNewComponent
     */
    closeChoose(data) {
        if (data) {
            this.showChoose = false;
            this.tableData = [];
        }
    }

    /**
     * 签名配置   -   选择确定
     * jiangen  2018年1月11日10:14:22
     * @memberof SignatureNewComponent
     */
    getChoose(data) {
        if (data) {
            this.signatureNew.empuid = data.userUid;
            this.signatureNew.empId = data.empId;
            this.signatureNew.userName = data.userName;
            this.signatureNew.userUid = data.userUid;
            this.signatureNew.memberId = data.memberId + '';
        }
        this.showChoose = false;
    }

    onRoleChange() {
        this.signatureNew.empId = '';
        this.signatureNew.userName = '';
        this.signatureNew.userUid = '';
    }

    /**
     * 签名配置 - 保存
     * jiangen 2018年1月10日17:09:08
     * @memberof SignatureNewComponent
     */
    signatureSave() {
        this.checkStatus();
        if (!this.checkMsgs.length) {
            this.componentService.getZPStoken().subscribe((data) => {
                if (data.code === 'SUCCESS') {
                    const urlParams = {
                        token: data.data
                    };
                    if (this.pageType === 'create') {
                        this.uploadedFiles[0].sourceId = this.signatureNew.memberId;
                        const params = {
                            sinatureName: this.uploadedFiles[0].attachmentName,
                            description: this.signatureNew.description,
                            createdBy: this.ls.get('userId'),
                            empuid: this.signatureNew.userUid,
                            memberId: this.signatureNew.memberId
                        };
                        this.signatureNewService.saveSignature(urlParams, params).subscribe((res) => {
                            if (res.code === 'SUCCESS') {
                                this.addFiles();
                                this.goBack();
                            } else {
                                this.toastService.showError('ERROR', res.msg);
                            }
                        });
                    } else {
                        // this.uploadedFiles[0].sourceId = this.signatureNew.empuid;
                        const params = {
                            attachmentName: this.uploadedFiles[0].attachmentName,
                            sourceId: this.signatureNew.empuid,
                            attachmentId: this.signatureNew.attachmentId,
                            sourceType: 'SIGNATURE',
                            downloadUrl: this.uploadedFiles[0].downloadUrl,
                            description: this.signatureNew.description,
                            empuid: this.signatureNew.empuid,
                            sinatureName: this.uploadedFiles[0].attachmentName,
                            signatureId: this.signatureNew.signatureId,
                            sinatureCode: this.signatureNew.sinatureCode,
                            memberId: this.signatureNew.memberId,
                            createdBy: this.ls.get('userId')
                        };
                        this.signatureNewService.updateSignature(urlParams, params).subscribe((res) => {
                            if (res.code === 'SUCCESS') {
                                this.goBack();
                            } else {
                                this.toastService.showError('ERROR', res.msg || this.display.makeError);
                            }
                        });
                    }
                } else {
                    this.toastService.showError('ERROR', data.msg || this.display.makeError);
                }
            });
        }

    }

    /**
     * 签名配置 - 删除附件
     * jiangen   2018年1月12日16:23:48
     * @param {any} item  文件信息
     * @param {any} type  上传前还是上传之后
     * @param {any} index 第几个附件
     * @memberof SignatureNewComponent
     */
    onRemove(item, type, index) {
        let filesArr = [];
        if (type === 'before') {
            filesArr = this.fileControl.files;
        } else if (type === 'after') {
            filesArr = this.uploadedFiles;
        }
        if (filesArr && filesArr.length) {
            filesArr.splice(index, 1);
        }
    }

    addFiles() {
        if (!this.uploadedFiles[0].isAdd) {
            this.attachmentService.addAttachmentInfo(this.uploadedFiles).subscribe((res) => {
                if (res.code === 'SUCCESS') {
                    for (const item of this.uploadedFiles) {
                        item.isAdd = true;
                    }
                }
            });
        }
    }

    /**
     * 附件上传
     * jiangen   2018年1月16日15:36:51
     * @param {any} event
     * @memberof SignatureNewComponent
     */
    onUpload(event) {
        const uploadResponse = JSON.parse(event.xhr.response);
        if (uploadResponse.code === 'SUCCESS') {
            const fileItem = uploadResponse.data;
            const obj = {};
            // for (let item in fileItem.data) {
            obj['attachmentName'] = fileItem[0].data.fileName;
            obj['downloadUrl'] = fileItem[0].data.downloadUrl;
            obj['createdBy'] = this.ls.get('userId');
            obj['creationDate'] = new Date();
            obj['sourceType'] = 'SIGNATURE';
            obj['fileMsg'] = fileItem[0].data.fileName + fileItem[0].msg;
            obj['sourceId'] = '';
            obj['isAdd'] = false;
            // }
            this.uploadedFiles.push(obj);

        }
    }

    onSelect(e) {
        this.uploadedFiles = [];
    }

    /**
     * 签名配置 - 保存前校验状态
     * jiangen  2018年1月12日11:08:38
     * @memberof SignatureNewComponent
     */
    checkStatus() {
        this.checkMsgs = [];
        if (!this.signatureNew.roleCode) {
            this.checkMsgs.push({ severity: 'error', summary: '请选择角色' });
        }
        if (!this.signatureNew.userName) {
            this.checkMsgs.push({ severity: 'error', summary: '请选择成员' });
        }
        if (!this.uploadedFiles.length) {
            this.checkMsgs.push({ severity: 'error', summary: '请上传附件' });
        }
    }
}
