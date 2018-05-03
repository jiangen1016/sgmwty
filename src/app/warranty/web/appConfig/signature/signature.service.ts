import { Injectable } from '@angular/core';
import { NetworkConfig } from '../../../../app.service';
import { DfHTTP } from '../../../../app.network.service';
@Injectable()

export class SignatureService {
    constructor(
        private dfHTTP: DfHTTP
    ) { }

    /**
     * 签名配置 - 查询列表
     * jiangen  2018年1月10日14:49:45
     * @returns
     * @memberof EntrustService
     */
    search(urlParams, params) {
        return this.dfHTTP.pagePost(NetworkConfig.path.getSignatureList, urlParams, params, 'Y').map((data) => {
            return data;
        }, (error) => {
            return error;
        });
    }

    /**
     * 获取角色列表
     * jiangen   2018年1月16日09:50:03
     * @returns
     * @memberof SignatureService
     */
    getRoleList(urlParams) {
        return this.dfHTTP.pagePost(NetworkConfig.path.getRoleList, urlParams, {}, 'Y').map((data) => {
            return data;
        }, (error) => {
            return error;
        });
    }

    deleteSignature(urlParams, params) {
        return this.dfHTTP.pagePost(NetworkConfig.path.deleteSignature, urlParams, params, 'Y').map((data) => {
            return data;
        }, (error) => {
            return error;
        });
    }
}
