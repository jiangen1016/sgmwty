import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { DfHTTP } from '../../../../../app.network.service';
import { NetworkConfig } from '../../../../../app.service';
import { QualitySave } from '../models/quality.model';

@Injectable()

export class QualityService {
    constructor(private dfHTTP: DfHTTP) { }

    saveQualitySave(params: QualitySave) {
        return this.dfHTTP.post(NetworkConfig.path.saveQuality, params, 'Y').map((res: any) => {
            return res;
        }, (error) => {
            return error;
        });
    }

    submitQualitySave(params: QualitySave) {
        return this.dfHTTP.post(NetworkConfig.path.submitQuality, params, 'Y').map((res: any) => {
            return res;
        }, (error) => {
            return error;
        });
    }
}
