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

import { ApplyTrackComponent } from './applyTrack.component';
import { ApplyTrackService } from './applyTrack.service';
import { ApplyTrackRoutingModule } from './applyTrack.routing';


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
        GrowlModule,
        // ConfirmDialogModule,
        ApplyTrackRoutingModule,
        ModalModule.forRoot()
    ],
    declarations: [
        ApplyTrackComponent
    ],
    providers: [ApplyTrackService]
})
export class ApplyTrackModule { }
