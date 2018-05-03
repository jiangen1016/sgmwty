import { Injectable } from '@angular/core';
import { DfHTTP } from '../../../../../app.network.service';

@Injectable()

export class SceneService {
    constructor(private dfHttp: DfHTTP) { }
}
