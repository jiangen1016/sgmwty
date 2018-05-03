import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ComponetModule } from '../../../core/component/componet.module';
import { EntrustRoutingModule } from './entrust.component.routing';
import { FormsModule } from '@angular/forms';
import { EntrustComponent } from './entrust.component';
import { CalendarModule, ButtonModule, TabViewModule, AccordionModule, EditorModule,
    ToolbarModule, GrowlModule, ConfirmDialogModule, DialogModule, MessageModule, MessagesModule } from 'primeng/primeng';
import { EntrustNewComponent } from './entrustNew/entrustNew.component';
import { EntrustNewService } from './entrustNew/entrustNew.component.service';
import { EntrustService } from './entrut.service';


@NgModule({
    imports: [
        ConfirmDialogModule,
        RouterModule,
        CommonModule,
        ComponetModule,
        EntrustRoutingModule,
        FormsModule,
        CalendarModule,
        ButtonModule,
        GrowlModule,
        DialogModule,
        MessageModule,
        MessagesModule
    ],
    declarations: [
        EntrustComponent,
        EntrustNewComponent
    ],
    providers: [EntrustNewService, EntrustService]
})
export class EntrustModule { }
