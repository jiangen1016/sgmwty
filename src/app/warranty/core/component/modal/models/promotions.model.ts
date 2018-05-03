export class PromotionsSave {
    documentNumber: string;
    title: string;
    createdBy: string;
    creatorName: string;
    creationDate: string;
    phone?: any;
    remark?: any;
    amount: number;
    prNo: string;
    status: string;
    bpmInstanceId: number;
    documentType: string;
    suId: number;
    brandCode: string;
}


export class PromotionApprove {
    sourceId: string; // 单据号
    sourceType: string; // 单据类型
    selectedValue = ''; // 审批操作
    approvalComment = ''; // 审批备注
    approverId: string; // 审批人
    nodeName: string; // 节点名称
    approvalActive: string; // 动作
    createdBy: string; // 申请人
}

