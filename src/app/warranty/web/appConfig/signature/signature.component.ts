import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { LocalStorage } from '../../../core/component/localStorage/localStorage.component';
import { MessageService } from 'primeng/components/common/messageservice';
import { ConfirmationService } from 'primeng/primeng';
import { SignatureSearch, SignatureSearchRoleList, SignaturePage } from '../models/signatureModel';
import { Router } from '@angular/router';
import { SignatureService } from './signature.service';
import { ComponentService } from '../../../core/component/component.service';
import { ToastService } from '../../../core/service/toast.service';

@Component({
    selector: 'app-signture-config',
    templateUrl: './signature.component.html',
    providers: [MessageService, ConfirmationService]
})

export class SignatureComponent implements OnInit {
    @ViewChild('opationCell') opationCell: TemplateRef<any>;

    display: any = {};
    signatureSearch: SignatureSearch = new SignatureSearch();
    signatureSearchRoleList: SignatureSearchRoleList = new SignatureSearchRoleList();
    signaturePage: SignaturePage = new SignaturePage();
    tableCols: any = [];
    tableData: any = [];
    totalRecords: Number = 0;
    loading: Boolean = false;
    displayRoleList: Array<any> = [];
    constructor(
        private ls: LocalStorage,
        private router: Router,
        private signatureService: SignatureService,
        private confirmationService: ConfirmationService,
        private componentService: ComponentService,
        private messageService: MessageService,
        private toastService: ToastService
    ) {
        this.display = this.ls.getObject('display');
        this.getLookupList();
        this.signaturePage.pageNum = 1;
        this.signaturePage.pageSize = 10;
        this.search();
    }

    ngOnInit(): void {
        this.tableCols = [
            { 'header': this.display.Role, 'field': 'roleName', 'width': '30%', 'isSort': true },
            { 'header': this.display.Member, 'field': 'userName', 'width': '31%', 'isSort': true },
            { 'header': this.display.annex, 'field': 'attachmentName', 'width': '31%', 'isSort': true },
            { 'header': this.display.Operation, 'cellTemplate': this.opationCell, 'field': 'do', 'width': '8%', 'isSort': false }
        ];
    }

    /**
     * 签名配置  - 新建
     * jiangen  2018年1月10日15:56:39
     * @memberof SignatureComponent
     */
    signatureNew() {
        this.router.navigate(['config/signature/signature-new', { type: 'create' }]);
    }

    /**
     * 签名配置 - 清除搜索条件
     * jiangen   2018年1月16日10:45:07
     * @memberof SignatureComponent
     */
    clearSearch() {
        this.signatureSearch.roleName = '';
        this.signatureSearch.userName = '';
    }

    /**
     * 签名配置 - 分页参数
     * jiagnen 2018年1月16日10:44:44
     * @param {any} data 分页组件参数
     * @memberof SignatureComponent
     */
    tableGetPage(data) {
        this.signaturePage.pageNum = data.page * 1 + 1;
        this.signaturePage.pageSize = data.rows;
        this.search(true);
    }

    /**
     * 签名配置 - 查询
     * jiangen   2018年1月16日10:43:51
     * @param {any} [boolean] 如果是true 那就是分页的搜索  如果是false  那就是查询的搜索
     * @memberof SignatureComponent
     */
    search(boolean?) {
        if (!boolean) {
            this.signaturePage.pageNum = 1;
        }
        this.signatureService.search(this.signaturePage, this.signatureSearch).subscribe((data) => {
            this.tableData = data.data.list;
            this.totalRecords = data.data.total;
        });
    }

    /**
     * 签名配置 - 删除
     * jiangen  2018年1月16日13:49:24
     * @memberof SignatureComponent
     */
    deleteItem(e) {
        this.confirmationService.confirm({
            message: this.display.DeleteMessage,
            accept: () => {
                this.deleteSignature(e);
            }
        });
    }

    /**
     * 签名配置 - 查看
     * jiangen   2018年1月16日14:23:33
     * @param {any} e
     * @memberof SignatureComponent
     */
    editItem(data) {
        if (data) {
            this.router.navigate(['config/signature/signature-new', { type: 'detail', id: data.signatureId }]);
        }
    }

    /**
     * 签名配置 - 删除
     * jiangen  2018年1月16日14:22:01
     * @param {any} e
     * @memberof SignatureComponent
     */
    deleteSignature(e) {
        console.log(e);
        this.componentService.getZPStoken().subscribe((data) => {
            if (data.code === 'SUCCESS') {
                const params = {
                    signatureId: e.signatureId
                };
                const urlParams = {
                    token: data.data
                };
                this.signatureService.deleteSignature(urlParams, params).subscribe((res) => {
                    if (res.code === 'SUCCESS') {
                        this.toastService.showSuccess('SUCCESS', this.display.makeSuccess);
                        this.search();
                    } else {
                        this.toastService.showError('ERROR', res.msg || this.display.makeError);
                    }
                });
            }
        });
    }
    /**
     * 签名配置 - lookup表
     * jiangen  2018年1月16日10:45:57
     * @memberof SignatureComponent
     */
    getLookupList() {
        const urlParams = {
            pageNum: 1,
            pageSize: 1000
        };
        this.signatureService.getRoleList(urlParams).subscribe((data) => {
            if (data.code === 'SUCCESS') {
                this.displayRoleList = data.data.list;
                console.log(this.displayRoleList);
            }
        });
    }
}
