import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { DfHTTP } from '../../../../app.network.service';
import { NetworkConfig } from '../../../../app.service';
@Injectable()

export class ApplyTrackService {
    constructor(
        private dfHTTP: DfHTTP
    ) {
    }

    /**
     * 获取申请单跟踪 数据详情
     * jiangen  2017年11月18日10:57:26
     * @param {any} params  请求参数
     * @returns  申请单跟踪数据
     * @memberof ApplyTrackService
     */
    getApplyTrackData(urlParams, params) {
        return this.dfHTTP.pagePost(NetworkConfig.path.getApplyTrackList, urlParams, params, 'Y').map((data) => {
            return data;
        }, (error) => {
            return error;
        });
    }
}
