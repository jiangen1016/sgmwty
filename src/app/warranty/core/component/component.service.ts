import { Injectable } from '@angular/core';
import { Http, RequestOptionsArgs, RequestOptions, Response, Headers } from '@angular/http';
import { DfHTTP } from '../../../app.network.service';
import { NetworkConfig, AppService } from '../../../app.service';
import { LocalStorage } from './localStorage/localStorage.component';
import { AttachmentService } from '../service/attachment.service';
import { ToastService } from '../service/toast.service';

export class ValueListRequest {
    lookupType: string;
}

export class MemberListRequest {
    roleCode: string;
}

export class MemberListByCode {
    documentCode: string;
}

export class ValueListResponse {
    code: string;
    msg: string;
    data: any;
}

@Injectable()
export class ComponentService {

    display: any = {};
    userInfo: any = {};
    attachments: Array<any> = [];
    detailData: any = {};

    constructor(
        private dfHTTP: DfHTTP,
        private ls: LocalStorage,
        private http: Http,
        private attachmentService: AttachmentService,
        private appService: AppService,
        private toastService: ToastService
    ) {
        this.display = this.ls.getObject('display');
        this.userInfo = this.appService.getUserInfo();
    }

    /**
     * 选择查询
     * zw  2017年11月22日10:04:18
     * @param {any} params  查询类型
     * @returns     值列表
     * @memberof ComponentService
     */
    getLookupValueList(params) {
        return this.dfHTTP.post(NetworkConfig.path.getLookupValue, params).map((res) => {
            return res;
        }, (error) => {
            return error;
        });
    }

    // /**
    //  * 人员选择查询
    //  * zw  2017年11月22日10:04:18
    //  * @param {any} params  查询类型
    //  * @returns     值列表
    //  * @memberof ComponentService
    //  */
    // getRoleMemberList(urlParams, params) {
    //     return this.dfHTTP.pagePost(NetworkConfig.paths.getRoleMemberListByRoleCode, urlParams, params).map((res) => {
    //         return res;
    //     }, (error) => {
    //         return error;
    //     });
    // }

    /**
     * 根据tableType获取表格列名称
     * zw 2017年11月22日13:59:09
     * @param tableType 表格类型
     * @memberof ComponentService
     */
    getTableCols(tableType) {
        let tableCols = [];
        switch (tableType) {
            case 'customer':
                tableCols = [
                    { 'field': 'claimCode', 'header': '经销商ASC代码', 'width': '20%' },
                    { 'field': 'customerName', 'header': '经销商简称', 'width': '50%' },
                    { 'field': 'customerCode', 'header': '索赔代码', 'width': '30%' }
                ];
                break;
            case 'TradeTerm':
                tableCols = [
                    { 'field': 'lookupCode', 'header': this.display.TradeTerm, 'width': '50%' },
                    { 'field': 'meaning', 'header': this.display.TradeTerm, 'width': '50%' }
                ];
                break;
            case 'project':
                tableCols = [
                    { 'field': 'lookupCode', 'header': this.display.ProjectNum, 'width': '50%' },
                    { 'field': 'meaning', 'header': this.display.ProjectName, 'width': '50%' }
                ];
                break;
            case 'Manufacturing':
                tableCols = [
                    { 'field': 'lookupCode', 'header': this.display.ManufacturingStageNum, 'width': '50%' },
                    { 'field': 'meaning', 'header': this.display.ManufacturingStageName, 'width': '50%' }
                ];
                break;
            case 'ITOManager':
                tableCols = [
                    { 'field': 'userUid', 'header': this.display.ITOManagerNum, 'width': '50%' },
                    { 'field': 'userName', 'header': this.display.ITOManagerName, 'width': '50%' }
                ];
                break;
            case 'FDCoordinator':
                tableCols = [
                    { 'field': 'userUid', 'header': this.display.FDCoordinatorNum, 'width': '50%' },
                    { 'field': 'userName', 'header': this.display.FDCoordinatorName, 'width': '50%' }
                ];
                break;
            case 'FDSenicrManager':
                tableCols = [
                    { 'field': 'userUid', 'header': this.display.FDSeniorManagerNum, 'width': '50%' },
                    { 'field': 'userName', 'header': this.display.FDSeniorManagerName, 'width': '50%' }
                ];
                break;
            case 'PPOCoordinator':
                tableCols = [
                    { 'field': 'userUid', 'header': this.display.PPOCoordinatorNum, 'width': '50%' },
                    { 'field': 'userName', 'header': this.display.PPOCoordinatorName, 'width': '50%' }
                ];
                break;
            case 'PPOSenicrManager':
                tableCols = [
                    { 'field': 'userUid', 'header': this.display.PPOSeniorManagerNum, 'width': '50%' },
                    { 'field': 'userName', 'header': this.display.PPOSeniorManagerName, 'width': '50%' }
                ];
                break;
            case 'VLEApprovers':
                tableCols = [
                    { 'field': 'userUid', 'header': this.display.VLENum, 'width': '50%' },
                    { 'field': 'userName', 'header': this.display.VLEName, 'width': '50%' }
                ];
                break;
            case 'transferPerson':
                tableCols = [
                    { 'field': 'userUid', 'header': this.display.UserId, 'width': '50%' },
                    { 'field': 'userName', 'header': this.display.Name, 'width': '50%' }
                ];
                break;
            case 'ProcessList':
                tableCols = [
                    { 'field': 'activityName', 'header': this.display.ProcessNodeName, 'width': '100%' }
                ];
                break;
            case 'process':
                tableCols = [
                    { 'field': 'documentCode', 'header': this.display.processCode, 'width': '50%' },
                    { 'field': 'documentName', 'header': this.display.processName, 'width': '50%' }
                ];
                break;
            case 'role':
                tableCols = [
                    { 'field': 'roleCode', 'header': this.display.RoleCode, 'width': '50%' },
                    { 'field': 'roleName', 'header': this.display.RoleName, 'width': '50%' }
                ];
                break;
        }
        return tableCols;
    }

    /**
    * 审批操作
    * jiangen 2017年11月27日16:19:07
    * @param {any} params  审批的参数
    * @memberof KdAspTContracService
    */
    approve(params) {
        return this.dfHTTP.post(NetworkConfig.path.doApprove, params).map((data) => {
            return data;
        }, (error) => {
            return error;
        });
    }

    // 根据编码查询人
    getRoleMemberList(Params) {
        return this.dfHTTP.post(NetworkConfig.path.getMemberList, Params).map((data) => {
            return data;
        }, (error) => {
            return error;
        });
    }

    /**
     * 审批前拿token
     * jiangen  2017年12月9日18:48:16
     * @param {any} params
     * @returns
     * @memberof KdQuotationService
     */
    getToken(params) {
        return this.dfHTTP.post(NetworkConfig.path.getApproveToken, params).map((data) => {
            return data;
        }, (error) => {
            return error;
        });
    }

    /**
     * 获取加密的token
     * jiangen   2017年12月13日19:42:26
     * @returns
     * @memberof ComponentService
     */
    getZPStoken() {
        return this.dfHTTP.get(NetworkConfig.path.getZpsToken).map((data) => {
            return data;
        }, (error) => {
            return error;
        });
    }

    /**
     * 获取创建列表
     * jiangen 2017年11月26日14:57:34
     * @param {any} params  languageCode
     * @returns  Array
     * @memberof ApplyCreatService
     */
    getApplyCreatData(params) {
        return this.dfHTTP.get(NetworkConfig.path.getCreateList, params).map((data) => {
            return data;
        }, (error) => {
            return error;
        });
    }

    /**
     * 添加附件   2018年04月23日15:06:28 by 姜
     * @param {any} number
     * @param {any} saveAddFiles
     * @memberof ComponentService
     */
    addAttachment(number, saveAddFiles) {
        for (const item of saveAddFiles) {
            item.sourceId = number;
        }
        this.attachmentService.addAttachmentInfo(saveAddFiles)
            .subscribe((res) => {
                if (res.code === 'SUCCESS') {
                    console.log('addAttachmentInfo success');
                    return true;
                }
            });
    }

    /**
     * 删除附件  2018年04月23日15:06:50
     * jiangen
     * @param {any} saveDeleteFilesStr
     * @memberof ComponentService
     */
    deleteAttachment(saveDeleteFilesStr) {
        if (saveDeleteFilesStr) {
            const params = {
                attachmentIds: saveDeleteFilesStr
            };
            this.attachmentService.deleteFile(params).subscribe((data) => {
                console.log('files delete success');
            });
        }
    }

    /**
     * 获取品牌
     * jiangen  2018年04月23日15:07:43
     * @returns
     * @memberof ComponentService
     */
    getBrandList() {
        return this.dfHTTP.get(NetworkConfig.path.getBrandList).map((res: any) => {
            return res;
        }, (error) => {
            return error;
        });
    }

    /**
     * 获取供应商
     * jiangen  2018年04月23日15:07:55
     * @returns
     * @memberof ComponentService
     */
    getCumList() {
        return this.dfHTTP.get(NetworkConfig.path.getCumList).map((res: any) => {
            return res;
        }, (error) => {
            return error;
        });
    }

    /**
     * 历史记录
     * jiangen  2017年11月28日20:08:47
     * @param {any} type   submit  为提交  approve 为审批
     * @param {any} data
     * @memberof KdAsPtContracModalComponet
     */
    setPublicHistory(type, data, taskData, approveData) {
        let historyParams = {};
        // 第一次提交
        if (type === 'submit') {
            historyParams = {
                approverId: this.ls.get('userId'),
                sourceId: data.documentNumber,
                approvalComment: '',
                nodeName: '',
                createdBy: data.createdBy,
                approvalActive: 'Submit'
            };
            this.getNodeNmaeByType(historyParams, data);
        }
        // 报废
        if (type === 'delete') {
            historyParams = {
                approverId: this.ls.get('userId'),
                sourceId: taskData.documentNumber,
                nodeName: '',
                createdBy: taskData.createdBy,
                approvalActive: 'Deny'
            };
            this.getNodeNmaeByType(historyParams, data);
        }
        // 审批
        if (type === 'approve') {
            historyParams = {
                approverId: this.ls.get('userId'),
                sourceId: taskData.documentNumber,
                sourceType: taskData.receiptType,
                approvalComment: approveData.approvalComment,
                nodeName: taskData.nodeName,
                createdBy: taskData.createdBy,
                approvalActive: this.appService.getApprovalActive(approveData.selectedValue)
            };
            if (taskData.canDeny && !taskData.isIto) {
                if (approveData.selectedValue === 'APPROVE') {
                    historyParams['approvalActive'] = 'Submit';
                }
            }
        }
        // 退回
        if (type === 'return') {
            historyParams = {
                approverId: this.ls.get('userId'),
                sourceId: taskData.documentNumber,
                approvalComment: approveData.approvalComment,
                nodeName: taskData.nodeName,
                createdBy: taskData.createdBy,
                approvalActive: 'Submit'
            };
        }
        if (taskData.assignee && taskData.assignee !== this.userInfo.userId) {
            const proxyString = this.userInfo.userName + '  代  ' + taskData.assigneeName + '  ' + historyParams['approvalActive'];
            historyParams['approvalActive'] = proxyString;
        }
        this.setHistory(historyParams).subscribe((res) => {
            if (data && data.code === 'SUCCESS') {
                console.log('history');
                // this.modalClose();
            }
        });
    }

    /**
     * 根据 documentType  生成 nodename
     *
     * @param {any} data
     * @memberof ComponentService
     */
    getNodeNmaeByType(params, data) {
        switch (data.documentType) {
            //  回运零件
            case 'TT_FR_OIL_CH':
                params['nodeName'] = 'Warranty  Staff  Submit';
                break;
            // /免费
            case 'TT_DE_OF_RE_PA':
                params['nodeName'] = 'Warranty  Staff  Submit';
                break;
            // 过期索赔
            case 'TT_OV_CL_AP':
                params['nodeName'] = 'FMC Submit';
                break;
            //  促销活动
            case 'TT_BR_CA_TE_SU':
                params['nodeName'] = 'Activity Applicant Submit';
                break;
            //   质量销毁
            case 'TT_QU_DE':
                params['nodeName'] = 'QD Staff  Submit';
                break;
            // 文档审批
            case 'TT_OTH_PRC':
                params['nodeName'] = 'QD/TAC Sponsor Submit';
                break;
        }
    }

    /**
     * 审批记录   请求
     * jiagnen 2017年11月28日16:45:46
     * @param {any} params 单据id  单据类型
     * @returns
     * @memberof KdQuotationService
     */
    setHistory(params) {
        return this.dfHTTP.post(NetworkConfig.path.addHistory, params).map((data) => {
            return data;
        }, (error) => {
            return error;
        });
    }

    /**
    * 获取单据详情
    * jiangen  2017年11月25日13:07:48
    * @returns
    * @memberof ApproveListService
    */
    getApproveInfo(params) {
        return this.dfHTTP.get(NetworkConfig.path.getInfoBytypeAndDocumentNum, params).map((res: any) => {
            return res;
        }, (error) => {
            return error;
        });
    }

    /**
     * 获取审批历史
     * jiangen  2017年11月28日16:49:35
     * @param {any} params
     * @returns
     * @memberof ApproveListService
     */
    getHistory(params) {
        return this.dfHTTP.get(NetworkConfig.path.getHistory, params).map((res: any) => {
            return res;
        }, (error) => {
            return error;
        });
    }

    /**
     * 获取所有流程
     * jiangen  2018年04月23日15:08:26
     * @returns
     * @memberof ComponentService
     */
    getAllProcess() {
        const params = {
            languageCode: this.ls.get('language'),
        };
        return this.dfHTTP.post(NetworkConfig.path.getAllProcessList, params).map((res: any) => {
            return res;
        }, (error) => {
            return error;
        });
    }


    sendbroadcast(params) {
        return this.dfHTTP.post(NetworkConfig.path.sendBroadcast, params).map((res: any) => {
            return res;
        }, (error) => {
            return error;
        });
    }

    /**
     * 审批操作
     * jiangen 2018年04月23日15:08:40
     * @param {any} type  审批类型
     * @param {any} Modaltype modla页面
     * @param {any} taskData 订单基本数据
     * @param {any} approveData 审批数据
     * @memberof ComponentService
     */
    doApprove(type, Modaltype, taskData, approveData) {
        const getTokenParams = {
            // 拿assin token
            // approver: this.ls.get("userId"),
            approver: taskData.assignee,
        };
        this.getToken(getTokenParams).subscribe((data) => {
            if (data.resultCode === 'SUCCESS') {
                const params = {
                    taskId: taskData.taskId,
                    outcome: '',
                    token: data.token
                };
                if (type === 'submit' || type === 'return') {
                    params.outcome = 'APPROVE';
                } else if (type === 'approve') {
                    params.outcome = approveData.selectedValue;
                }
                // 审批操作
                console.log(params);
                this.approve(params).subscribe((res) => {
                    console.log(res);
                    if (res.resultCode === 'SUCCESS') {
                        this.toastService.showSuccess('SUCCESS', this.display.makeSuccess);
                        this.setPublicHistory(type, '', taskData, approveData);
                        this.getBroadcast(taskData, approveData);
                        this.appService.closeModalFun(Modaltype);
                    } else {
                        this.toastService.showError('ERROR', this.display.makeError);
                    }
                });
            }
        });
    }

    getBroadcast(taskData, approveData) {
        const docNodeNames = 'AS General Director';
        const documentTypeList = ['TT_CL_AU_X', 'TT_CL_AU_Y', 'TT_CL_AU_SUM_OF_FIN_PE'];
        const docIndexOf = documentTypeList.indexOf(taskData.receiptType);
        if (docIndexOf !== -1) {
            const broadcastParams = {
                documentType: taskData.receiptType,
                documentId: taskData.documentNumber,
                result: 1
            };
            // 如果是索赔的那三个订单   退回时候传2
            if (approveData.selectedValue === 'RETURN') {
                broadcastParams.result = 2;
                this.sendbroadcast(broadcastParams).subscribe((res) => {
                    console.log(res);
                });
                // 最后一个节点传 通过时候传1
            } else if (approveData.selectedValue === 'APPROVE' && taskData.nodeName === docNodeNames) {
                this.sendbroadcast(broadcastParams).subscribe((res) => {
                    console.log(res);
                });
            }
        }
    }

    /**
     * 报废流程
     * jiangne  2018年04月23日15:09:30
     * @param {any} taskData
     * @param {any} Modaltype
     * @memberof ComponentService
     */
    deleteProcess(taskData, Modaltype) {
        if (taskData.status === 'RETURN' && taskData.canDeny) {
            const getTokenParams = {
                // approver: this.ls.get("userId")
                approver: taskData.assignee,
            };
            this.getToken(getTokenParams).subscribe((data) => {
                if (data.resultCode === 'SUCCESS') {
                    const params = {
                        taskId: taskData.taskId,
                        outcome: 'ABORT',
                        token: data.token
                    };
                    this.approve(params).subscribe((res) => {
                        if (res.resultCode === 'SUCCESS') {
                            this.setPublicHistory('delete', '', taskData, '');
                            this.toastService.showSuccess('SUCCESS', this.display.makeSuccess);
                            this.appService.closeModalFun(Modaltype);
                        }
                    });
                }
            });
        }
    }
}
