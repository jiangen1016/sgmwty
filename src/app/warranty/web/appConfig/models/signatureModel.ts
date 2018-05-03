import { Response } from '@angular/http';

export class SignatureSearch {
    roleName = ''; // 角色
    userName = ''; // 成员
}

export class SignaturePage {
    pageNum: number; // 第几页
    pageSize: number; // 每页几条
}

export class SignatureNew {
    roleCode: string; // 角色 code
    userId: string; // 成员
    userName: string; // 成员名字
    empId: string; //
    description: string; // miaoshu
    userUid: string;
    sinatureName?: string;
    sinatureCode?: string;
    signatureId?: number;
    attachmentId?: number;
    empuid: string;
    memberId?: string;
}

export class SignatureSearchRoleList {
    pageNum: 1;
    pageSize: 1000;
}
