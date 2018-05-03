import { Component } from '@angular/core';
import { EntrustModule } from '../entrust.component.module';
import { LocalStorage } from '../../../../core/component/localStorage/localStorage.component';
import { Message } from 'primeng/components/common/api';
import { EntrustCreat } from '../../models/entrustModel';
import { AppService } from '../../../../../app.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ComponentService } from '../../../../core/component/component.service';
import { EntrustNewService } from './entrustNew.component.service';
import { MessageService } from 'primeng/components/common/messageservice';

@Component({
    selector: 'app-entrust-new',
    templateUrl: './entrustNew.component.html',
    providers: [MessageService]
})

export class EntrustNewComponent {
    display: any = {};
    checkMsgs: Message[] = [];
    disabled: Boolean = false;
    tableType: string; // 弹窗表格类型
    selectionMode: string; // 表格选择方式
    tableCols: any = {}; // 表格头
    tableData: any = []; // 表格数据
    userInfo: any = {}; // 用户信息
    showChoose: Boolean = false;
    isManager: Boolean = false; // 是否是管理员
    pageType: string; // 页面类型
    entrustId: string; // ID
    isCanChange: Boolean = false; // 是否能修改
    isReadOnly: Boolean = false; // 是否是查看
    entrustCreat: EntrustCreat = new EntrustCreat();
    constructor(
        private activatedRoute: ActivatedRoute,
        private ls: LocalStorage,
        private router: Router,
        private appService: AppService,
        private entrustNewService: EntrustNewService,
        private componentService: ComponentService,
        private messageService: MessageService
    ) {
        this.display = this.ls.getObject('display');
        this.pageType = this.activatedRoute.snapshot.paramMap.get('type');
        this.entrustId = this.activatedRoute.snapshot.paramMap.get('id');
        this.userInfo = this.appService.getUserInfo();
        this.checkMsgs = [];

        if (!this.pageType) {
            this.pageType = 'creat';
        }
        if (this.pageType === 'creat') {
            this.entrustCreat = new EntrustCreat();
        } else {
            this.detailsChange(this.entrustId);
        }
        if (this.userInfo.roles.indexOf('ITManager') !== -1 || this.userInfo.roles.indexOf('BusinessManager') !== -1) {
            this.isManager = true;
        } else {
            this.entrustCreat.grantorUid = this.userInfo.userId;
            this.entrustCreat.grantorName = this.userInfo.userName;
            this.disabled = true;
        }
    }

    /**
     * 外出授权  授权详情 返回
     * jiangen  2017年12月21日13:28:27
     * @memberof EntrustNewComponent
     */
    goBack() {
        this.router.navigate(['work/entrust']);
    }

    /**
     * 外出授权 - 新建 保存
     * jiangen  2017年12月21日15:52:26
     * @memberof EntrustNewComponent
     */
    enturstSave() {
        this.checkStatus();
        if (!this.checkMsgs.length) {
            this.entrustCreat = this.appService.setDate(this.entrustCreat, ['startDate', 'endDate']);
            this.entrustCreat.startDate = this.entrustCreat.startDate.split(' ')[0] += ' 00:00:01';
            this.entrustCreat.endDate = this.entrustCreat.endDate.split(' ')[0] += ' 23:59:59';
            this.componentService.getZPStoken().subscribe((data) => {
                if (data.code === 'SUCCESS') {
                    const urlParams = {
                        token: data.data
                    };
                    this.entrustCreat.creatorUid = this.ls.get('userId');
                    if (this.pageType === 'detail') {
                        this.entrustNewService.updateEntrust(urlParams, this.entrustCreat).subscribe((res) => {
                            if (res.code === 'SUCCESS') {
                                this.router.navigate(['work/entrust']);
                            } else {
                                this.checkMsgs.push({ severity: 'error', summary: res.msg });
                                // this.messageService.add({ severity: 'error', summary: 'error', detail: data.msg });
                            }
                        });
                    } else {
                        this.entrustNewService.saveEmpowerment(urlParams, this.entrustCreat).subscribe((res) => {
                            if (data.code === 'SUCCESS') {
                                this.router.navigate(['work/entrust']);
                            } else {
                                this.checkMsgs.push({ severity: 'error', summary: res.msg });
                                // this.messageService.add({ severity: 'error', summary: 'error', detail: data.msg });
                            }
                        });
                    }
                }
            });
        }
    }

    /**
     * 查询
     * jiangen  2017年12月21日16:05:59
     * @param {any} tableType
     * @param {any} selectionMode
     * @memberof EntrustNewComponent
     */
    showChooseDialog(tableType, selectionMode) {
        this.tableType = tableType;
        this.selectionMode = selectionMode;
        this.tableCols = this.componentService.getTableCols(this.tableType !== 'process' ? 'transferPerson' : this.tableType);
        if (this.tableType === 'process') {
            if (!this.entrustCreat.grantorUid) {
                this.checkMsgs.push({ severity: 'error', summary: this.display.plesaseChoosePerson });
                // this.messageService.add({ severity: 'error', summary: 'error', detail: this.display.plesaseChoosePerson });
                // this.checkMsgs.push({ severity: 'error', summary: '请先选择授权人' });
            } else {
                this.getChooseList();
                this.showChoose = true;
            }
        } else {
            this.getChooseList();
            this.showChoose = true;
        }
    }

    /**
     * 关闭选择
     * zw 2017年11月17日15:33:32
     * @param data
     */
    closeChoose(data) {
        if (data) {
            this.showChoose = false;
            this.tableData = [];
        }
    }

    /**
     * 选择获取
     * jiangen 2017年12月21日16:11:28
     * @param {any} data
     * @memberof EntrustNewComponent
     */
    getChoose(data) {
        if (data) {
            switch (this.tableType) {
                case 'grantorPerson':
                    this.entrustCreat.grantorName = '';
                    this.entrustCreat.grantorUid = '';
                    if (data.userUid === this.entrustCreat.surrogateUid) {
                        this.entrustCreat.grantorName = '';
                        this.entrustCreat.grantorUid = '';
                        // alert("不能为同一人");
                        // this.messageService.add({ severity: 'error', summary: 'error', detail: this.display.personSame });
                        this.checkMsgs.push({ severity: 'error', summary: this.display.personSame });

                    } else {
                        this.entrustCreat.grantorName = data.displayname;
                        this.entrustCreat.grantorUid = data.userUid;
                        this.entrustCreat.applicationFlowDisplayname = '';
                    }
                    break;
                case 'surrogatePerson':
                    this.entrustCreat.surrogateName = '';
                    this.entrustCreat.surrogateUid = '';
                    if (data.userUid === this.entrustCreat.grantorUid) {
                        this.entrustCreat.surrogateName = '';
                        this.entrustCreat.surrogateUid = '';
                        // alert("不能为同一人");
                        // this.messageService.add({ severity: 'error', summary: 'error', detail: this.display.personSame });
                        this.checkMsgs.push({ severity: 'error', summary: this.display.personSame });

                    } else {
                        this.entrustCreat.surrogateName = data.displayname;
                        this.entrustCreat.surrogateUid = data.userUid;
                    }
                    break;
                case 'process':
                    this.entrustCreat.applicationFlow = '';
                    this.entrustCreat.applicationFlowDisplayname = '';
                    for (const item of data) {
                        this.entrustCreat.applicationFlow += (item.documentCode + ',');
                        this.entrustCreat.applicationFlowDisplayname += (item.documentName + ',');
                    }
                    this.entrustCreat.applicationFlow = this.entrustCreat.applicationFlow.
                        substring(0, this.entrustCreat.applicationFlow.lastIndexOf(','));
                    this.entrustCreat.applicationFlowDisplayname = this.entrustCreat.applicationFlowDisplayname.
                        substring(0, this.entrustCreat.applicationFlowDisplayname.lastIndexOf(','));
                    break;
            }
            this.showChoose = false;
        }
    }

    /**
     * 获取选择数据
     * jiangen  2017年12月21日16:23:29
     * @memberof EntrustNewComponent
     */
    getChooseList() {
        if (this.tableType === 'grantorPerson' || this.tableType === 'surrogatePerson') {
            this.entrustNewService.getRoleMenberList().subscribe((data) => {
                if (data.code === 'SUCCESS') {
                    this.tableData = data.data;
                }
            });
        }
        // if (this.tableType == 'process') {
        //     let params = {
        //         userUid: this.entrustCreat.grantorUid
        //     }
        //     this.entrustNewService.getProcess(params).subscribe((data) => {
        //         if (data.code == 'SUCCESS') {
        //             this.tableData = data.data;
        //         }
        //     })
        // }
    }

    /**
     * 外出授权 - 查看修改
     * jiagnen jiangen
     * @memberof EntrustNewComponent
     */
    detailsChange(id) {
        const params = {
            id: id
        };
        this.entrustNewService.getDetails(params).subscribe((data) => {
            if (data.code === 'SUCCESS') {
                const user = this.ls.get('userId');
                this.entrustCreat = data.data;
                if (this.isManager || user === data.data.grantorUid || user === data.data.creatorUid) {
                    this.isCanChange = true;
                } else {
                    this.pageType = 'details';
                    this.isReadOnly = true;
                }
            }
        });
    }

    /**
     * 检查状态
     * jiangen  2017年12月21日15:40:17
     * @memberof EntrustNewComponent
     */
    checkStatus() {
        this.checkMsgs = [];
        if (!this.entrustCreat.endDate) {
            this.checkMsgs.push({ severity: 'error', summary: this.display.endTimeRequired });
        }
        if (!this.entrustCreat.startDate) {
            this.checkMsgs.push({ severity: 'error', summary: this.display.StartDateRequired });
        }
        if (!this.entrustCreat.grantorUid) {
            this.checkMsgs.push({ severity: 'error', summary: this.display.AuthorizerRequired });
        }
        if (!this.entrustCreat.surrogateUid) {
            this.checkMsgs.push({ severity: 'error', summary: this.display.AuthorizedPersonRequired });
        }
        // if (!this.entrustCreat.applicationFlow) {
        //     this.checkMsgs.push({ severity: 'error', summary: this.display.ProcessRequired });
        // }
        if (this.entrustCreat.endDate && this.entrustCreat.startDate) {
            let getEndDate = null;
            let getStartDate = null;
            typeof this.entrustCreat.endDate === 'string' ? getEndDate =
                this.getDate(this.entrustCreat.endDate) : getEndDate = this.entrustCreat.endDate;

            typeof this.entrustCreat.startDate === 'string' ? getStartDate =
                this.getDate(this.entrustCreat.startDate) : getStartDate = this.entrustCreat.startDate;

            if (getEndDate < getStartDate) {
                this.checkMsgs.push({ severity: 'error', summary: this.display.dateCheck });
            }
        }
    }

    /**
     * 清除输入
     * jiagnen   2017年12月25日13:39:4
     * @memberof KdAsPtContracModalComponet
     */
    clear(type) {
        switch (type) {
            case 'surrogateName':
                this.entrustCreat.surrogateUid = '';
                this.entrustCreat.surrogateName = '';
                break;
            case 'grantorName':
                this.entrustCreat.grantorName = '';
                this.entrustCreat.grantorUid = '';
                break;
        }
    }

    /**
     * 外出授权  - 将字符串时间转换为时间戳
     * jiangen  2018年1月2日14:10:11
     * @param {any} dateString
     * @returns   时间
     * @memberof EntrustNewComponent
     */
    getDate(dateData) {
        if (dateData && dateData.length) {
            const dateString = dateData.split(' ')[0];
            const year = dateString.split('-')[0];
            const month = dateString.split('-')[1];
            const day = dateString.split('-')[2];
            const date = new Date(year, month - 1, day);
            return date;
        }
    }
}
