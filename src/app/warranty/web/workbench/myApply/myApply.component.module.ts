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

import { MyApplyComponent } from './myApply.component';
import { MyapplyService } from './myApply.service';
import { MyApplyRoutingModule } from './myApply.routing';


@NgModule({
    imports: [
        RouterModule,
        CommonModule,
        CalendarModule,
        ComponetModule,
        FormsModule,
        MyApplyRoutingModule,
        ModalModule.forRoot()
    ],
    declarations: [
        MyApplyComponent
    ],
    providers: [MyapplyService]
})
export class MyApplyModule { }
