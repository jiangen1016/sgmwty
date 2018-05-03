import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { DfHTTP } from '../../../../app.network.service';
import { NetworkConfig } from '../../../../app.service';

@Injectable()

export class HandleBillService {
    constructor(
        private dfHTTP: DfHTTP
    ) {
    }

    /**
     * 获取单据处理表格信息
     * jiangen 2017年11月25日17:34:19
     * @param {any} params
     * @returns
     * @memberof HandleBillService
     */
    getHandleBillData(urlParmas, params) {
        return this.dfHTTP.pagePost(NetworkConfig.path.getHandleBillsList, urlParmas, params, 'Y').map((data) => {
            return data;
        }, (error) => {
            return error;
        });
    }

    handleBillExport(params) {
        return this.dfHTTP.post(NetworkConfig.paths.exportApproveList, params, 'Y').map((data) => {
            return data;
        }, (error) => {
            return error;
        });
    }
}
