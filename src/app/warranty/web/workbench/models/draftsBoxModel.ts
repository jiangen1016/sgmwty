import { Response } from '@angular/http';

/**
 * 草稿箱 搜索条件
 * jiangen  2017年11月18日14:13:14
 * @export
 * @class applyTrackSearch
 */
export class DraftsBoxSearch {
    title: string; // 搜索标题
    processName: string; // 流程名称
    documentNumber: string; // 申请编号
    beginDate: Date; // 开始时间
    endDate: Date;  // 结束时间
    languageCode: string; // 语言
    createdBy: string;
}


/**
 * 草稿箱分页
 * jiangen 2017年11月18日17:45:37
 * @export
 * @class DraftsBoxPage
 */
export class DraftsBoxPage {
    pageSize: number;
    pageNum: number;
}

/**
 * 草稿箱查询返回结果
 * jiangen 2017年11月18日14:30:24
 * @export
 * @class ApplyTrackSearchResponse
 */
export class DraftsBoxSearchResponse extends Response {
    code: string;
    msg: string;
    data: any;
}
