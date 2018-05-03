import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { DfHTTP } from '../../../../../app.network.service';
import { NetworkConfig } from '../../../../../app.service';
import { ReturnSave } from '../models/return.model';

@Injectable()

export class ReturnService {
    constructor(private dfHTTP: DfHTTP) { }

    saveReturn(params: ReturnSave) {
        return this.dfHTTP.post(NetworkConfig.path.saveReturn, params, 'Y').map((res: any) => {
            return res;
        }, (error) => {
            return error;
        });
    }

    submitReturn(params: ReturnSave) {
        return this.dfHTTP.post(NetworkConfig.path.submitReturn, params, 'Y').map((res: any) => {
            return res;
        }, (error) => {
            return error;
        });
    }
}
