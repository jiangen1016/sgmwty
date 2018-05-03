import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { DfHTTP } from '../../../../app.network.service';
import { NetworkConfig } from '../../../../app.service';

@Injectable()

export class MyapplyService {
    constructor(
        private dfHTTP: DfHTTP
    ) {
    }

    /**
     * 获取我的申请  表格信息
     * jiangen  2017年11月25日11:18:27
     * @param {any} urlParams  分页的地址
     * @param {any} params   查询参数
     * @returns   表格信息
     * @memberof MyapplyService
     */
    getMyapplyData(urlParams, params) {
        return this.dfHTTP.pagePost(NetworkConfig.path.getMyApply, urlParams, params, 'Y').map((data) => {
            return data;
        }, (error) => {
            return error;
        })
    }
}
