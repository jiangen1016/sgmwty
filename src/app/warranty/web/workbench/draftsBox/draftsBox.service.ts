import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { DfHTTP, } from '../../../../app.network.service';
import { NetworkConfig } from '../../../../app.service';

@Injectable()

export class DraftsBoxService {
    constructor(
        private dfHTTP: DfHTTP
    ) {
    }

    /**
     * 获取草稿箱列表
     * jiangen 2017年11月23日10:11:00
     * @param {any} urlParams  分页参数
     * @param {any} params   查询参数
     * @returns  草稿箱列表
     * @memberof DraftsBoxService
     */
    getDraftsBoxData(urlParams, params) {
        return this.dfHTTP.pagePost(NetworkConfig.path.getDraftsBoxList, urlParams, params, 'Y').map((data) => {
            return data;
        }, (error) => {
            return error;
        });
    }

    /**
     * 删除草稿箱数据
     * jiangen 2017年11月23日11:29:49
     * @param {any} params   删除的参数 receiptType、 documentNumber
     * @returns  返回结果
     * @memberof DraftsBoxService
     */
    deleteDraftBox(params) {
        return this.dfHTTP.get(NetworkConfig.path.deleteDraftsBoxItem, params, 'Y').map((data) => {
            return data;
        }, (error) => {
            return error;
        });
    }
}
