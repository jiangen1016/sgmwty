import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ComponetModule } from '../../core/component/componet.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AppConfigComponent } from './appConfig.component';

// import { CalendarModule, MessageModule, MessagesModule, ButtonModule, DialogModule, DataScrollerModule } from 'primeng/primeng';
import { FormsModule } from '@angular/forms';
import { PickListModule } from 'primeng/primeng';


@NgModule({
    imports: [
        RouterModule,
        CommonModule,
        ComponetModule,
        // CalendarModule,
        // FormsModule,
        // ModalModule,
        // MessageModule,
        // MessagesModule,
        // ButtonModule,
        // PickListModule,
        // DialogModule,
        // DataScrollerModule
    ],
    declarations: [
        AppConfigComponent,
    ],
    providers: []
})
export class AppConfigModule { }
