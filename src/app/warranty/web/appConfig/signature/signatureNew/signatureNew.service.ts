import { Injectable } from '@angular/core';
import { NetworkConfig } from '../../../../../app.service';
import { DfHTTP } from '../../../../../app.network.service';
@Injectable()

export class SignatureNewService {
    constructor(
        private dfHTTP: DfHTTP
    ) {
    }

    /**
     * 签名配置 - 获取角色列表
     * jiangen  2018年1月11日10:07:48
     * @param {any} urlParams
     * @returns
     * @memberof SignatureNewService
     */
    getRoleList(urlParams) {
        return this.dfHTTP.pagePost(NetworkConfig.path.getRoleList, urlParams, {}, 'Y').map((data) => {
            return data;
        }, (error) => {
            return error;
        });
    }

    /**
     *  获取对应角色成员
     * jiangen  2018年1月11日13:43:10
     * @param {any} urlParams
     * @returns
     * @memberof SignatureNewService
     */
    getRoleMemberList(Params) {
        return this.dfHTTP.get(NetworkConfig.path.getRoleMemberByRoleCode, Params, 'Y').map((data) => {
            return data;
        }, (error) => {
            return error;
        });
    }

    // role list
    getRoleConfigs(urlParams) {
        return this.dfHTTP.pagePost(NetworkConfig.path.getRoleList,
            urlParams, {}, 'Y').map((res) => {
                return res;
            }, (error) => {
                return error;
            });
    }

    /**
     * 签名配置 - 保存
     * jiangen 2018年1月12日16:41:47
     * @param {any} urlParams  token
     * @param {any} params  附件信息
     * @returns
     * @memberof SignatureNewService
     */
    saveSignature(urlParams, params) {
        return this.dfHTTP.pagePost(NetworkConfig.path.addSignature, urlParams, params, 'Y').map((data) => {
            return data;
        }, (error) => {
            return error;
        });
    }

    /**
     * 签名设置 - 更新
     * jiangen  2018年1月16日16:23:57
     * @param {any} urlParams
     * @param {any} params
     * @returns
     * @memberof SignatureNewService
     */
    updateSignature(urlParams, params) {
        return this.dfHTTP.pagePost(NetworkConfig.path.updateSignature, urlParams, params, 'Y').map((data) => {
            return data;
        }, (error) => {
            return error;
        });
    }

    /**
     * 签名配置- 查询一个
     * jiangen  2018年1月16日14:37:53
     * @param {any} params
     * @returns
     * @memberof SignatureNewService
     */
    selectOneSignature(params) {
        return this.dfHTTP.post(NetworkConfig.path.selectOneSignature, params, 'Y').map((data) => {
            return data;
        }, (error) => {
            return error;
        });
    }
}
