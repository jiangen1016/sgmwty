export class ScenceDetails {
    documentNumber: string;
    title: string;
    createdBy: string;
    creatorName: string;
    creationDate: number;
    phone?: any;
    remark: string;
    status: string;
    bpmInstanceId: number;
    documentType: string;
    auId: number;
    brandCode: string;
    customerCode: string;
    taskNumber: string;
    auditDate: string;
    discount: number;
    penaltAmount: number;
    claimCode: string;
    customerName: string;
}

export class ScenceApprove {
    sourceId: string; // 单据号
    sourceType: string; // 单据类型
    selectedValue = ''; // 审批操作
    approvalComment = ''; // 审批备注
    approverId: string; // 审批人
    nodeName: string; // 节点名称
    approvalActive: string; // 动作
    createdBy: string; // 申请人
}
