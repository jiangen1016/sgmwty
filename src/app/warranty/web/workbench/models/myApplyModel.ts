import { Response } from '@angular/http';

/**
 * 我的申请 分页
 * jiangen  2017年11月18日14:13:14
 * @export
 * @class MyApplyPage
 */
export class MyApplyPage {
    pageSize: number;
    pageNum: number;
}

/**
 * 我的申请 搜索条件
 * jiangen  2017年11月18日14:13:14
 * @export
 * @class applyTrackSearch
 */
export class MyApplySearch {
    title: string; // 标题
    processName: string; // 流程名称
    documentNumber: string; // 单据号
    beginDate: Date;    // 申请时间  开始
    endDate: Date;    // 申请时间  结束
    statusMeaning: string; // 状态
    languageCode: string; // 语言
}

/**
 * 我的申请查询返回结果
 * jiangen 2017年11月18日14:30:24
 * @export
 * @class ApplyTrackSearchResponse
 */
export class MyApplySearchResponse extends Response {
    code: string;
    msg: string;
    data: any;
}
