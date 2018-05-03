import { Response } from '@angular/http';


export class ProcessTransferSearch {
    title: string;
    assignee: string;
    creationBeginDate: string;
    creationEndDate: string;
    state: string; // 状态
    languageCode: string; // 语言
    processName: string; // 流程名称
    documentNumber: string;
}

export class ProcessTransferPage {
    pageNum: number;
    pageSize: number;
}

export class ProcessTransfePerson {
    roleCode: string;
    documentCode: string;
}

export class ProcessTransferResponse extends Response {
    code: string;
    msg: string;
    data: any;
}


