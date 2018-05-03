import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { DfHTTP } from '../../../../../app.network.service';
import { NetworkConfig } from '../../../../../app.service';
import { PromotionsSave } from '../models/promotions.model';

@Injectable()

export class PromotionsService {
    constructor(private dfHTTP: DfHTTP) { }

    savePromotions(params: PromotionsSave) {
        return this.dfHTTP.post(NetworkConfig.path.savePromotions, params, 'Y').map((res: any) => {
            return res;
        }, (error) => {
            return error;
        });
    }

    submitPromotions(params: PromotionsSave) {
        return this.dfHTTP.post(NetworkConfig.path.submitPromotions, params, 'Y').map((res: any) => {
            return res;
        }, (error) => {
            return error;
        });
    }
}
