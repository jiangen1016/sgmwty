import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { DfHTTP, } from '../../../../../app.network.service';
import { NetworkConfig } from '../../../../../app.service';

@Injectable()

export class EntrustNewService {
    constructor(
        private dfHTTP: DfHTTP
    ) {
    }

    /**
     * 保存外出授权
     * jiagnen  2017年12月21日15:51:08
     * @param {any} params
     * @returns
     * @memberof EntrustNewService
     */
    saveEmpowerment(urlParams, params) {
        return this.dfHTTP.pagePost(NetworkConfig.path.saveEmpowerment, urlParams, params, 'Y').map((data) => {
            return data;
        }, (error) => {
            return error;
        });
    }

    /**
     * 外出授权 - 更新
     * jiangen  2017年12月22日11:33:29
     * @param {any} params
     * @returns
     * @memberof EntrustNewService
     */
    updateEntrust(urlParams, params) {
        return this.dfHTTP.pagePost(NetworkConfig.path.updateOneEmpowerment, urlParams, params, 'Y').map((data) => {
            return data;
        }, (error) => {
            return error;
        });
    }

    /**
     * 获取 能授权的人员信息
     * jiangen 2017年12月21日16:27:51
     * @returns
     * @memberof EntrustNewService
     */
    getRoleMenberList() {
        return this.dfHTTP.get(NetworkConfig.path.getRoleMenberList).map((data) => {
            return data;
        }, (error) => {
            return error;
        });
    }


    /**
     * 外出授权 - 查询详情
     * jiangen  2017年12月22日10:52:27
     * @param {any} params
     * @returns
     * @memberof EntrustNewService
     */
    getDetails(params) {
        return this.dfHTTP.get(NetworkConfig.path.empowermentDetais, params).map((data) => {
            return data;
        }, (error) => {
            return error;
        });
    }
}
