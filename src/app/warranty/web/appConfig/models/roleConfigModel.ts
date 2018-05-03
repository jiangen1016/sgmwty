import { Response } from '@angular/http';

/**
 * 角色配置
 * zengwei 2017年11月20日09:44:19
 * @export
 * @class RoleConfig
 */
export class RoleConfig {
    roleId?: number;
    roleCode: String;
    roleName: String;
}

/**
 * 获取角色配置列表 分页
 * zengwei 2017年11月20日09:44:26
 * @export
 * @class RoleMemberListPage
 */
export class RoleConfigListPage {
    pageNum: number;
    pageSize: number;
    languageCode: string;
}

/**
 * 获取角色配置列表 查询
 * zengwei 2017年11月18日16:25:18
 * @export
 * @class RoleConfigListSearch
 */
export class RoleConfigListSearch {
    roleCode: String;
    roleName: String;
}

/**
 * 获取角色配置列表返回参数
 * zengwei 2017年11月16日15:33:34
 * @export
 * @class RoleConfigListResponse
 */
export class RoleConfigListResponse extends Response {
    code: string;
    msg: string;
    data: any;
}

/**
 * 删除角色配置请求参数
 * zengwei 2017年11月20日09:47:00
 * @export
 * @class RoleConfigDeleteRequest
 */
export class RoleConfigDeleteRequest {
    roleId: number;
}

/**
 * 删除角色配置返回参数
 * zengwei 2017年11月20日09:47:06
 * @export
 * @class RoleConfigDeleteResponse
 */
export class RoleConfigDeleteResponse {
    code: String;
    msg: String;
}

/**
 * 维护角色配置请求参数
 * zengwei 2017年11月20日09:47:18
 * @export
 * @class RoleConfigRequest
 */
export class RoleConfigRequest {
    roleId?: number;
    roleCode: String;
    roleName: String;
    enabledFlag: String;
    createdBy: string;
    creationDate: any;
    lastUpdateDate: any;
    lastUpdatedBy: number;
}

/**
 * 维护角色配置返回参数
 * zengwei 2017年11月16日15:33:34
 * @export
 * @class RoleConfigResponse
 */
export class RoleConfigResponse extends Response {
    code: String;
    msg: String;
}

/**
 * 角色成员
 * zengwei 2017年11月20日15:51:46
 * @export
 * @class RoleMember
 */
export class RoleMember {
    userName: string;
    userUid: string;
    departmentName: string;
    empId: string;
    roleId: number;
    roleName: string;
    enabledFlag: string;
    createdBy: string;
    lastUpdatedBy: string;
    memberId?: number;
    // memberId?: number;
    // userUid: string;
    // userName: string;
    // roleId: number;
    // roleCode: string;
    // displayName: String;
    // roleName: string;
    // documentCode = '';
    // documentName = '';
}

/**
 * 获取角色成员列表 分页
 * zengwei 2017年11月20日15:51:50
 * @export
 * @class RoleMemberListPage
 */
export class RoleMemberListPage {
    pageNum: number;
    pageSize: number;
    languageCode: string;
    userName: string;
    roleId: number;
}

/**
 * 获取角色成员明细列表请求参数
 * zengwei 2017年11月16日15:33:34
 * @export
 * @class RoleMemberListRequest
 */
export class RoleMemberListSearch {
    roleInfo: RoleConfigRequest;
    userName: string;
    documentName: string;
}

/**
 * 获取角色成员明细列表返回参数
 * zengwei 2017年11月18日14:18:09
 * @export
 * @class RoleMemberListResponse
 */
export class RoleMemberListResponse extends Response {
    code: string;
    msg: string;
    data: any;
    total?: any;
}

/**
 * 删除角色成员明细请求参数
 * zengwei 2017年11月18日14:19:20
 * @export
 * @class RoleMemberDeleteRequest
 */
export class RoleMemberDeleteRequest {
    // userUid: String;
    memberId: number;
}

/**
 * 删除角色成员明细返回参数
 * zengwei 2017年11月18日14:19:24
 * @export
 * @class RoleMemberDeleteResponse
 */
export class RoleMemberDeleteResponse {
    code: String;
    msg: String;
}

/**
 * 维护角色成员明细请求参数
 * zengwei 2017年11月16日15:33:34
 * @export
 * @class RoleMemberRequest
 */
export class RoleMemberRequest {
    roleInfo: RoleConfigRequest;
    memberId?: number;
    userUid: String;
    userName: String;
    displayName: String;
    documentCode: String;
    enabledFlag: String;
    createdBy: number;
    creationDate: any;
    lastUpdateDate: any;
    lastUpdatedBy: number;
}

/**
 * 维护角色成员明细返回参数
 * zengwei 2017年11月16日15:33:34
 * @export
 * @class RoleMemberResponse
 */
export class RoleMemberResponse extends Response {
    code: String;
    msg: String;
}


export class EmpInfoListPage {
    pageNum: number;
    pageSize: number;
}


export class EmpInfoListSearch {
    empUid: String;
    cnName: String;
}


export class EmployeeInfoResponse extends Response {
    code: String;
    msg: String;
    data: any;
}
