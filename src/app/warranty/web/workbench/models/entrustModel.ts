import { Response } from '@angular/http';
import { EntrustModule } from '../entrust/entrust.component.module';

/**
 * 新建外出授权
 * jiangen  2017年12月21日17:13:14
 * @export
 * @class EntrustCreat
 */
export class EntrustCreat {
    startDate: string; // 开始时间
    endDate: string; // 结束时间
    remark: string; // 备注
    grantorUid: string; // 授权人Id
    grantorName: string; // 授权人 名
    surrogateUid: string; // 代理人Id
    surrogateName: string; // 代理人 名
    applicationFlowDisplayname: string; // 流程名称
    applicationFlow: string; // 流程名称code
    creatorUid: string; // 当前登录人
}

export class EntrustSearch {
    grantorUid: string; // 授权人
    grantorName: string; // 授权人 name
    surrogateUid: string; // 代理人
    surrogateName: string; // 代理人name
    applicationName: string; // 应用
    applicationFlow: string; // 流程
    state: string; // 状态
    startBegDate: string; // 申请时间  开始
    startEndDate: string; // 申请时间  结束
    endBegDate: string; // 结束时间 开始
    endOverDate: string; // 结束时间  结束
    status: string; // 状态
    tableConfig: any;
}

/**
 *外出授权分页
 * jiangen  2017年12月21日17:46:47
 * @export
 * @class ApplyListPage
 */
export class EntrustListPage {
    pageSize: number;
    pageNum: number;
}

/**
 * 外出授权列表返回
 * jiangen  2017年12月21日17:14:34
 * @export
 * @class EntrustSearchResponse
 * @extends {Response}
 */
export class EntrustSearchResponse extends Response {
    code: string;
    msg: string;
    data: any;
}
