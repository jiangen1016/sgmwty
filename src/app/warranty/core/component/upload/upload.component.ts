import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { LocalStorage } from '../localStorage/localStorage.component';
import { AttachmentService } from '../../service/attachment.service';

@Component({
    selector: 'app-file-upload',
    templateUrl: './upload.component.html'
})

export class UploadComponent {
    @Input('uploadConfig') uploadConfig: any;
    @Input('uploadedFiles') uploadedFiles = [];
    @Output('_onUploadSuccess') _onUploadSuccess: EventEmitter<any> = new EventEmitter();
    @Output('_onFilesRemove') _onFilesRemove: EventEmitter<any> = new EventEmitter();
    @ViewChild('fileControl') fileControl: any;

    saveDeleteFiles = [];
    saveAddFiles = [];
    display: any = {};
    constructor(
        private ls: LocalStorage,
        private attachmentService: AttachmentService
    ) {
        this.display = this.ls.getObject('display');
    }

    select() {
    }

    onRemove(item, type, index) {
        let filesArr = [];
        if (type === 'before') {
            filesArr = this.fileControl.files;
            for (let i = 0; i < filesArr.length; i++) {
                if (filesArr[i].name === item.name && filesArr[i].lastModified === item.lastModified) {
                    this.fileControl.files.splice(i, 1);
                }
            }
        } else if (type === 'after') {
            filesArr = this.uploadedFiles;
            if (filesArr && filesArr.length) {
                if (item.attachmentId) {
                    this.saveDeleteFiles.push(item.attachmentId);
                }
                const saveDeleteFilesStr = this.saveDeleteFiles.join(',');
                this._onFilesRemove.emit(saveDeleteFilesStr);
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
                            obj['sourceType'] = this.uploadConfig.sourceType;
                            obj['lastModified'] = fileItem.data.lastModified;
                            obj['fileMsg'] = fileItem.data.fileName + fileItem.msg;
                            obj['sourceId'] = '';
                            obj['isAdd'] = false;
                        } else {
                            obj['fileMsg'] = fileItem.msg;
                        }
                    }
                    this.uploadedFiles.push(obj);
                }
                this._onUploadSuccess.emit(this.uploadedFiles);
            }
        }
    }

    checkAddAttachment(number) {
        const filesArr = this.uploadedFiles;
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
}
