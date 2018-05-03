import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ComponetModule } from '../../../core/component/componet.module';
import { FormsModule } from '@angular/forms';
import {
    CalendarModule, ButtonModule, TabViewModule, DataTableModule,
    RadioButtonModule, EditorModule, ToolbarModule, GrowlModule, ConfirmDialogModule
} from 'primeng/primeng';

import { ApproveListComponent } from './approveList.component';
import { ApproveListService } from './approveList.service';
import { ApproveListRoutingModule } from './approveList.routing';

@NgModule({
    imports: [
        DataTableModule,
        RouterModule,
        CommonModule,
        ComponetModule,
        CalendarModule,
        FormsModule,
        GrowlModule,
        RadioButtonModule,
        ApproveListRoutingModule,
        ModalModule.forRoot()
    ],
    declarations: [
        ApproveListComponent
    ],
    providers: [ApproveListService]
})
export class ApproveListModule { }
