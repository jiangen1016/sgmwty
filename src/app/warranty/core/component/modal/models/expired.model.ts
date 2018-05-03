export class ExpiredSave {
    documentNumber: string;
    title: string;
    createdBy?: any;
    creatorName?: string;
    creationDate: string;
    phone?: any;
    quantity: number;
    brandCode: any;
    remark?: any;
    customerCode?: any;
    amount: number;
    status: string;
    documentType?: any;
    regionManagerName: string;
    regionName: string;
    customerName: string;
    claimCode: string;
}

export class ExpiredApprove {
    sourceId: string; // 单据号
    sourceType: string; // 单据类型
    selectedValue: String = ''; // 审批操作
    approvalComment: String = ''; // 审批备注
    approverId: string; // 审批人
    nodeName: string; // 节点名称
    approvalActive: string; // 动作
    createdBy: string; // 申请人
}
