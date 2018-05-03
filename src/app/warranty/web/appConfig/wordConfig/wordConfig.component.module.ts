import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from "@angular/common";
import { ModalModule } from 'ngx-bootstrap/modal';
import { ComponetModule } from '../../../core/component/componet.module';
import { FormsModule } from "@angular/forms";
import { CalendarModule, ButtonModule, TabViewModule, AccordionModule, EditorModule, ToolbarModule, GrowlModule, DialogModule, ConfirmDialogModule } from 'primeng/primeng';

import { WordConfigComponent } from './wordConfig.component';
import { WordConfigService } from './wordConfig.service';
import { WordConfigValueComponent } from './wordConfigValues/wordConfigValue.component';
import { WordConfigValueService } from './wordConfigValues/wordConfigValue.service';
import { WordConfigRoutingModule } from './wordConfig.routing';

@NgModule({
    imports: [
        ConfirmDialogModule,
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
        DialogModule,
        WordConfigRoutingModule,
        ModalModule.forRoot()
    ],
    declarations: [
        WordConfigComponent,
        WordConfigValueComponent
    ],
    providers: [WordConfigService, WordConfigValueService]
})
export class WordConfigModule { }
