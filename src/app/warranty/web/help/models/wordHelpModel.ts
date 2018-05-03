/**
 * 获取帮助文档列表 分页
 * zengwei 2017年11月24日15:32:26
 * @export
 * @class WordHelpListPage
 */
export class WordHelpListPage {
    pageNum: number;
    pageSize: number;
    attachmentName: string;
}

export class WordHelpUploadName {
    attachmentName: string;
}

/**
 * 获取帮助文档列表 查询
 * zengwei 2017年11月24日15:32:30
 * @export
 * @class WordHelpListSearch
 */
export class WordHelpListSearch {
    attachmentName: string;
}

export class WordHelpListResponse {
    code: string;
    msg: string;
    data: any;
}

export class WordHelpDelete {
    attachmentId: number;
}

export class WordHelp {
    attachmentId: number;
    attachmentName: string;
    fileName: string;
    sourceId: number;
    sourceType: string;
    downloadUrl: string;
    createdBy: string;
    creationDate: Date;
    aliasName: string;
    fileMsg: string;
}
