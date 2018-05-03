import { Injectable } from '@angular/core';
import { DfHTTP } from '../../../../../app.network.service';
import { NetworkConfig } from '../../../../../app.service';

@Injectable()

export class SummaryService {
    constructor(private dfHttp: DfHTTP) { }

    getTableBySize(params) {
        return this.dfHttp.post(NetworkConfig.path.getAllSummary, params).map((res: any) => {
            return res;
        }, (error) => {
            return error;
        });
    }

    updateSummary(params) {
        return this.dfHttp.post(NetworkConfig.path.updateSummary, params).map((res: any) => {
            return res;
        }, (error) => {
            return error;
        });
    }
}
