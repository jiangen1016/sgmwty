import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ComponetModule } from '../../../core/component/componet.module';
import { FormsModule } from '@angular/forms';
import {
    CalendarModule, ButtonModule, TabViewModule, AccordionModule, FileUploadModule,
    EditorModule, ToolbarModule, GrowlModule, DialogModule, ConfirmDialogModule
} from 'primeng/primeng';

import { WordHelpComponent } from './wordHelp.component';
import { WordHelpService } from './wordHelp.service';
import { WordHelpRoutingModule } from './wordHelp.routing';
import { WordHelpOnlineComponent } from './wordHelpOnline.component';

@NgModule({
    imports: [
        ConfirmDialogModule,
        ButtonModule,
        RouterModule,
        CommonModule,
        ComponetModule,
        // CalendarModule,
        // TabViewModule,
        // AccordionModule,
        // EditorModule,
        FormsModule,
        // ToolbarModule,
        GrowlModule,
        WordHelpRoutingModule,
        DialogModule,
        FileUploadModule,
        ModalModule.forRoot()
    ],
    declarations: [
        WordHelpComponent,
        WordHelpOnlineComponent
    ],
    providers: [WordHelpService]
})
export class WordHelpModule { }
