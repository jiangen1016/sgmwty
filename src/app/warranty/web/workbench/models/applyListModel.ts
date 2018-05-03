import { Response } from '@angular/http';

/**
 * 申请单追踪  搜索条件
 * jiangen  2017年11月18日14:13:14
 * @export
 * @class applyTrackSearch
 */
export class ApplyListSearch {
    documentNumber: string;    // 单据号
    title: string;     // 标题
    processName: string;   // 流程名称
    status: string;    // 状态
    nodeName: string;  // 流程节点
    createdBy: string; // 创建人
    statusMeaning: string;
    languageCode: string; // 语言
    beginDate: string; // 开始时间
    endDate: string; // 结束时间
}

/**
 * 审批列表分页
 * jiangen 2017年11月18日15:00:40
 * @export
 * @class ApplyListPage
 */
export class ApplyListPage {
    pageSize: number;
    pageNum: number;
}

/**
 * 审批列表查询返回结果
 * jiangen 2017年11月18日14:30:24
 * @export
 * @class ApplyTrackSearchResponse
 */
export class ApplyListSearchResponse extends Response {
    code: string;
    msg: string;
    data: any;
}

export class MutileApprove {
    selectedValue = ''; // 审批决策
    approvalComment = ''; // 审批意见
}
