import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { DfHTTP } from '../../../../../app.network.service';
import { error } from 'util';
import { RoleMemberListResponse, RoleMemberDeleteRequest, RoleMemberDeleteResponse, RoleMemberRequest, RoleMemberResponse, EmployeeInfoResponse, RoleMember } from '../../models/roleConfigModel';
import { NetworkConfig } from '../../../../../app.service';
import { LocalStorage } from '../../../../core/component/localStorage/localStorage.component';

@Injectable()
export class RoleMemberService {
    constructor(
        private dfHTTP: DfHTTP,
        private ls: LocalStorage
    ) {

    }

    /** 获取角色成员列表
     * zw 2017年11月20日09:34:44
     * @param urlParams params
     * @memberof RoleMemberService
     */
    getRoleMembers(urlparams, params) {
        return this.dfHTTP.pagePost(NetworkConfig.path.getTsMemberList,
            urlparams, params, 'Y').map((res: RoleMemberListResponse) => {
                return res;
            }, (error) => {
                return error;
            });
    }

    /** 删除角色成员列表
     * zw 2017年11月16日15:52:27
     * @param params
     * @memberof RoleMemberService
     */
    deleteRoleMembers(urlParams, params: RoleMemberDeleteRequest): Observable<RoleMemberDeleteResponse> {
        return this.dfHTTP.pagePost(NetworkConfig.path.deleteRoleMemberInfo, urlParams, params, 'Y')
            .map((res: RoleMemberDeleteResponse) => {
                return res;
            }, (error) => {
                return error;
            });
    }

    /** 新增 角色成员
     * zw 2017年11月16日15:52:27
     * @param params
     * @memberof RoleMemberService
     */
    mergeRoleMember(params: RoleMember): Observable<RoleMemberResponse> {
        return this.dfHTTP.post(NetworkConfig.path.mergeRoleMemberInfo, params, 'Y').map((res: RoleMemberResponse) => {
            return res;
        }, (error) => {
            return error;
        });
    }

    /** 新增 角色成员
     * zw 2017年11月16日15:52:27
     * @param params
     * @memberof RoleMemberService
     */
    updateRoleMember(params: RoleMember): Observable<RoleMemberResponse> {
        return this.dfHTTP.post(NetworkConfig.path.updaterolememberinfo, params, 'Y').map((res: RoleMemberResponse) => {
            return res;
        }, (error) => {
            return error;
        });
    }

    /** 维护角色成员  得到所有的
     * zw 2017年11月16日15:52:27
     * @param params
     * @memberof RoleMemberService
     */
    getEmployeeInfo(urlParams, params) {
        return this.dfHTTP.pagePost(NetworkConfig.path.getEmployeeInfo,
            urlParams, params, 'Y').map((res: EmployeeInfoResponse) => {
                return res;
            }, (error) => {
                return error;
            });
    }

    /**
     * 获取流程列表
     * zw 2017年11月25日15:27:42
     */
    getDocunmentCodeList() {
        const params = {
            'languageCode': this.ls.get('language')
        };
        return this.dfHTTP.get(NetworkConfig.paths.getMyCeratList, params).map((res) => {
            return res;
        }, (error) => {
            return error;
        });
    }

    /**
     * 获取所有流程
     * jiagnen  2017年12月25日16:09:12
     * @memberof EntrustNewService
     */
    getProcess() {
        return this.dfHTTP.get(NetworkConfig.paths.getProcess, 'Y').map((data) => {
            return data;
        }, (error) => {
            return error;
        })
    }
}
