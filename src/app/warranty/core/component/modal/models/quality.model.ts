export class QualitySave {
    documentNumber?: any;
    title: string;
    createdBy?: any;
    creatorName: string;
    creationDate?: any;
    phone?: any;
    remark?: any;
    desQuantity: number;
    customerCode?: any;
    status?: any;
    bpmInstanceId?: any;
    documentType?: any;
    deId: number;
}

export class QualityApprove {
    sourceId: string; // 单据号
    sourceType: string; // 单据类型
    selectedValue = ''; // 审批操作
    approvalComment = ''; // 审批备注
    approverId: string; // 审批人
    nodeName: string; // 节点名称
    approvalActive: string; // 动作
    createdBy: string; // 申请人
}
