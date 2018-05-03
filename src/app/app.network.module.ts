import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { DmHttp, DfHTTP } from './app.network.service';

@NgModule({
    imports: [
        HttpModule
    ],
    declarations: [],
    providers: [DmHttp, DfHTTP]
})
export class AppNetworkModule { }
