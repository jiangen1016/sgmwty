import { Component, ViewChild, OnInit, TemplateRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { WordConfigService } from './wordConfig.service';
import {
    WordConfigListResponse, WordConfigRequest, WordConfigResponse,
    WordConfig, WordConfigDeleteRequest, WordConfigDeleteResponse,
    WordConfigListPage, WordConfigListSearch
} from '../models/wordConfigModel';
import { Router } from '@angular/router';
import { LocalStorage } from '../../../core/component/localStorage/localStorage.component';
import { ComponentService } from '../../../core/component/component.service';
import { AppService } from '../../../../app.service';
import { MessageService } from 'primeng/components/common/messageservice';
import { ConfirmationService } from 'primeng/primeng';
import { ToastService } from '../../../core/service/toast.service';

@Component({
    selector: 'app-word-congif',
    templateUrl: './wordConfig.component.html',
    providers: [MessageService, ConfirmationService]
})

export class WordConfigComponent implements OnInit {
    @ViewChild('nameCell') nameCell: TemplateRef<any>;
    @ViewChild('opationCell') opationCell: TemplateRef<any>;
    @ViewChild('WordConfigModal') WordConfigModal: ModalDirective;

    wordConfigListSearch: WordConfigListSearch = new WordConfigListSearch();
    private wordConfigListPage: WordConfigListPage = new WordConfigListPage();
    loading: Boolean = true;

    tableConfig = {
        isNumber: true,
        isSelect: false
    };

    tableCols = [];

    tableData: Array<any> = [];
    totalRecords: Number = 0;

    wordConfig: WordConfig = new WordConfig();
    mergeType: string;
    display: any = {};
    modalConfig: any = this.appService.modalConfig;

    constructor(
        private wordConfigService: WordConfigService,
        private router: Router,
        private ls: LocalStorage,
        private componentService: ComponentService,
        private appService: AppService,
        private messageService: MessageService,
        private toastService: ToastService,
        private confirmationService: ConfirmationService
    ) {
        this.display = this.ls.getObject('display'); // 获取显示字段

        this.messageService.clear();
    }

    ngOnInit() {
        this.wordConfigListPage.pageNum = 1;
        this.wordConfigListPage.pageSize = 10;
        this.getWordConfigList();
        this.tableCols = [
            { 'header': this.display.Code, 'field': 'lookupType', 'width': '30%', 'isSort': true },
            { 'header': this.display.name, 'cellTemplate': this.nameCell, 'field': 'meaning', 'width': '31%', 'isSort': true },
            { 'header': this.display.Description, 'field': 'meaning', 'width': '31%', 'isSort': true },
            { 'header': this.display.Operation, 'cellTemplate': this.opationCell, 'field': 'do', 'width': '8%', 'isSort': false }
        ];
    }

    /**
     * 获取字典配置列表
     * zw 2017年11月16日16:28:00
     * @param pageNum pageSize
     * @memberof WordConfigComponent
     */
    getWordConfigList() {
        // this.wordConfigListPage.pageNum = 1;
        this.wordConfigService.getWordConfigs(this.wordConfigListPage, this.wordConfigListSearch)
            .subscribe((res: WordConfigListResponse) => {
                if (res.code === 'SUCCESS') {
                    this.tableData = res.data.list;
                    this.totalRecords = res.data.total;
                    this.loading = false;
                }
            });
    }

    /**
     * 字典配置列表 分页
     * zw  2017年11月18日16:22:14
     * @param {any} data  当前的pageSize和pageNum
     * @memberof WordConfigComponent
     */
    tableGetPage(data) {
        this.wordConfigListPage.pageNum = data.page * 1 + 1;
        this.wordConfigListPage.pageSize = data.rows;
        this.getWordConfigList();
    }

    /**
     * 维护字典配置列表
     * zw 2017年11月16日18:44:57
     * @param mergeType 维护类型
     * @memberof WordConfigComponent
     */
    merge(mergeType: string) {
        if (!this.wordConfig.lookupType || !this.wordConfig.meaning) {
            this.messageService.add({ severity: 'info', summary: 'info', detail: this.display.RequiredMessage });
        } else {
            if (mergeType === 'create') {
                for (const item of this.tableData) {
                    if (item.lookupType === this.wordConfig.lookupType) {
                        this.messageService.add({ severity: 'info', summary: 'info', detail: this.display.WordConfigMessage });
                        return;
                    }
                }
            }
            this.mergeWordConfig(this.wordConfig, mergeType);
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
     * @memberof WordConfigComponent
     */
    mergeWordConfig(param: WordConfig, mergeType: string) {
        const wordConfigRequest: WordConfigRequest = new WordConfigRequest();
        wordConfigRequest.lookupType = param.lookupType;
        wordConfigRequest.meaning = param.meaning;
        wordConfigRequest.lastUpdateDate = new Date();
        wordConfigRequest.lastUpdatedBy = parseInt(this.ls.get('userId'), undefined);
        wordConfigRequest.enabledFlag = 'Y';
        if (mergeType === 'create') {
            wordConfigRequest.createdBy = parseInt(this.ls.get('userId'), undefined);
            wordConfigRequest.creationDate = new Date();
        } else {
            wordConfigRequest.lookupId = this.wordConfig.lookupId;
        }

        this.wordConfigService.mergeWordConfig(wordConfigRequest)
            .subscribe((res: WordConfigResponse) => {
                if (res.code === 'SUCCESS') {
                    this.toastService.showSuccess('SUCCESS', this.display.makeSuccess);
                    this.getWordConfigList();
                } else {
                    this.toastService.showError('ERROR', res.msg || this.display.makeError);
                }
            });
    }

    /**
     * 删除字典配置
     * zw 2017年11月17日11:21:27
     * @param param
     * @memberof WordConfigComponent
     */
    deleteWordConfig(param: WordConfig) {
        this.componentService.getZPStoken().subscribe((data) => {
            if (data.code === 'SUCCESS') {
                const wordConfigDeleteRequest: WordConfigDeleteRequest = new WordConfigDeleteRequest();
                wordConfigDeleteRequest.lookupId = param.lookupId;
                const urlParams = {
                    token: data.data
                };
                this.wordConfigService.deleteWordConfigs(urlParams, wordConfigDeleteRequest)
                    .subscribe((res: WordConfigDeleteResponse) => {
                        if (res.code === 'SUCCESS') {
                            this.toastService.showSuccess('SUCCESS', this.display.makeSuccess);
                            this.getWordConfigList();
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
        this.wordConfig.lookupId = e.lookupId;
        this.wordConfig.lookupType = e.lookupType;
        this.wordConfig.meaning = e.meaning;
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
                this.wordConfig.lookupId = e.lookupId;
                this.deleteWordConfig(this.wordConfig);
            }
        });
    }

    /**
     * 字典配置  - 查看详情
     * jiangen  2017年12月29日15:02:06
     * @param {any} e
     * @memberof WordConfigComponent
     */
    goDetail(e) {
        this.router.navigate(['config/word/wordValues', { 'lookupId': e.lookupId }]);
    }

    /**
     * 打开Modal框
     * zw 2017年11月16日14:40:36
     * @param event
     * @memberof WordConfigComponent
     */
    openModal() {
        this.WordConfigModal.show();
        this.mergeType = 'create';
    }

    /**
     * 关闭Modal框
     * zengwei 2017年11月16日14:40:36
     * @param event
     * @memberof WordConfigComponent
     */
    modalClose() {
        this.WordConfigModal.hide();
        this.wordConfig = new WordConfig();
    }

}
