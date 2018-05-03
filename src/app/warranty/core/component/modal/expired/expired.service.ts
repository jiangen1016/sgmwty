import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { DfHTTP } from '../../../../../app.network.service';
import { NetworkConfig } from '../../../../../app.service';
import { ExpiredSave } from '../models/expired.model';

@Injectable()

export class ExpiredService {
    constructor(private dfHTTP: DfHTTP) { }

    saveExpired(params: ExpiredSave) {
        return this.dfHTTP.post(NetworkConfig.path.saveExpired, params, 'Y').map((res: any) => {
            return res;
        }, (error) => {
            return error;
        });
    }

    submitExpired(params: ExpiredSave) {
        return this.dfHTTP.post(NetworkConfig.path.submitExpired, params, 'Y').map((res: any) => {
            return res;
        }, (error) => {
            return error;
        });
    }
}
