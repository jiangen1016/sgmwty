import { Component, ViewChild } from '@angular/core';
import { ApplyCreatService } from './applyCreat.service';
import { ModalDirective, BsModalService } from 'ngx-bootstrap/modal';
import { ApplyList, ApplyListResponse } from '../models/applyCreatModel';
import { LocalStorage } from '../../../core/component/localStorage/localStorage.component';
import { Message } from 'primeng/components/common/api';
import { AttachmentService, Attachment, GetAttachmentRequest } from '../../../core/service/attachment.service';
import { ComponentService, ValueListRequest, ValueListResponse } from '../../../core/component/component.service';
import { AppService } from '../../../../app.service';
import { MessageService } from 'primeng/components/common/messageservice';

@Component({
    selector: 'app-apply-creat',
    templateUrl: './applyCreat.component.html',
    providers: [MessageService]
})

export class ApplyCreatComponent {
    @ViewChild('replaceModal') replaceModal: ModalDirective;
    @ViewChild('expiredModal') expiredModal: ModalDirective;
    @ViewChild('promotionsModal') promotionsModal: ModalDirective;
    @ViewChild('qualityModal') qualityModal: ModalDirective;
    @ViewChild('returnModal') returnModal: ModalDirective;
    @ViewChild('normalModal') normalModal: ModalDirective;

    msgs: Message[] = [];
    private userInfo;
    applyList: Array<any> = [];
    // applyList: Array<any> = [
    //     { 'documentId': 1, 'documentUrl': '/Ttfroilch', 'documentCode': 'TT_FR_OIL_CH', 'documentName': '免费换油价格核算申请' },
    //     { 'documentId': 2, 'documentUrl': '/ttovclap', 'documentCode': 'TT_OV_CL_AP', 'documentName': '过期索赔申请' },
    //     { 'documentId': 3, 'documentUrl': '/ttbrcatesu', 'documentCode': 'TT_BR_CA_TE_SU', 'documentName': '促销活动系统支持申请' },
    //     { 'documentId': 4, 'documentUrl': '/ttqude', 'documentCode': 'TT_QU_DE', 'documentName': '质量销毁申请' },
    //     { 'documentId': 5, 'documentUrl': '/ttdeofrepa', 'documentCode': 'TT_DE_OF_RE_PA', 'documentName': '运回零件销毁' },
    //     { 'documentId': 6, 'documentUrl': '/ttothprc', 'documentCode': 'TT_OTH_PRC', 'documentName': '文档审批' }];
    pageType: String = 'create';

    getAttachmentRequest: GetAttachmentRequest = new GetAttachmentRequest();
    attachments: Array<Attachment> = [];
    valueListRequest: ValueListRequest = new ValueListRequest();
    brandList: Array<any> = [];
    modalConfig: any = this.appService.modalConfig;
    display: any = {};

    constructor(
        private applyCreatService: ApplyCreatService,
        private modalService: BsModalService,
        private ls: LocalStorage,
        private attachmentService: AttachmentService,
        private componentService: ComponentService,
        private appService: AppService,
        private messageService: MessageService
    ) {
        this.display = this.ls.getObject('display'); // 获取显示字段
        // TODO: 申请创建列表
        this.search();
        this.getLookupValueList();

    }

    /**
     * 打开modal
     * jiangen 2017年11月18日10:54:34
     * @param {any} item  创建哪一个
     * @memberof ApplyCreatComponent
     */
    openModal(item) {
        this.pageType = 'create';
        switch (item.documentCode) {
            // 免费换油
            case 'TT_FR_OIL_CH':
                this.replaceModal.show();
                break;
            // 过期索赔
            case 'TT_OV_CL_AP':
                this.expiredModal.show();
                break;
            case 'TT_BR_CA_TE_SU':
                this.promotionsModal.show();
                break;
            case 'TT_QU_DE':
                this.qualityModal.show();
                break;
            case 'TT_DE_OF_RE_PA':
                this.returnModal.show();
                break;
            case 'TT_OTH_PRC':
                this.normalModal.show();
                break;
        }
        // this.messageService.clear();
    }
    /**
     * 关闭打开的modal
     * jiangen 2018年3月20日09:52:35
     * @param {any} modalType  modal类型
     * @memberof ApplyCreatComponent
     */
    closeModal(modalType) {
        console.log(modalType);
        switch (modalType) {
            case 'replaceModal':
                this.replaceModal.hide();
                break;
            case 'expiredModal':
                this.expiredModal.hide();
                break;
            case 'promotionsModal':
                this.promotionsModal.hide();
                break;
            case 'qualityModal':
                this.qualityModal.hide();
                break;
            case 'returnModal':
                this.returnModal.hide();
                break;
            case 'normalModal':
                this.normalModal.hide();
                break;
        }
    }

    /**
     * 申请创建  - 创建成功
     * jiangen  2017年12月29日14:24:44
     * @param {any} data
     * @memberof ApplyCreatComponent
     */
    creatSuccess(data) {
        if (data) {
            this.messageService.add({ severity: 'success', summary: 'success', detail: this.display.makeSuccess });
        }
    }

    /**
     * 申请创建  - 查询
     * jiagnen 2017年12月29日14:21:02
     * @memberof ApplyCreatComponent
     */
    search() {
        this.applyCreatService.getCreatList().subscribe((data) => {
            this.applyList = data.data;
        });
    }

    /**
     * 获取对应单据的附件列表
     * zw 2017年11月28日18:43:40
     */
    getAttachmentInfo() {
        this.attachmentService.getAttachmentInfo(this.getAttachmentRequest)
            .subscribe((res) => {
                if (res.code === 'SUCCESS') {
                    this.attachments = res.data.list;
                }
            });
    }

    /**
     * 根据lookupType获取对应的值列表
     * zw  2017年11月29日15:20:04
     */
    getLookupValueList() {
        this.componentService.getBrandList().subscribe((res) => {
            this.brandList = res;
            console.log(res);
        });
    }

}
