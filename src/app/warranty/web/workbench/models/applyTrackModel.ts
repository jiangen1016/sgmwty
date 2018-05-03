import { Response } from '@angular/http';

/**
 * 申请单追踪  搜索条件
 * jiangen  2017年11月18日14:13:14
 * @export
 * @class applyTrackSearch
 */
export class ApplyTrackSearch {
    title: string; // 标题
    claimCode: string; // 索赔代码
    processName: string; // 流程名称
    documentName: string; //
    beginDate: Date; // 申请时间  开始
    endDate: Date; // 申请时间  结束
    activeBeginDate: Date;  // 生效时间  开始
    activeEndDate: Date;  // 生效时间  结束
    businessCategory: string; // 业务类型
    tradeTermCode: string; // 贸易条款
    receiptType: string; // 单据类型
    customerCode: string; // 客户
    projectCode: string; // 项目
    phaseCode: string; // 制造阶段
    sampVehCount: string; // 数量
    currency: string; // 币种
    exchangeRate: string; //  汇率
    totalAmount: number; // 金额
    languageCode: string; // 语言
    statusMeaning: string; // 状态
    nodeName: string;
    qsNumber: string; // 报价单号
    cosNumber: string; // cos合同号
    ctNumber: string; // 合同号;
    creatorName: string; // 申请人
    customerName: string; // 经销商
    documentNumber: string;
    status: string;
    modelYear: string;
    roleName: string;
}

/**
 * 审批列表分页
 * jiangen 2017年11月18日15:00:40
 * @export
 * @class ApplyListPage
 */
export class ApplyTrackPage {
    pageSize: number;
    pageNum: number;
}

/**
 * 申请单追踪返回结果
 * @export
 * @class ApplyTrackSearchResponse
 */
export class ApplyTrackSearchResponse extends Response {
    code: string;
    msg: string;
    data: any;
}
