import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { DfHTTP } from '../../../../app.network.service';

@Injectable()

export class ChooseModalService {
    constructor(
        private dfHTTP: DfHTTP
    ) {

    }
}
