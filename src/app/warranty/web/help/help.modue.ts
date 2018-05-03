import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { HelpComponent } from './help.component';
import { WordHelpComponent } from './wordHelp/wordHelp.component';
import { ComponetModule } from '../../core/component/componet.module';

import { DialogModule, CalendarModule, FileUploadModule, ButtonModule, GrowlModule, ConfirmDialogModule } from 'primeng/primeng';
import { WordHelpService } from './wordHelp/wordHelp.service';
import { WordHelpOnlineComponent } from './wordHelp/wordHelpOnline.component';
import { CommonModule } from '@angular/common';



@NgModule({
    imports: [
        RouterModule,
        ComponetModule,
        DialogModule,
        FormsModule,
        CalendarModule,
        FileUploadModule,
        ButtonModule,
        GrowlModule,
        CommonModule
    ],
    declarations: [
        HelpComponent,
    ],
    providers: [
    ]
})
export class HelpModule { }
