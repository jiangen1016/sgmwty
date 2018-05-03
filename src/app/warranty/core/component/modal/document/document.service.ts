import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { DfHTTP } from '../../../../../app.network.service';
import { NetworkConfig } from '../../../../../app.service';
import { DocumentSave } from '../models/document.model';

@Injectable()

export class DocumentService {
    constructor(private dfHTTP: DfHTTP) { }

    saveDocument(params: DocumentSave) {
        return this.dfHTTP.post(NetworkConfig.path.saveDocument, params, 'Y').map((res: any) => {
            return res;
        }, (error) => {
            return error;
        });
    }

    submitDocument(params: DocumentSave) {
        return this.dfHTTP.post(NetworkConfig.path.submitDocument, params, 'Y').map((res: any) => {
            return res;
        }, (error) => {
            return error;
        });
    }

    getManagerInfo(params) {
        return this.dfHTTP.post(NetworkConfig.path.getManage, params).map((res: any) => {
            return res;
        }, (error) => {
            return error;
        });
    }
}
