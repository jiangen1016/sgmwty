import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { ModalModule } from 'ngx-bootstrap/modal';
import { RouterModule } from '@angular/router';

import { AdminComponent } from './admin.component';
import { ComponetModule } from '../../core/component/componet.module';
import { ProcessTransferService } from './processTransfer/processTransfer.service';
import { AdminService } from './admin.service';

// import { DialogModule, SharedModule, Footer, PaginatorModule, GrowlModule, ButtonModule } from 'primeng/primeng';


@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        ComponetModule,
        // DialogModule,
        // PaginatorModule,
        // ModalModule,
        // GrowlModule,
        // ButtonModule
    ],
    declarations: [
        AdminComponent,

        // TableComponet
    ],
    providers: [ProcessTransferService, AdminService]
})
export class AdminModule { }
