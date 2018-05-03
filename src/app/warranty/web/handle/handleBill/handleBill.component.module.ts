import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from "@angular/common";
import { ModalModule } from 'ngx-bootstrap/modal';
import { ComponetModule } from '../../../core/component/componet.module';
import { FormsModule } from "@angular/forms";
import { CalendarModule, ButtonModule, TabViewModule, AccordionModule, EditorModule, ToolbarModule, GrowlModule, ConfirmDialogModule } from 'primeng/primeng';

import { HandleBillComponent } from './handleBill.component';
import { HandleBillService } from './handleBill.service';
import { HandleBillRoutingModule } from './handleBill.routing';

@NgModule({
    imports: [
        ButtonModule,
        RouterModule,
        CommonModule,
        ComponetModule,
        CalendarModule,
        // TabViewModule,
        // AccordionModule,
        // EditorModule,
        FormsModule,
        // ToolbarModule,
        // GrowlModule,
        // ConfirmDialogModule,
        HandleBillRoutingModule,
        ModalModule.forRoot()
    ],
    declarations: [
        HandleBillComponent
    ],
    providers: [HandleBillService]
})
export class HandleBillModule { }
