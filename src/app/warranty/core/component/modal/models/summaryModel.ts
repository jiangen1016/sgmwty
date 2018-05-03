export class SummaryDetails {
    documentNumber: string;
    title: string;
    createdBy: string;
    creatorName: string;
    creationDate: number;
    phone?: any;
    remark?: any;
    forfeit: number;
    status: string;
    bpmInstanceId: number;
    documentType: string;
    peId: number;
    totalFineCase: number;
}

export class SummaryApprove {
    sourceId: string; // 单据号
    sourceType: string; // 单据类型
    selectedValue = ''; // 审批操作
    approvalComment = ''; // 审批备注
    approverId: string; // 审批人
    nodeName: string; // 节点名称
    approvalActive: string; // 动作
    createdBy: string; // 申请人
}

export class QuarterlyInfo {
    detId: number;
    year: string;
    quarter: string;
    sourceId: string;
    downloadUrl: string;
    fileName: string;
    peId: number;
}

export class SummaryPage {
    pageSize: Number = 10;
    pageNum: Number = 1;
}
