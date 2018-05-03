import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { DfHTTP } from '../../../app.network.service';
import { NetworkConfig } from '../../../app.service';

@Injectable()

export class AccessService {
    constructor(
        private dfHTTP: DfHTTP
    ) {
    }

    getAcessInfo(params) {
        const accessUrl = 'dreamsitowsp/dreamsitoAuth?' + params;
        return this.dfHTTP.get(accessUrl).map((data) => {
            return data;
        }, (error) => {
            return error;
        });
    }
}
