import { Response } from '@angular/http';

/**
 * 申请创建数组
 * jiangen 2017年11月18日14:03:57
 * @export
 * @class applyList
 */
export class ApplyList {
    documentName: string;
    documentCode: string;
}

/**
 * 申请创建返回结果
 * @export
 * @class applyListResponse
 * @extends {Response}
 */
export class ApplyListResponse extends Response {
    code: string;
    msg: string;
    data: any;
}
