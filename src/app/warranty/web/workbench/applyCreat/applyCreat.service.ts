import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { DfHTTP } from '../../../../app.network.service';
import { NetworkConfig } from '../../../../app.service';
import { LocalStorage } from '../../../core/component/localStorage/localStorage.component';

@Injectable()

export class ApplyCreatService {
    constructor(
        private ls: LocalStorage,
        private dfHTTP: DfHTTP,
    ) { }

    getCreatList() {
        const params = {
            languageCode: this.ls.get('language')
        };
        return this.dfHTTP.post(NetworkConfig.path.getCreateList, params).map((res: any) => {
            return res;
        }, (error) => {
            return error;
        });
    }
}
