import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ComponetModule } from '../../../core/component/componet.module';
import { FormsModule } from '@angular/forms';
import {
    CalendarModule, ButtonModule, TabViewModule, AccordionModule, EditorModule,
    ToolbarModule, GrowlModule, ConfirmDialogModule
} from 'primeng/primeng';

import { DraftsBoxComponent } from './draftsBox.component';
import { DraftsBoxService } from './draftsBox.service';
import { DraftsBoxRoutingModule } from './draftsBox.routing';


@NgModule({
    imports: [
        ButtonModule,
        RouterModule,
        CommonModule,
        ComponetModule,
        CalendarModule,
        FormsModule,
        GrowlModule,
        ConfirmDialogModule,
        DraftsBoxRoutingModule,
        ModalModule.forRoot()
    ],
    declarations: [
        DraftsBoxComponent
    ],
    providers: [DraftsBoxService]
})
export class DraftsBoxModule { }
