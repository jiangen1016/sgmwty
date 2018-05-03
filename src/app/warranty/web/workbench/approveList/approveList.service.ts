import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { DfHTTP } from '../../../../app.network.service';
import { NetworkConfig } from '../../../../app.service';

@Injectable()

export class ApproveListService {

    constructor(
        private dfHTTP: DfHTTP
    ) {

    }
    /**
     * 获取审批列表详情
     * jiangen 2017年11月17日14:26:00
     * @param {any} params
     * @returns  {any}
     * @memberof ApproveListService
     */
    getApproveList(urlParams, params) {
        return this.dfHTTP.pagePost(NetworkConfig.path.getApproveList, urlParams, params, 'Y').map((res: any) => {
            return res;
        }, (error) => {
            return error;
        });
    }

}
