import { Injectable } from '@angular/core';
import {
    WordConfigValueListResponse, WordConfigValueDeleteRequest,
    WordConfigValueDeleteResponse, WordConfigValueRequest, WordConfigValueResponse
} from '../../models/wordConfigModel';
import { Observable } from 'rxjs/Observable';
import { DfHTTP } from '../../../../../app.network.service';
import { NetworkConfig } from '../../../../../app.service';

@Injectable()
export class WordConfigValueService {

    constructor(private dfHTTP: DfHTTP) { }

    /** 获取字典配置明细列表
     * zw 2017年11月16日15:52:27
     * @param params
     * @memberof WordConfigService
     */
    getWordConfigValues(urlParams, params): Observable<WordConfigValueListResponse> {
        return this.dfHTTP.pagePost(NetworkConfig.path.getLookupValueInfo,
            urlParams, params, 'Y').map((res: WordConfigValueListResponse) => {
                return res;
            }, (error) => {
                return error;
            });
    }

    /** 删除字典配置明细列表
     * zw 2017年11月16日15:52:27
     * @param params
     * @memberof WordConfigService
     */
    deleteWordConfigValue(urlParams, params: WordConfigValueDeleteRequest): Observable<WordConfigValueDeleteResponse> {
        return this.dfHTTP.pagePost(NetworkConfig.path.deleteLookupValueInfo,
            urlParams, params, 'Y').map((res: WordConfigValueDeleteResponse) => {
                return res;
            }, (error) => {
                return error;
            });
    }

    /** 维护字典配置明细
     * zw 2017年11月16日15:52:27
     * @param params
     * @memberof WordConfigService
     */
    mergeWordConfigValue(params: WordConfigValueRequest): Observable<WordConfigValueResponse> {
        return this.dfHTTP.post(NetworkConfig.path.mergeLookupValueInfo,
            params, 'Y').map((res: WordConfigValueResponse) => {
                return res;
            }, (error) => {
                return error;
            });
    }
}
