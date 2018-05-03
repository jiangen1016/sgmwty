export class DocumentSave {
    documentNumber: string;
    title: string;
    createdBy?: any;
    creatorName: string;
    creationDate: string;
    phone?: any;
    remark?: any;
    lineManagerUid?: any;
    lineManagerName: string;
    stockClaimsAgentUid?: any;
    stockClaimsAgentName: string;
    seniorManagerClaimUid?: any;
    seniorManagerClaimName?: string;
    tecnicalDirectorClaimUid?: string;
    tecnicalDirectorClaimName?: string;
    asGeneralDirectorUid?: string;
    asGeneralDirectorName?: string;
    status: string;
    bpmInstanceId?: any;
    documentType?: any;
    prcId: number;
    creationDept?: any;
}

export class HistoryData {
    historyList: Array<any>;
    historyTotal: number;
}

export class Manage {
    managerUid: string; // 主管ID
    displayName: string; // 主管 name
}

export class DocumentApprove {
    sourceId: string; // 单据号
    sourceType: string; // 单据类型
    selectedValue: String = ''; // 审批操作
    approvalComment: String = ''; // 审批备注
    approverId: string; // 审批人
    nodeName: string; // 节点名称
    approvalActive: string; // 动作
    createdBy: string; // 申请人
}

