import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { DfHTTP } from '../../../app.network.service';
import { NetworkConfig } from '../../../app.service';

@Injectable()

export class AdminService {
    constructor(
        private dfHTTP: DfHTTP
    ) {
    }
}
