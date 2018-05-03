
import { Component, ViewChild, ElementRef, Provider, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { Message } from 'primeng/components/common/api';
import { WordHelpListPage, WordHelpListSearch, WordHelpListResponse, WordHelpDelete, WordHelp } from '../models/wordHelpModel';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { WordHelpService } from './wordHelp.service';
import { AttachmentService } from '../../../core/service/attachment.service';
import { NetworkConfig } from '../../../../app.service';
import { LocalStorage } from '../../../core/component/localStorage/localStorage.component';
import { ConfirmationService } from 'primeng/primeng';
import { MessageService } from 'primeng/components/common/messageservice';
import { ToastService } from '../../../core/service/toast.service';

@Component({
    selector: 'app-word-help',
    templateUrl: './wordHelp.component.html',
    providers: [ConfirmationService, MessageService]
})

export class WordHelpComponent implements OnInit {
    @ViewChild('tableModal') tableModal: ModalDirective;
    @ViewChild('fileSelector') fileSelector: ElementRef;
    @ViewChild('fileControlVQ') fileControl: any;

    @ViewChild('titleCell') titleCell: TemplateRef<any>;
    @ViewChild('opationCell') opationCell: TemplateRef<any>;

    private wordHelpListPage: WordHelpListPage = new WordHelpListPage();
    wordHelpListSearch: WordHelpListSearch = new WordHelpListSearch();
    private wordHelpDelete: WordHelpDelete = new WordHelpDelete();
    wordHelp: WordHelp = new WordHelp();
    private uploadResponse: any;
    loading: Boolean = true;
    tableConfig = {
        isNumber: false,
        isSelect: false
    };
    tableCols = [];
    tableData: Array<any> = []; // 表格数据
    totalRecords: Number = 0;

    showUploadDialog: Boolean = false;
    msgs: Message[];
    uploadedFiles: any[] = [];
    uploadUrl: string = NetworkConfig.domain + NetworkConfig.path.uploadFiles;
    display: any = {};
    saveDeleteFiles = []; // 保存删除的附件

    constructor(
        private wordHelpService: WordHelpService,
        private attachmentService: AttachmentService,
        private router: Router,
        private ls: LocalStorage,
        private confirmationService: ConfirmationService,
        private toastService: ToastService
    ) {
        this.display = this.ls.getObject('display'); // 获取显示字段

    }

    ngOnInit() {
        this.wordHelpListPage.pageNum = 1;
        this.wordHelpListPage.pageSize = 10;
        this.getHelpDocuments();
        this.tableCols = [
            {
                'header': this.display.name, 'field': 'fileName',
                'cellTemplate': this.titleCell, 'left': true, 'width': '40%', 'isSort': true
            },
            { 'header': this.display.FileName, 'field': 'attachmentName', 'left': true, 'width': '52%', 'isSort': true },
            { 'header': this.display.Operation, 'cellTemplate': this.opationCell, 'field': 'file', 'width': '8%', 'isSort': false }
        ];
    }

    /**
     * 附件上传
     * zengwei 2017年11月16日14:03:08
     * @param event
     * @memberof WordHelpComponent
     */
    onUpload(event) {
        this.msgs = [];
        this.uploadResponse = JSON.parse(event.xhr.response);
        if (this.uploadResponse.code === 'SUCCESS') {
            this.wordHelp.attachmentName = this.uploadResponse.data[0].data.fileName;
            this.wordHelp.downloadUrl = this.uploadResponse.data[0].data.downloadUrl;
            this.wordHelp.createdBy = this.ls.get('userId');
            this.wordHelp.fileName = '';
            this.wordHelp.sourceId = -1;
            this.wordHelp.sourceType = 'help-doc';
            this.msgs.push({ severity: 'success', summary: 'info', detail: this.display.uploadSuccess });
        } else {
            this.msgs.push({ severity: 'error', summary: 'info', detail: this.display.uploadError });
        }
        for (const file of event.files) {
            this.uploadedFiles.push(file);
        }
    }

    /**
     * 删除已选择的附件
     * jiangen  2017年11月29日16:28:57
     * @param {any} item  删除哪一个数组
     * @memberof KdQuotationModalComponet
     */
    onRemove(item, type, index) {
        let filesArr = [];

        if (type === 'before') {
            filesArr = this.fileControl.files;
        } else if (type === 'after') {
            filesArr = this.uploadedFiles;
        }
        if (filesArr && filesArr.length) {
            if (item.attachmentId) {
                this.saveDeleteFiles.push(item.attachmentId);
            }
            filesArr.splice(index, 1);
        }
    }

    /**
     * 获取帮助文档列表
     * zw 2017年11月24日16:13:07
     */
    getHelpDocuments(boolean?) {
        const params = this.wordHelpListSearch;
        // params['sourceId'] = -1;
        // params['sourceType'] = 'help-doc';
        // params['attachmentName'] = this.wordHelpListSearch.attachmentName;
        if (!boolean) {
            this.wordHelpListPage.pageNum = 1;
        }
        this.wordHelpListPage.attachmentName = this.wordHelpListSearch.attachmentName || '';
        this.wordHelpService.getHelpDocumentList(this.wordHelpListPage, params)
            .subscribe((res: WordHelpListResponse) => {
                if (res.code === 'SUCCESS') {
                    this.tableData = res.data.list;
                    this.totalRecords = res.data.total;
                    this.loading = false;
                }
            });
    }

    goDetail(e) {
        // this.router.navigate(['help/word-help-online', {'downloadUrl': e.downloadUrl}]);
    }

    /**
     * 下载帮助文档列表
     * zw 2017年11月24日15:50:34
     * @param param
     * @memberof WordHelpComponent
     */
    editItem(e) {
        this.attachmentService.downloadFile(e.downloadUrl);
    }

    /**
     * 删除帮助文档列表
     * zw 2017年11月24日15:50:31
     * @param param
     * @memberof WordHelpComponent
     */
    deleteItem(e) {
        this.confirmationService.confirm({
            message: this.display.DeleteMessage,
            accept: () => {
                this.wordHelpDelete.attachmentId = e.attachmentId;
                this.wordHelpService.deleteHelpDocument(this.wordHelpDelete).subscribe((res) => {
                    if (res.code === 'SUCCESS') {
                        this.toastService.showSuccess('success', this.display.makeSuccess);
                    } else {
                        this.toastService.showSuccess('error', this.display.makeError);
                    }
                    setTimeout(() => {
                        this.getHelpDocuments();
                    }, 300);
                });
            }
        });
    }

    showDialog() {
        this.showUploadDialog = true;
        this.uploadedFiles = [];
    }

    /**
     * 帮组文档列表 分页
     * zw 2017年11月24日15:51:28
     * @param {any} data  当前的pageSize和pageNum
     * @memberof WordHelpComponent
     */
    tableGetPage(data) {
        this.wordHelpListPage.pageNum = data.page * 1 + 1;
        this.wordHelpListPage.pageSize = data.rows;
        this.getHelpDocuments(true);
    }

    /**
     * 上传帮助文档
     * zw 2017-11-25 19:25:28
     */
    addHelpDocument() {
        if (this.uploadedFiles.length > 0 && this.wordHelp.fileName) {
            const filesArr = [this.wordHelp];
            this.attachmentService.addAttachmentInfo(filesArr).subscribe((res) => {
                if (res.code === 'SUCCESS') {
                    this.toastService.showSuccess('success', this.display.makeSuccess);
                } else {
                    this.toastService.showSuccess('error', this.display.makeError);
                }
            });
            this.closeFileDialog();
        } else {
            this.toastService.showError('error', this.display.uploadCheck);
        }

    }

    closeFileDialog() {
        setTimeout(() => {
            this.getHelpDocuments();
        }, 300);
        this.showUploadDialog = false;
        this.wordHelp = new WordHelp();
        this.uploadedFiles = [];
        this.fileControl.files = [];
    }
}
