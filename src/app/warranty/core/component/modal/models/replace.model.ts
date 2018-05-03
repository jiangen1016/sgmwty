export class ReplaceSave {
    documentNumber: string;
    title: string;
    createdBy?: any;
    creatorName: string;    
    creationDate: number;
    phone?: any;
    quantity: number;
    remark?: any;
    status: string;
    bpmInstanceId?: any;
    documentType?: any;
    brandCode?: any;
    chId: number;
}


export class ReplaceApprove {
    sourceId: string;//单据号
    sourceType: string;//单据类型
    selectedValue: string = "";//审批操作
    approvalComment: string = "";//审批备注
    approverId: string;//审批人
    nodeName: string;//节点名称    
    approvalActive: string;//动作
    createdBy: string;//申请人
}
