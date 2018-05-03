import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { DfHTTP } from '../../../../../app.network.service';
import { NetworkConfig } from '../../../../../app.service';
import { ReplaceSave } from '../models/replace.model';

@Injectable()

export class ReplaceService {
    constructor(private dfHTTP: DfHTTP) { }

    saveReplace(params: ReplaceSave) {
        return this.dfHTTP.post(NetworkConfig.path.saveReplace, params, 'Y').map((res: any) => {
            return res;
        }, (error) => {
            return error;
        });
    }

    submitReplace(params: ReplaceSave) {
        return this.dfHTTP.post(NetworkConfig.path.submitReplace, params, 'Y').map((res: any) => {
            return res;
        }, (error) => {
            return error;
        });
    }
}
