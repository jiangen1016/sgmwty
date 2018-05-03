import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ComponetModule } from '../../../core/component/componet.module';
import { FormsModule } from '@angular/forms';
import {
    CalendarModule, ButtonModule, TabViewModule, AccordionModule,
    EditorModule, ToolbarModule, GrowlModule, ConfirmDialogModule
} from 'primeng/primeng';

import { ApplyCreatComponent } from './applyCreat.component';
import { ApplyCreatService } from './applyCreat.service';
import { ApplyCreatRoutingModule } from './applyCreat.routing';

@NgModule({
    imports: [
        RouterModule,
        CommonModule,
        ComponetModule,
        GrowlModule,
        ApplyCreatRoutingModule,
        ModalModule.forRoot()
    ],
    declarations: [
        ApplyCreatComponent
    ],
    providers: [ApplyCreatService]
})
export class ApplyCreatModule { }
