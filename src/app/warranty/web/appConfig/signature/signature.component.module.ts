import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ComponetModule } from '../../../core/component/componet.module';
import { FormsModule } from '@angular/forms';
import {
    ButtonModule, TabViewModule, AccordionModule, EditorModule, ToolbarModule,
    GrowlModule, DialogModule, ConfirmDialogModule, FileUploadModule
} from 'primeng/primeng';
import { SignatureComponent } from './signature.component';
import { SignatureService } from './signature.service';
import { SignatureRoutingModule } from './signature.routing';
import { SignatureNewComponent } from './signatureNew/signatureNew.component';
import { SignatureNewService } from './signatureNew/signatureNew.service';


@NgModule({
    imports: [
        ConfirmDialogModule,
        ButtonModule,
        RouterModule,
        CommonModule,
        ComponetModule,
        SignatureRoutingModule,
        FormsModule,
        GrowlModule,
        DialogModule,
        FileUploadModule,
        ModalModule.forRoot()
    ],
    declarations: [
        SignatureComponent,
        SignatureNewComponent
    ],
    providers: [SignatureService, SignatureNewService]
})
export class SignatureModule { }
