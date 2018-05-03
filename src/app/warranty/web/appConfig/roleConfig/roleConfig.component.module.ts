import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from "@angular/common";
import { ModalModule } from 'ngx-bootstrap/modal';
import { ComponetModule } from '../../../core/component/componet.module';
import { FormsModule } from "@angular/forms";
import {
    CalendarModule, ButtonModule, TabViewModule, AccordionModule,
    EditorModule, ToolbarModule, GrowlModule, DialogModule, ConfirmDialogModule
} from 'primeng/primeng';

import { RoleConfigComponent } from './roleConfig.component';
import { RoleConfigService } from './roleConfig.service';
import { RoleConfigRoutingModule } from './roleConfig.routing';
import { RoleMemberComponent } from './roleMember/roleMember.component';
import { RoleMemberService } from './roleMember/roleMember.service';

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
        DialogModule,
        RoleConfigRoutingModule,
        ModalModule.forRoot()
    ],
    declarations: [
        RoleConfigComponent,
        RoleMemberComponent
    ],
    providers: [RoleConfigService, RoleMemberService]
})
export class RoleConfigModule { }
