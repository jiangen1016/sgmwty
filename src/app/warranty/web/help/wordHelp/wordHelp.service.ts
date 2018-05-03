import { Injectable } from '@angular/core';
import { DfHTTP } from '../../../../app.network.service';
import { NetworkConfig } from '../../../../app.service';

@Injectable()
export class WordHelpService {

    constructor(
        private dfHTTP: DfHTTP
    ) { }



    /**
     * 获取帮助文档列表
     * zw 2017年11月25日14:23:13
     * @param urlParams
     * @param params
     */
    getHelpDocumentList(urlParams, params) {
        return this.dfHTTP.pagePost(NetworkConfig.path.getHelpList, urlParams, params, 'Y').map((res) => {
            return res;
        }, (error) => {
            return error;
        });
    }

    /**
     * 删除帮助文档
     * zw 2017年11月25日14:23:41
     * @param params
     */
    deleteHelpDocument(params) {
        return this.dfHTTP.post(NetworkConfig.path.deleteHelpFiles, params, 'Y').map((res) => {
            return res;
        }, (error) => {
            return error;
        });
    }


    /**
     * 添加帮助文档
     * zw 2017年11月25日14:23:41
     * @param params
     */
    addHelpDocument(params) {
        return this.dfHTTP.post(NetworkConfig.path.uploadFiles, params).map((res) => {
            return res;
        }, (error) => {
            return error;
        });
    }

    /**
     *
     * @param params 下载文档
     */
    downloadDocument(urlParams) {
        return this.dfHTTP.pagePost(NetworkConfig.paths.fileDownload, urlParams).map((res) => {
            return res;
        }, (error) => {
            return error;
        });
    }
}
