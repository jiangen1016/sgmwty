import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ComponetModule } from '../../../core/component/componet.module';
import { FormsModule } from '@angular/forms';
import {
    CalendarModule, ButtonModule, TabViewModule, AccordionModule,
    EditorModule, ToolbarModule, GrowlModule, DialogModule, ConfirmDialogModule
} from 'primeng/primeng';
import { ProcessTranferComponent } from './processTransfer.component';
import { ProcessTransferService } from './processTransfer.service';
import { ProcessTransferRoutingModule } from './processTransfer.routing';

@NgModule({
    imports: [
        ConfirmDialogModule,
        ButtonModule,
        RouterModule,
        CommonModule,
        ComponetModule,
        CalendarModule,
        FormsModule,
        GrowlModule,
        DialogModule,
        ProcessTransferRoutingModule,
        ModalModule.forRoot()
    ],
    declarations: [
        ProcessTranferComponent
    ],
    providers: [ProcessTransferService]
})
export class ProcessTransferModule { }
