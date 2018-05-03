import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { DfHTTP } from '../../../../app.network.service';
import {
    WordConfigRequest, WordConfigResponse,
    WordConfigListResponse, WordConfigDeleteRequest,
    WordConfigDeleteResponse
} from '../models/wordConfigModel';
import { NetworkConfig } from '../../../../app.service';

@Injectable()
export class WordConfigService {
    constructor(
        private dfHTTP: DfHTTP
    ) { }

    /** 获取字典配置列表
     * zw 2017年11月16日15:52:27
     * @param params
     * @memberof WordConfigService
     */
    getWordConfigs(urlParams, params): Observable<WordConfigListResponse> {
        return this.dfHTTP.pagePost(NetworkConfig.path.getLookupTypeInfoByParameter,
            urlParams, params, 'Y').map((res: WordConfigListResponse) => {
                return res;
            }, (error) => {
                return error;
            });
    }

    /** 删除字典配置列表
     * zw 2017年11月16日15:52:27
     * @param params
     * @memberof WordConfigService
     */
    deleteWordConfigs(urlParams, params: WordConfigDeleteRequest): Observable<WordConfigDeleteResponse> {
        return this.dfHTTP.pagePost(NetworkConfig.path.deleteLookupTypeInfo,
            urlParams, params, 'Y').map((res: WordConfigDeleteResponse) => {
                return res;
            }, (error) => {
                return error;
            });
    }

    /** 维护字典配置
     * zw 2017年11月16日15:52:27
     * @param params
     * @memberof WordConfigService
     */
    mergeWordConfig(params: WordConfigRequest): Observable<WordConfigResponse> {
        return this.dfHTTP.post(NetworkConfig.path.insertOrUpdateWord, params, 'Y').map((res: WordConfigResponse) => {
            return res;
        }, (error) => {
            return error;
        });
    }
}
