import { Injectable } from '@angular/core';
import { DfHTTP } from '../../../../../app.network.service';

@Injectable()

export class RemoteService {
    constructor(private dfHttp: DfHTTP) { }
}
