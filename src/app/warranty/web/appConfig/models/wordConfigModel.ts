import { Response } from '@angular/http';

/**
 * 字典配置
 * zengwei 2017年11月16日15:33:34
 * @export
 * @class WordConfig
 */
export class WordConfig {
    lookupId?: number;
    lookupType: String;
    meaning: String;
}

/**
 * 获取字典配置列表 分页
 * zengwei 2017年11月18日16:25:18
 * @export
 * @class wordConfigListPage
 */
export class WordConfigListPage {
    pageNum: number;
    pageSize: number;
}

/**
 * 获取字典配置列表 查询
 * zengwei 2017年11月18日16:25:18
 * @export
 * @class WordConfigListSearch
 */
export class WordConfigListSearch {
    lookupType: String;
    meaning: String;
}

/**
 * 获取字典配置列表返回参数
 * zengwei 2017年11月16日15:33:34
 * @export
 * @class WordConfigListResponse
 */
export class WordConfigListResponse extends Response {
    // TODO:
    code: string;
    msg: string;
    data: any;
}

/**
 * 删除字典配置请求参数
 * zengwei 2017年11月16日15:33:34
 * @export
 * @class WordConfigDeleteRequest
 */
export class WordConfigDeleteRequest {
    lookupId: number;
}

/**
 * 删除字典配置返回参数
 * zengwei 2017年11月16日15:33:34
 * @export
 * @class WordConfigDeleteResponse
 */
export class WordConfigDeleteResponse {
    code: String;
    msg: String;
}

/**
 * 维护字典配置请求参数
 * zengwei 2017年11月16日15:33:34
 * @export
 * @class WordConfigRequest
 */
export class WordConfigRequest {
    lookupId?: number;
    lookupType: String;
    meaning: String;
    enabledFlag: String;
    createdBy: number;
    creationDate: any;
    lastUpdateDate: any;
    lastUpdatedBy: number;
}

/**
 * 维护字典配置返回参数
 * zengwei 2017年11月16日15:33:34
 * @export
 * @class WordConfigResponse
 */
export class WordConfigResponse extends Response {
    code: String;
    msg: String;
}

/**
 * 字典配置明细
 * zengwei 2017年11月18日14:11:41
 * @export
 * @class WordConfigValue
 */
export class WordConfigValue {
    lookupCode: String;
    meaning: String;
    constructor() {
        this.lookupCode = '';
        this.meaning = '';
    }
}

/**
 * 获取字典配置列表 分页
 * zengwei 2017年11月18日16:25:18
 * @export
 * @class wordConfigListPage
 */
export class WordConfigValueListPage {
    pageNum: number;
    pageSize: number;
}

/**
 * 获取字典配置明细列表请求参数
 * zengwei 2017年11月16日15:33:34
 * @export
 * @class WordConfigValueListRequest
 */
export class WordConfigValueListSearch {
    // lookupId: number;
    lookupId: number;
    lookupCode: string;
    meaning: string;
}

/**
 * 获取字典配置明细列表返回参数
 * zengwei 2017年11月18日14:18:09
 * @export
 * @class WordConfigValueListResponse
 */
export class WordConfigValueListResponse extends Response {
    code: string;
    msg: string;
    data: any;
}

/**
 * 删除字典配置明细请求参数
 * zengwei 2017年11月18日14:19:20
 * @export
 * @class WordConfigValueDeleteRequest
 */
export class WordConfigValueDeleteRequest {
    lookupCode: String;
}

/**
 * 删除字典配置明细返回参数
 * zengwei 2017年11月18日14:19:24
 * @export
 * @class WordConfigValueDeleteResponse
 */
export class WordConfigValueDeleteResponse {
    code: String;
    msg: String;
}

/**
 * 维护字典配置明细请求参数
 * zengwei 2017年11月16日15:33:34
 * @export
 * @class WordConfigValueRequest
 */
export class WordConfigValueRequest {
    lookupTypeInfo: WordConfigRequest;
    lookupCode: String;
    lookupId: number;
    meaning: String;
    enabledFlag: String;
    displaySeq: number;
    createdBy: string;
    creationDate: any;
    lastUpdateDate: any;
    lastUpdatedBy: string;
}

/**
 * 维护字典配置明细返回参数
 * zengwei 2017年11月16日15:33:34
 * @export
 * @class WordConfigValueResponse
 */
export class WordConfigValueResponse extends Response {
    code: String;
    msg: String;
}
