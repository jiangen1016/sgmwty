import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ModalModule } from 'ngx-bootstrap/modal';
import { HandleComponent } from './handle.component';
import { HandleBillComponent } from './handleBill/handleBill.component';
import { ComponetModule } from '../../core/component/componet.module';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/primeng';

import { HandleService } from './handle.service';
import { CommonModule } from '@angular/common';


@NgModule({
    imports: [
        RouterModule,
        ComponetModule,
        CalendarModule,
        FormsModule,
        ModalModule,
        CommonModule
    ],
    declarations: [
        HandleComponent
    ],
    providers: [HandleService]
})
export class HandleModule { }
