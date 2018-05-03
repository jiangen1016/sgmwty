import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { WordConfigValueService } from './wordConfigValue.service';
import { ModalDirective } from 'ngx-bootstrap';
import {
    WordConfigValue, WordConfigValueListResponse, WordConfigValueRequest,
    WordConfigValueResponse, WordConfigValueDeleteRequest, WordConfigValueDeleteResponse,
    WordConfigValueListSearch, WordConfigValueListPage, WordConfigRequest
} from '../../models/wordConfigModel';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorage } from '../../../../core/component/localStorage/localStorage.component';
import { ComponentService } from '../../../../core/component/component.service';
import { AppService } from '../../../../../app.service';
import { MessageService } from 'primeng/components/common/messageservice';
import { ConfirmationService } from 'primeng/primeng';
import { ToastService } from '../../../../core/service/toast.service';

@Component({
    selector: 'app-word-congif-value',
    templateUrl: 'wordConfigValue.component.html',
    providers: [MessageService, ConfirmationService]
})

export class WordConfigValueComponent implements OnInit {
    @ViewChild('opationCell') opationCell: TemplateRef<any>;
    @ViewChild('WordConfigValueModal') WordConfigValueModal: ModalDirective;

    wordConfigValueListSearch: WordConfigValueListSearch = new WordConfigValueListSearch();
    private wordConfigValueListPage: WordConfigValueListPage = new WordConfigValueListPage();
    loading: Boolean = true;

    wordConfigValue: WordConfigValue = new WordConfigValue();
    lookupId: number;
    mergeType: string;

    tableConfig = {
        isNumber: true,
        isSelect: false
    };
    tableCols = [];
    tableData: Array<any> = [];
    totalRecords: number;
    display: any = {};
    modalConfig: any = this.appService.modalConfig;

    constructor(
        private wordConfigValueService: WordConfigValueService,
        private activatedRoute: ActivatedRoute,
        private ls: LocalStorage,
        private router: Router,
        private componentService: ComponentService,
        private appService: AppService,
        private toastService: ToastService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {
        this.display = this.ls.getObject('display'); // 获取显示字段

    }

    ngOnInit() {
        this.wordConfigValueListPage.pageNum = 1;
        this.wordConfigValueListPage.pageSize = 10;
        this.lookupId = parseInt(this.activatedRoute.snapshot.paramMap.get('lookupId'), undefined);
        const lookupTypeInfo: WordConfigRequest = new WordConfigRequest();
        this.wordConfigValueListSearch.lookupId = this.lookupId;
        if (this.lookupId === 1) {
            this.tableCols.length = this.tableCols.length - 1;
        }
        this.getWordConfigValueList();
        this.tableCols = [
            { 'header': this.display.Code, 'field': 'lookupCode', 'width': '40%', 'isSort': true },
            { 'header': this.display.name, 'field': 'meaning', 'width': '52%', 'isSort': true },
            { 'header': this.display.Operation, 'cellTemplate': this.opationCell, 'field': 'do', 'width': '8%', 'isSort': false }
        ];
    }

    /**
     * 获取字典配置明细列表
     * zw 2017年11月18日14:26:45
     * @param pageNum pageSize lookupId
     * @memberof WordConfigValueComponent
     */
    getWordConfigValueList() {
        this.wordConfigValueService.getWordConfigValues(this.wordConfigValueListPage, this.wordConfigValueListSearch)
            .subscribe((res: WordConfigValueListResponse) => {
                if (res.code === 'SUCCESS') {
                    this.tableData = res.data.list;
                    this.totalRecords = res.data.total;
                    this.loading = false;
                }
            });
    }

    /**
     * 字典配置明细列表 分页
     * zw  2017年11月20日10:29:21
     * @param {any} data  当前的pageSize和pageNum
     * @memberof WordConfigValueComponent
     */
    tableGetPage(data) {
        this.wordConfigValueListPage.pageNum = data.page * 1 + 1;
        this.wordConfigValueListPage.pageSize = data.rows;
        this.getWordConfigValueList();
    }

    /**
     * 维护字典配置明细列表
     * zw 2017年11月18日14:30:28
     * @param mergeType 维护类型
     * @memberof WordConfigValueComponent
     */
    merge(mergeType: string) {
        if (!this.wordConfigValue.lookupCode || !this.wordConfigValue.meaning) {
            this.toastService.showError('ERROR', this.display.RequiredMessage);
        } else {
            if (mergeType === 'create') {
                for (const item of this.tableData) {
                    if (item.lookupCode === this.wordConfigValue.lookupCode) {
                        this.toastService.showError('ERROR', this.display.WordValueMessage);
                        return;
                    }
                }
            }
            this.mergeWordConfigValue(this.wordConfigValue, mergeType);
            this.wordConfigValue = new WordConfigValue();
            this.modalClose();
        }
    }

    /**
     * 维护字典配置列表
     * zw 2017年11月16日18:10:13
     * @param lookupType 编码
     * @param meaning 名称，描述
     * @param mergeType 维护类型 create,update
     * @param lookupId 字典配置id
     * @memberof WordConfigValueComponent
     */
    mergeWordConfigValue(param: WordConfigValue, mergeType: string) {
        const wordConfigValueRequest: WordConfigValueRequest = new WordConfigValueRequest();
        wordConfigValueRequest.lookupCode = param.lookupCode;
        wordConfigValueRequest.meaning = param.meaning;
        wordConfigValueRequest.lastUpdateDate = new Date();
        wordConfigValueRequest.lastUpdatedBy = this.ls.get('userId');
        wordConfigValueRequest.lookupId = this.lookupId;
        wordConfigValueRequest.enabledFlag = 'Y';
        wordConfigValueRequest.displaySeq = 1;
        if (mergeType === 'create') {
            wordConfigValueRequest.createdBy = this.ls.get('userId');
            wordConfigValueRequest.creationDate = new Date();
        }

        this.wordConfigValueService.mergeWordConfigValue(wordConfigValueRequest)
            .subscribe((res: WordConfigValueResponse) => {
                if (res.code === 'SUCCESS') {
                    this.toastService.showSuccess('SUCCESS', this.display.makeSuccess);
                    this.getWordConfigValueList();
                } else {
                    this.toastService.showSuccess('SUCCESS', this.display.makeError);
                }
            });
    }

    /**
     * 删除字典配置明细
     * zw 2017年11月17日11:21:27
     * @param param
     * @memberof WordConfigValueComponent
     */
    deleteWordConfigValue(param: WordConfigValue) {
        this.componentService.getZPStoken().subscribe((data) => {
            if (data.code === 'SUCCESS') {
                const wordConfigValueDeleteRequest: WordConfigValueDeleteRequest = new WordConfigValueDeleteRequest();
                wordConfigValueDeleteRequest.lookupCode = param.lookupCode;
                const urlParams = {
                    token: data.data
                };
                this.wordConfigValueService.deleteWordConfigValue(urlParams, wordConfigValueDeleteRequest)
                    .subscribe((res: WordConfigValueDeleteResponse) => {
                        if (res.code === 'SUCCESS') {
                            this.toastService.showSuccess('SUCCESS', this.display.makeSuccess);
                            this.getWordConfigValueList();
                        } else {
                            this.toastService.showError('ERROR', res.msg || this.display.makeError);
                        }
                    });
            }
        });

    }

    /**
     * 编辑字典配置列表
     * zw 2017年11月17日11:21:27
     * @param param
     * @memberof WordConfigComponent
     */
    editItem(e) {
        this.wordConfigValue.lookupCode = e.lookupCode;
        this.wordConfigValue.meaning = e.meaning;
        this.openModal();
        this.mergeType = 'update';
    }

    /**
     * 删除字典配置列表
     * zw 2017年11月17日11:21:27
     * @param param
     * @memberof WordConfigComponent
     */
    deleteItem(e) {
        this.confirmationService.confirm({
            message: this.display.DeleteMessage,
            accept: () => {
                this.wordConfigValue.lookupCode = e.lookupCode;
                this.deleteWordConfigValue(this.wordConfigValue);
            }
        });
    }

    /**
     * 打开Modal框
     * zw 2017年11月16日14:40:36
     * @param event
     * @memberof WordConfigComponent
     */
    openModal() {
        this.WordConfigValueModal.show();
        this.mergeType = 'create';
    }

    /**
     * 关闭Modal框
     * zengwei 2017年11月16日14:40:36
     * @param event
     * @memberof WordConfigComponent
     */
    modalClose() {
        this.WordConfigValueModal.hide();
        this.wordConfigValue = new WordConfigValue();
    }

    /**
     * 返回
     */
    goBack() {
        this.router.navigate(['/config/word']);
    }
}
