import { Injectable } from '@angular/core';
import { Http, RequestOptionsArgs, RequestOptions, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { NetworkConfig } from '../../../app.service';
import { DfHTTP } from '../../../app.network.service';

@Injectable()
export class AttachmentService {
    private headers: Headers;
    private options: RequestOptions;
    private url: string;
    private timeout = 30000;

    constructor(
        private http: Http,
        private dfHTTP: DfHTTP
    ) {
        this.headers = new Headers();
        this.headers.set('Content-Type', 'multipart/form-data');
    }

    /**
     * 添加附件跟单据号关联
     * zw 2017年11月28日16:51:56
     * @param params
     */
    addAttachmentInfo(params) {

        return this.dfHTTP.post(NetworkConfig.path.addAttachmentInfo, params).map((res) => {
            return res;
        }, (error) => {
            return error;
        });
    }

    /**
     * 下载文件
     *
     * @param {string} docUrl
     * @memberof AttachmentService
     */
    downloadFile(docUrl: string): void {
        // docUrl = NetworkConfig.domain + NetworkConfig.paths.fileDownload + '?attachmentName=' + docUrl;
        try {
            const aLink = document.createElement('a');
            aLink.href = docUrl;
            document.body.appendChild(aLink);
            aLink.click();
            document.body.removeChild(aLink);
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * 获取附件列表
     * zw 2017年11月28日18:33:47
     * @param params
     */
    getAttachmentInfo(urlParmas) {
        return this.dfHTTP.post(NetworkConfig.path.getuploadFiles, urlParmas).map((res) => {
            return res;
        }, (error) => {
            return error;
        });
    }

    getOtherAttachmentInfo(urlParmas) {
        return this.dfHTTP.post(NetworkConfig.path.getOtherFiles, urlParmas).map((res) => {
            return res;
        }, (error) => {
            return error;
        });
    }

    getReturnLast(paramsList) {
        return this.dfHTTP.forkPost(paramsList).map((res) => {
            return res;
        }, (error) => {
            return error;
        });
    }

    /**
     * 删除文件
     *
     * @param {number}
     * @returns {Observable<DmHttpResponse>}
     * @memberof AttachmentService
     */
    deleteFile(params) {
        return this.dfHTTP.get(NetworkConfig.path.deleteFile, params).map((res) => {
            return res;
        }, (error) => {
            return error;
        });
    }

    getQuarterlyInfo(params) {
        return this.dfHTTP.post(NetworkConfig.path.getQuarterlyInfo, params).map((res: any) => {
            return res;
        }, (error) => {
            return error;
        });
    }

    getSuoPeiFiles(params) {
        return this.dfHTTP.post(NetworkConfig.path.getSuoPeiFiles, params).map((res: any) => {
            return res;
        }, (error) => {
            return error;
        });
    }

    getAllSummary(paramsList) {
        return this.dfHTTP.forkPost(paramsList).map((res: any) => {
            return res;
        }, (error) => {
            return error;
        });
    }
}

export class Attachment {
    attachmentId: number;
    attachmentName: string;
    sourceId: number;
    sourceType: string;
    downloadUrl: string;
    createdBy: string;
    creationDate: Date;
    aliasName: string;
}

export class GetAttachmentRequest {
    sourceId: number;
    sourceType: string;
    pageNum: 1;
}

export class UploadAttachmentResult {
    code: string;
    docId: number;
    docUrl: string;
    docPreviewUrl: string;
    docName: string;
    docType: string;
    suffix: string;
    orgId: number;
    orgName: string;
    inDate: string;
}

export class UploadAttachmentResponse extends Response {
    code: string;
    devMsg: string;
    userMsg: string;
    data: UploadAttachmentResult;
}
