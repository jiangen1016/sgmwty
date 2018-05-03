export class ReturnSave {
    documentNumber: string;
    title: string;
    createdBy?: any;
    creatorName: string;
    creationDate: string;
    phone?: any;
    remark?: any;
    orderNo?: any;
    batchNo?: any;
    desQuantity: number;
    desAmount: number;
    status: string;
    bpmInstanceId?: any;
    documentType?: any;
    paId: number;
}


export class ReturnApprove {
    sourceId: string; // 单据号
    sourceType: string; // 单据类型
    selectedValue = ''; // 审批操作
    approvalComment = ''; // 审批备注
    approverId: string; // 审批人
    nodeName: string; // 节点名称
    approvalActive: string; // 动作
    createdBy: string; // 申请人
}
