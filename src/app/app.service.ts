import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { LocalStorage } from './warranty/core/component/localStorage/localStorage.component';
import { DateService } from './warranty/core/service/date.service';

@Injectable()

export class AppService {
    private getUserEd = new Subject<any>();
    getUserEd$ = this.getUserEd.asObservable();

    private languageChange = new Subject<any>();
    languageChange$ = this.languageChange.asObservable();

    private getMenu = new Subject<any>();
    getMenu$ = this.getMenu.asObservable();

    private isClose = new Subject<any>();
    isClose$ = this.isClose.asObservable();

    private closeModal = new Subject<any>();
    closeModal$ = this.closeModal.asObservable();

    getMenuFun(msg: any) {
        this.getMenu.next(msg);
    }

    getUserFun(msg: any) {
        this.getUserEd.next(msg);
    }

    languageChangeFun(data: any) {
        this.languageChange.next(data);
    }

    isCloseFun(msg: any) {
        this.isClose.next(msg);
    }

    closeModalFun(type: string) {
        this.closeModal.next(type);
    }
    // tslint:disable-next-line:member-ordering
    canIroute = [];
    // tslint:disable-next-line:member-ordering
    token = '';
    // tslint:disable-next-line:member-ordering
    display: any = {};
    // tslint:disable-next-line:member-ordering
    modalConfig = { ignoreBackdropClick: true, keyboard: false };

    constructor(
        private ls: LocalStorage,
        private dateService: DateService
    ) {
        this.token = this.ls.get('token');
        this.display = this.ls.getObject('display');
    }

    /**
     * 选择日期组件  日期格式化为yyyy-mmm-dd
     * jiangen 2017年11月18日16:45:30
     * @param {any} params
     * @returns  搜索参数
     * @memberof AppService
     */
    setDate(params, arr) {
        if (arr && arr.length) {
            for (const item of arr) {
                if (params[item] instanceof Date) {
                    params[item] = this.dateService.formatDate(params[item], 'yyyy-MM-dd');
                }
            }
        }
        return params;
    }

    /**
     * 取得LocalStorage 保存的用户信息
     * jiangen 2017年11月25日19:14:40
     * @memberof AppService
     */
    getUserInfo() {
        const user = {
            userId: this.ls.get('userId'), // 用户ID
            userName: this.ls.get('userName'), // 用户name
            from: '',
            roles: this.ls.get('userRoles')
        };
        return user;
    }

    /**
     * 取得当前审批 操作
     * jiangen 2017年11月28日15:01:54
     * @param {any} selectedValue
     * @returns
     * @memberof AppService
     */
    getApprovalActive(selectedValue) {
        if (selectedValue) {
            let approvalActive = '';
            switch (selectedValue) {
                case 'APPROVE':
                    approvalActive = 'Approve';
                    break;
                case 'RETURN':
                    approvalActive = 'Return';
                    break;
                case 'REJECT':
                    approvalActive = 'Reject';
                    break;
            }
            return approvalActive;
        }
    }
}

export const NetworkConfig: any = {
    domain: 'http://10.203.96.89:8011/', // 开发环境
    // domain: 'http://bpmdqaweb.jqdev.saic-gm.com/', // 测试环境
    // domain: "http://bpmdoaweb.saic-gm.com/", //正式环境
    // domain: 'http://192.168.191.2:8023/',  // zps IP
    // domain: 'http://10.6.99.203:8023/',  // zps IP
    devParams: true,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8'
    },
    path: {
        'getMenuInfo': 'dreamswty/tsMenu/getMenuInfos', // 获取用户对应的菜单列表
        'getZpsToken': 'dreamswty/helpDoc/getToken', // 获取ZPS的token
        'addHistory': 'dreamswty/ttApprovalHistory/addApprovalHistoryInfo', // 添加 历史记录
        'getApproveList': 'dreamswty/workspace/getTodolist', // 获取  我的审批列表
        'getCreateList': 'dreamswty/workspace/creatTsDocument', // 获取 申请创建列表
        'getAllProcessList': 'dreamswty/workspace/creatTsDocumentAll', // 获取 所有流程
        'getMyApply': 'dreamswty/workspace/getMyApplyList', // 获取 申请创建列表
        'getDraftsBoxList': 'dreamswty/workspace/getDraftList', // 获取 草稿箱列表
        'getHelpList': 'dreamswty/helpDoc/getHelpDocumentList', // 获取 帮助文档 列表
        'deleteDraftsBoxItem': 'dreamswty/workspace/deleteOneFromDraftBoxList', // 删除草稿箱
        'getInfoBytypeAndDocumentNum': 'dreamswty/workspace/getInfoByTypeAndDocNum', // 获取 订单详情 by type  documentNum
        'saveDocument': 'dreamswty/workspace/saveTtOthPrc', // 文档审批 保存
        'submitDocument': 'dreamswty/workspace/sumbitTtOthPrc', // 文档审批 提交
        'saveExpired': 'dreamswty/workspace/saveTtOvClAp', // 过期索赔 保存
        'submitExpired': 'dreamswty/workspace/sumbitTtOvClAp', // 过期索赔 提交
        'savePromotions': 'dreamswty/workspace/saveTtBrCaTeSu', // 促销活动  保存
        'submitPromotions': 'dreamswty/workspace/sumbitTtBrCaTeSu', // 促销活动 提交
        'saveQuality': 'dreamswty/workspace/saveTtQuDe', // 质量销毁 保存
        'submitQuality': 'dreamswty/workspace/sumbitTtQuDe', // 质量销毁 提交
        'saveReplace': 'dreamswty/workspace/saveTtFrOilCh', // 免费换油 保存
        'submitReplace': 'dreamswty/workspace/sumbitTtFrOilCh', // 免费换油 提交
        'saveReturn': 'dreamswty/workspace/saveTtDeOfRe', // 零件退回 保存
        'submitReturn': 'dreamswty/workspace/sumbitTtDeOfRePa', // 零件退回 提交
        'getBrandList': 'dreamswty/common/getTsBrandList', // 获取 品牌列表
        'getCumList': 'dreamswty/common/getTsCumList', // 获取 供应商列表
        'uploadFiles': 'dreamswty/ttAttachment/mulFileUpload', // 多附件上传
        'getuploadFiles': 'dreamswty/ttAttachment/getAttachmentInfoByIdAndType', // 附件获取 通用（）
        'getOtherFiles': 'dreamswty/ttAttachment/getAttachmentInfoByTtOvClAp', // 附件获取  过期索赔
        'addAttachmentInfo': 'dreamswty/ttAttachment/addAttachmentInfo', // 添加 附件关联
        'deleteFile': 'dreamswty/ttAttachment/fileDelete', // 删除附件
        'getLookupTypeInfoByParameter': 'dreamswty/tsLookupType/getLookupTypeInfoByParameter', // 字典配置查询
        'insertOrUpdateWord': 'dreamswty/tsLookupType/insertOrUpdateLookupTypeInfo', // 新增 编辑 字典
        'getLookupValueInfo': 'dreamswty/tsLookupValue/getLookupValueInfoByParameter', // 获取 字典明细列表
        'mergeLookupValueInfo': 'dreamswty/tsLookupValue/insertOrUpdateLookupValueInfo', // 新建 编辑 字典名字
        'deleteLookupTypeInfo': 'dreamswty/tsLookupType/deleteLookupTypeInfo', // 删除  字典配置
        'deleteLookupValueInfo': 'dreamswty/tsLookupValue/deleteLookupValueInfo', // 删除 字典配置 详细
        'getRoleList': 'dreamswty/tsRole/getRoleList', // 获取  角色列表
        'mergeRoleInfo': 'dreamswty/tsRole/insertOrUpdateRoleInfo', // 新增维护 角色配置
        'getTsMemberList': 'dreamswty/tsMember/getTsMemberListByRoleId', // 根据角色id查询角色人员列表
        'getEmployeeInfo': 'dreamswty/employee/getEmployeeInfo', // 获取人员信息
        'mergeRoleMemberInfo': 'dreamswty/tsMember/insertrolememberinfo', // 插入新的角色
        'updaterolememberinfo': 'dreamswty/tsMember/updaterolememberinfo', // 更新 角色
        'deleteRoleMemberInfo': 'dreamswty/tsMember/deleterolememberinfo', // 删除  角色成员
        'deleteRoleInfo': 'dreamswty/tsRole/deleteRoleInfo', // 删除 角色配置
        'deleteHelpFiles': 'dreamswty/helpDoc/deleteHelpDocument', // 删除 帮助文档
        'getSignatureList': 'dreamswty/signature/getSignatureList', // 获取 签名列表
        'selectOneSignature': 'dreamswty/signature/selectOneSignature', // 获取  一个签名
        'addSignature': 'dreamswty/signature/addSignature', // 保存 签名
        'updateSignature': 'dreamswty/signature/updateSignature1', // 更新 签名
        'getRoleMemberByRoleCode': 'dreamswty/signature/getRoleNumberByroleCode', // 获取人员列表
        'deleteSignature': 'dreamswty/signature/deleteSignature', // 删除 签名列表（单个）
        'searchEmpowerment': 'dreamswty/workspace/empow/getListEmpowerment', // 查询外出授权列表
        'saveEmpowerment': 'dreamswty/workspace/empow/saveOneEmpowerment', // 新建一个  外出授权
        'getRoleMenberList': 'dreamswty/tsMember/getRoleMemberList', // 获取可授权的人
        'deleteEmpowerment': 'dreamswty/workspace/empow/delectOneEmpowerment', //  删除 外出授权
        'updateOneEmpowerment': 'dreamswty/workspace/empow/updateOneEmpowerment',   // 更新一个
        'empowermentDetais': 'dreamswty/workspace/empow/selectOneEmpowerment', // 查询其中一个
        'getMemberList': 'dreamswty/tsRole/getRoleInfoByRoleCode', // 根据code  获取 角色
        'getApplyTrackList': 'dreamswty/workspace/getApplicationList', // 申请单跟踪
        'getHistory': 'dreamswty/ttApprovalHistory/getApprovalHistoryInfo', // 获取  审批记录
        'doApprove': 'dreamswtybpm/resources/taskService/updateOutcome', // 通用审批  接口
        'getApproveToken': 'dreamswtybpm/resources/taskService/getContextToken', // 审批前获取token
        'getLookupValue': 'dreamswty/tsLookupType/getLookupValueByLookupType', // 获取  值列表
        'getHandleBillsList': 'dreamswty/business/getDocumentProcList', // 单据处理查询
        'getProcessTransfer': 'dreamswty/manage/getProcessList', // 单据处理
        'getManage': 'dreamswty/employee/getEmployeeInfoManage', // 获取主管
        'getQuarterlyInfo': 'dreamswty/WAOL/getTtClFinPeInfo', // 获取季度表
        'getAllSummary': 'dreamswty/WAOL/getTtFinPeSum', // 获取现场索赔和远程索赔 汇总表附件
        'getSuoPeiFiles': 'dreamswty/WAOL/getTtClAUDET', // 获取  现场索赔和远程索赔的附件
        'updateSummary': 'dreamswty/WAOL/updateTtClFinPe', // 获取 现场索赔和远程索赔的附件
        'exportApproveList': 'dreamswty/business/export', // 导出
        'doTransfer': 'dreamswtybpm/resources/taskService/reassignTask',  // 流程转移 - 转移
        'doAbortTask': 'dreamswtybpm/resources/taskService/abortInstance', // 流程转接 - 终止
        'doSuspendTask': 'dreamswtybpm/resources/taskService/suspendTask', // 流程转接 - 暂停
        'doResumeTask': 'dreamswtybpm/resources/taskService/resumeTask', // 流程转接 - 激活
        'doRoute': 'dreamswtybpm/resources/taskService/routeActivity', // 流程转接 - 路由
        'getProcessList': 'dreamswty/manage/getInstance', // 流程管理 - 路由 - 审批节点
        'getAdminMemberList': 'dreamswty/manage/getMember', // 流程转接
        'sendBroadcast': 'dreamswty/WAOL/overTtClAuFinPe', // 三个索赔审批之后调用
    }
};

export const Language: any = {
    zh_CN: {
        // 文档审批
        'ApplicatioCcolumn': '申请栏',
        'DocumentTitle': '文档审批', // General Process
        'ExpiredTitle': '过期索赔申请表',
        'PromotionsTitle': '促销活动申请表',
        'QualityTitle': '质量销毁申请',
        'RemoteTitle': '远程索赔审计报告',
        'ReplaceTitle': '免费换油价格核算',
        'ReturnTitle': '运回零件销毁申请表',
        'ScenceTitle': '现场索赔审计报告',
        'SummaryTitle': '索赔审计财务罚款汇总',

        'Brand': '品牌',
        'Customer': '经销商',
        'Region': '大区',
        'ClaimCode': '经销索赔代码',
        'RegionManagerName': '大区经理',
        'QuantityApply': '申请条数',
        'Amount': '申请金额',
        'ApplyFiles': '申请表附件',
        'ApplyListFiles': '申请清单附件',
        'SummaryFiles': '详细情况说明附件',

        'PrNo': 'PR号',

        'GongYing': '供应商',
        'DesQuantity': '销毁总数量',
        'Jiancheng': '经销商简称',
        'AuditDate': '审计日期',
        'TaskNumber': '任务编号',
        'Discount': '抵扣金额',
        'PenaltAmount': '审处罚金额',

        'CustomerCode': '经销商代码',
        'Suopei': '索赔代码',

        'OrderNo': '订单号',
        'BatchNo': '批次',
        'DesAmount': '销毁总金额',
        'ReturnFiles': '销毁供应商附件',
        'ReturnInfo': '原索赔件金额影响利润的金额为0',

        'TotalFineCase': '合计罚款案例数',
        'Forfeit': '合计罚款金额',
        'QuarterlyFiles': '季度汇总单据详情',
        'AllFiles': '相关单站单据详情',

        'Phone': '联系电话',
        'ApproveChoose': '审核人选择',
        'LineManagerName': '主管',
        'StockClaimsAgentName': '索赔股经办人',
        'SeniorManagerClaimName': '索赔高级经理',
        'TecnicalDirectorClaimName': '售后技术总监',
        'AsGeneralDirectorName': '售后服务事业部部长',
        'DocumentNumber': '单据编号',


        'Tmcount': '成员数量',
        'Title': '标题',
        'DocumentNo': '申请编号',
        'Initiator': '申请人',
        'ApplicationDate': '申请日期',
        'EffectiveDate': '生效日期',

        'TotalAmount': '总金额',
        'date': '日期',
        'Remarks': '备注',
        'ApprovalColumn': '审批栏',
        'BusinessApplication': '基本信息',
        'ApproverInformation': '审批人信息',
        'AttachmentList': '附件列表',
        'DocumentDetails': '单据详情',
        'ApprovalOperation': '审批操作',

        'Processname': '流程名称',
        'Processnode': '当前节点',
        'AuthorizedPerson': '代理人',
        'Authorizer': '授权人',
        'CurrentNode': '当前节点',
        'ProcessNodeName': '流程节点名称',
        'Approver': '审批人',
        'Date': '处理时间',
        'Status': '状态',
        'StartDate': '开始日期',
        'EndDate': '结束日期',
        'Application': '应用',
        'Process': '流程',
        'RoleCode': '角色编码',
        'RoleName': '角色名称',
        'Name': '姓名',
        'Code': '编码',
        'name': '名称',
        'Description': '描述',
        'FileName': '文件名称',
        'File': '文档',

        'Welcome': '欢迎',
        'Shrink': '收缩',
        'back': '返回',
        'Add': '新增',
        'Refresh': '刷新',
        'Workbench': '工作台',
        'SearchCenter': '查询中心',
        'DocumentSearch': '单据查询',
        'BusinessProcessing': '业务处理',
        'ApplicationConfiguration': '应用配置',
        'ProcessConfiguration': '流程配置',
        'ManagementTool': '管理工具',
        'OnlineHelp': '在线帮助',
        'ApprovalList': '审批列表',
        'CreateApplication': '申请创建',
        'DraftBox': '草稿箱',
        'MyApplication': '我的申请',
        'ApplicationTracking': '申请单跟踪',
        'OutAuthorization': '外出授权',
        'OutAuthorizationDetails': '授权详情',
        'PersonalInformation': '个人信息',
        'DocumentProcessing': '单据处理',
        'RoleConfiguration': '角色配置',
        'DictionaryConfiguration': '字典配置',
        'SignatureConfiguration': '签名配置',
        'ProcessTransfer': '流程管理',
        'HelpDocument': '帮助文档',
        'RoleMember': '角色成员',
        'DictionaryDetails': '字典明细',

        'Search': '查询',
        'Reset': '重置',
        'Cancle': '取消',
        'Confirm': '确定',
        'Transfer': '转接',
        'Export': '导出',
        'Route': '路由',
        'End': '终止',
        'Stop': '暂停',
        'Actived': '激活',

        'UserId': '工号',
        'Operation': '操作',
        'action': '动作',
        'Suggestion': '意见',
        'Role': '角色',
        'Member': '成员',
        'Quantity': '数量',
        'CurrentApprover': '当前处理人',
        'Founder': '创建人',
        'UploadFile': '文件上传',

        'AddRoleMember': '新增角色成员',
        'UpdateRoleMember': '更新角色成员',
        'AddRoleConfiguration': '新增角色配置',
        'UpdateRoleConfiguration': '更新角色成员',
        'AddDictionaryDetails': '新增字典明细',
        'UpdateDictionaryDetails': '更新字典明细',
        'AddDictionaryConfiguration': '新增字典配置',
        'UpdateDictionaryConfiguration': '更新字典配置',

        'choosePerson': '选择人员',
        'Unchoose': '未选择',
        'Chosen': '已选择',

        'PageTotal1': '共',
        'PageTotal2': '条',

        'NoResult': '没有数据可以显示',
        'loading': '加载数据中，请稍后......',
        'ApprovalDecision': '审批决策',
        'HistoricalApprovalRecord': '历史审批记录',
        'Unupload': '附件未上传,请点击upload上传附件',

        'Choose': '选择',

        'Preview': '预览',
        'Save': '保存',

        'ApproveMessage': '请选择审批操作！',
        'OpinionMessage': '请填写审批意见！',
        'Opinion': '意见',
        'RequiredMessage': '请校验必填选项！',
        'DeleteMessage': '确定删除？',
        'RoleCodeMessage': '角色编码已存在，无法添加！',
        'RoleCodeDeleteMessage': '无法删除！请先删除角色成员。',
        'DocumentRequiredMessage': '该角色编码下的角色成员流程为必填！',
        'RoleMemberMessage': '该流程下的角色成员已存在，无法添加！',
        'WordConfigMessage': '字典配置已存在，无法添加！',
        'WordConfigDeleteMessage': '无法删除！请先删除配置明细。',
        'WordValueMessage': '字典明细已存在，无法添加！',

        'startTime': '开始日期',
        'endTime': '结束日期',
        'processCode': '流程编码',
        'processName': '流程名称',
        'normal': '正常',
        'stop': '暂停',
        'end': '终止',

        'titleRequired': '标题不能为空',
        'creationDeptRequired': '申请科室不能为空',
        'desAmountRequired': '销毁总金额不能为空',
        'batchNoRequired': '批次不能为空',
        'desQuantityRequired': '销毁总数量不能为空',
        'orderNoRequired': '订单号不能为空',
        'customerCodeRequired': '供应商不能为空',
        'customerExpiredCodeRequired': '经销商不能为空',
        'prNoRequired': 'PR号不能为空',
        'amountRequired': '申请金额不能为空',
        'brandCodeRequired': '品牌不能为空',
        'quantityRequired': '申请条数不能为空',
        'phoneRequired': '联系电话不能为空',

        'AuthorizerRequired': '授权人不能为空',
        'AuthorizedPersonRequired': '代理人不能为空',
        'ProcessRequired': '流程不能为空',
        'StartDateRequired': '开始日期不能为空',
        'endTimeRequired': '结束日期不能为空',
        'pleaseCheckFiles': '请检查附件',
        'chooseProcess': '请选择一个流程',
        'plesaseChoosePerson': '请选择一个人',
        'canotChoose': '无法选择自己',
        'makeSuccess': '操作成功',
        'makeError': '操作失败',
        'uploadSuccess': '文件已上传,请确定以保存',
        'uploadError': '文件上传失败',
        'uploadCheck': '请校验必填选项',
        'dateCheck': '请校验时间',
        'personSame': '不能是同一个人',
        'confirm': '是否确认操作？',
        'confirmHead': '提醒',
        'annex': '附件',
        'inVolid': '无效文件',
        'onlyImg': '只能选择图片',
        'documentType': '文档类别',
        'number': '文档编号',
        'documentName': '文档名称',
        'documentTypeDet': '申请类型',
        'yeaer': '年份',
        'quarterly': '季度',
        'applicationStatus': '申请状态'
    },
    en_US: {
        'DocumentTitle': 'General Process', // General Process
        'ExpiredTitle': 'Overdue Warranty Claims Apply',
        'PromotionsTitle': 'Brand Activity System Support Application',
        'QualityTitle': 'Quality Scrap',
        'RemoteTitle': 'Distance Warranty Audit',
        'ReplaceTitle': 'Regulation of Free Oil Change Service Cost',
        'ReturnTitle': 'Scrap of Warranty Return Parts',
        'ScenceTitle': 'On-site Warranty Audit',
        'SummaryTitle': 'Warranty Audit Finance Penalty Summary',

        'Brand': 'Brand',
        'Customer': 'Dealer',
        'Region': 'Region',
        'ClaimCode': 'Dealer Code',
        'RegionManagerName': 'Region Manager',
        'QuantityApply': 'Application number',
        'Amount': 'Application Amount',
        'ApplyFiles': 'Application attachment',
        'ApplyListFiles': 'Application list attachment',
        'SummaryFiles': 'Details of attachment',

        'PrNo': 'PR Number',

        'GongYing': 'supplier',
        'DesQuantity': 'total destruction',
        'Jiancheng': 'dealer abbrevaation',
        'AuditDate': 'audit date',
        'TaskNumber': 'task number',
        'Discount': 'deduction amount',
        'PenaltAmount': 'penalty amount',

        'CustomerCode': 'dealer code',
        'Suopei': 'claim code',

        'OrderNo': 'order number',
        'BatchNo': 'batch',
        'DesAmount': 'total amount',
        'ReturnFiles': 'destory supplier attachments',
        'ReturnInfo': 'The amount of the original claim amount affecting the profit is 0',

        'TotalFineCase': 'total fines cases',
        'Forfeit': 'total fines',
        'QuarterlyFiles': 'quarterly summary document details',
        'AllFiles': 'related docuent details',

        'Phone': 'Phone',
        'ApproveChoose': 'Reviewer selection',
        'LineManagerName': 'Manager',
        'StockClaimsAgentName': 'Warranty Business Staff',
        'SeniorManagerClaimName': 'Warranty Senior Manager',
        'TecnicalDirectorClaimName': 'Aftersales Technology Director ',
        'AsGeneralDirectorName': 'General Director of Aftersales Service Division ',
        'DocumentNumber': 'Document Number',

        'Tmcount': 'Number of members',
        'Title': 'Title',
        'DocumentNo': 'Document No.',
        'Initiator': 'Initiator',
        'date': 'Date',
        'Remarks': 'Remarks',
        'ApplicatioCcolumn': 'Application Column',
        'ApprovalColumn': 'Approval Column',
        'BusinessApplication': 'Bsic Information',
        'ApproverInformation': 'Approver Information',
        'AttachmentList': 'Attachment List',
        'DocumentDetails': 'Document Details',
        'ApprovalOperation': 'Approval Operation',

        'Processname': 'Process name',
        'Processnode': 'Process node',
        'AuthorizedPerson': 'Authorized Person',
        'Authorizer': 'Authorizer',
        'CurrentNode': 'Current Node',
        'ProcessNodeName': 'Process Node Name',
        'Approver': 'Approver',
        'Date': 'Date',
        'Status': 'Status',
        'StartDate': 'Start Date',
        'EndDate': 'End Date',
        'Application': 'Application',
        'Process': 'Process',
        'RoleCode': 'RoleCode',
        'RoleName': 'RoleName',
        'Name': 'Name',
        'Code': 'Code',
        'name': 'name',
        'Description': 'Description',
        'FileName': 'FileName',
        'File': 'File',

        'Welcome': 'Welcome',
        'Shrink': 'Shrink',
        'back': 'Back',
        'Add': 'Add',
        'Refresh': 'Refresh',
        'Workbench': 'Workbench',
        'SearchCenter': 'Search Center',
        'DocumentSearch': 'Document Search',
        'BusinessProcessing': 'Business Processing',
        'ApplicationConfiguration': 'Application Configuration',
        'ProcessConfiguration': 'Process Configuration',
        'ManagementTool': 'Management Tool',
        'OnlineHelp': 'Online Help',
        'ApprovalList': 'Approval List',
        'CreateApplication': 'Create Application',
        'DraftBox': 'Draft Box',
        'MyApplication': 'My Application',
        'ApplicationTracking': 'Application Tracking',
        'OutAuthorization': 'Out Authorization',
        'OutAuthorizationDetails': 'Out Authorization Details',
        'PersonalInformation': 'Personal Information',
        'DocumentProcessing': 'Document Processing',
        'RoleConfiguration': 'Role Configuration',
        'DictionaryConfiguration': 'Dictionary Configuration',
        'SignatureConfiguration': 'Signature Configuration',
        'ProcessTransfer': 'Process Transfer',
        'HelpDocument': 'Help Document',
        'RoleMember': 'Role Member',
        'DictionaryDetails': 'Dictionary Details',

        'Search': 'Search',
        'Reset': 'Reset',
        'Cancle': 'Cancle',
        'Confirm': 'Confirm',
        'Transfer': 'Transfer',
        'Export': 'Export',
        'Route': 'Route',
        'End': 'End',
        'Stop': 'Stop',
        'Actived': 'Actived',

        'UserId': 'UserId',
        'Operation': 'Operation',
        'action': 'Action',
        'Suggestion': 'Suggestion',
        'Role': 'Role',
        'Member': 'Member',
        'Quantity': 'Quantity',
        'CurrentApprover': 'Current Approver',
        'Founder': 'Founder',
        'UploadFile': 'Upload File',

        'AddRoleMember': 'Add RoleMember',
        'UpdateRoleMember': 'Update RoleMember',
        'AddRoleConfiguration': 'AddRole Configuration',
        'UpdateRoleConfiguration': 'Update RoleConfiguration',
        'AddDictionaryDetails': 'Add DictionaryDetails',
        'UpdateDictionaryDetails': 'Update DictionaryDetails',
        'AddDictionaryConfiguration': 'Add DictionaryConfiguration',
        'UpdateDictionaryConfiguration': 'Update DictionaryConfiguration',

        'choosePerson': 'Choose Person',
        'Unchoose': 'Unchoose',
        'Chosen': 'Chosen',

        'PageTotal1': 'A Total of ',
        'PageTotal2': '',

        'NoResult': 'No results found',
        'loading': 'Loading data, please wait......',
        'ApprovalDecision': 'Approval Decision',
        'HistoricalApprovalRecord': 'Historical Approval Record',
        'Unupload': 'File is not upload,pleace click upload to upload',

        'Choose': 'Choose',
        'CoverLetter': 'Cover Letter',
        'SupplyContract': 'Supply Contract',
        'Quotation': 'Quotation',

        'Preview': 'Preview',
        'Save': 'Save',

        'ApproveMessage': 'Please select approval operation!',
        'OpinionMessage': 'Opinion is required！',
        'Opinion': 'Opinion',
        'RequiredMessage': 'Please check the required options!',
        'DeleteMessage': 'Confirm delete?',
        'RoleCodeMessage': 'Role code has existed and can not be added!',
        'RoleCodeDeleteMessage': 'Can not delete! Please delete the role members first.',
        'DocumentRequiredMessage': 'The process of role members is required!',
        'RoleMemberMessage': 'The role members in the process have already existed and cannot be added!',
        'WordConfigMessage': 'Dictionary configuration already exists and can not add!',
        'WordConfigDeleteMessage': 'Can not delete! Please delete the configuration details first.',
        'WordValueMessage': 'Dictionary details have already existed and can not be added!',

        'startTime': 'start time',
        'endTime': 'end time',
        'processCode': 'process code',
        'processName': 'process name',
        'normal': 'normal',
        'stop': 'stop',
        'end': 'end',

        'titleRequired': 'title is required',
        'creationDeptRequired': 'department is required',
        'StartDateRequired': 'start date is required',
        'endTimeRequired': 'end date is required',
        'pleaseCheckFiles': 'Please check annex',
        'chooseProcess': 'Please choose a process',
        'plesaseChoosePerson': 'Please choose a person',
        'canotChoose': 'You cant choose yourself',
        'makeSuccess': 'Successful',
        'makeError': 'failed',
        'uploadSuccess': 'File has been uploaded ,please congirm',
        'uploadError': 'File File failed',
        'uploadCheck': 'please check',
        'dateCheck': 'please check the time',
        'personSame': 'cant not be th same person',
        'confirm': 'whether to confirm the operation ?',
        'confirmHead': 'attention',
        'annex': 'annex',

        'inVolid': 'involid',
        'onlyImg': 'only image',
        'documentType': 'document type',
        'number': 'document number',
        'documentName': 'document name',
        'documentTypeDet': 'application type',
        'yeaer': 'years',
        'quarterly': 'quarterly',
        'applicationStatus': 'application Status'
    }
};

