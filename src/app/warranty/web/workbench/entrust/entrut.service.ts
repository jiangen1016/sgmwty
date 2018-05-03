import { Injectable } from '@angular/core';
import { NetworkConfig } from '../../../../app.service';
import { DfHTTP } from '../../../../app.network.service';
@Injectable()

export class EntrustService {
    constructor(
        private dfHTTP: DfHTTP
    ) { }

    /**
     * 外出授权 - 查询列表
     * @returns
     * @memberof EntrustService
     */
    search(urlParams, params) {
        return this.dfHTTP.pagePost(NetworkConfig.path.searchEmpowerment, urlParams, params, 'Y').map((data) => {
            return data;
        }, (error) => {
            return error;
        });
    }

    /**
     * 外出授权 - 删除
     * jiangne  2017年12月21日19:52:49
     * @param {any} urlParams
     * @returns
     * @memberof EntrustService
     */
    deleteEntrust(urlParams) {
        return this.dfHTTP.get(NetworkConfig.path.deleteEmpowerment, urlParams, 'Y').map((data) => {
            return data;
        }, (error) => {
            return error;
        });
    }
}
