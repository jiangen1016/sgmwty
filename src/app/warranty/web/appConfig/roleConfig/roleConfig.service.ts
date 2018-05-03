import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { DfHTTP } from '../../../../app.network.service';
import { error } from 'util';
import { RoleConfigListResponse, RoleConfigDeleteRequest, RoleConfigDeleteResponse, RoleConfigRequest, RoleConfigResponse } from '../models/roleConfigModel';
import { NetworkConfig } from '../../../../app.service';

@Injectable()
export class RoleConfigService {
    constructor(
        private dfHTTP: DfHTTP
    ) { }

    /** 获取角色配置列表
     * zw 2017年11月20日09:34:44
     * @param urlParams params
     * @memberof RoleConfigService
     */
    getRoleConfigs(urlParams, params) {
        return this.dfHTTP.pagePost(NetworkConfig.path.getRoleList,
            urlParams, params, 'Y').map((res: RoleConfigListResponse) => {
                return res;
            }, (error) => {
                return error;
            });
    }

    /** 删除角色配置列表
     * zw 2017年11月16日15:52:27
     * @param params
     * @memberof RoleConfigService
     */
    deleteRoleConfigs(urlParams, params: RoleConfigDeleteRequest) {
        return this.dfHTTP.pagePost(NetworkConfig.path.deleteRoleInfo,
            urlParams, params, 'Y').map((res: RoleConfigDeleteResponse) => {
                return res;
            }, (error) => {
                return error;
            });
    }

    /** 维护角色配置
     * zw 2017年11月16日15:52:27
     * @param params
     * @memberof RoleConfigService
     */
    mergeRoleConfig(params: RoleConfigRequest) {
        return this.dfHTTP.post(NetworkConfig.path.mergeRoleInfo, params, 'Y').map((res: RoleConfigResponse) => {
            return res;
        }, (error) => {
            return error;
        });
    }
}
