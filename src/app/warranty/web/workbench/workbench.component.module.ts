import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ComponetModule } from '../../core/component/componet.module';
import { FormsModule } from '@angular/forms';

// import { ApplyCreatComponent } from './applyCreat/applyCreat.component';
// import { ApplyTrackComponent } from './applyTrack/applyTrack.component';
// // import { ApproveListComponent } from './approveList/approveList.component';
// import { DraftsBoxComponent } from './draftsBox/draftsBox.component';
// import { EntrustComponent } from './entrust/entrust.component';
// import { MyInfoComponent } from './myInfo/myInfo.component';
// import { MyApplyComponent } from './myApply/myApply.component';
import { WorkbenchComponent } from './workbench.component';
import { ApproveListService } from './approveList/approveList.service';
import { MyapplyService } from './myApply/myApply.service';
import { ApplyTrackService } from './applyTrack/applyTrack.service';
import { WorkBenchService } from './workbench.service';

import {
    CalendarModule, ButtonModule, TabViewModule, AccordionModule, ToolbarModule,
    GrowlModule, ConfirmDialogModule
} from 'primeng/primeng';
import { ApplyCreatService } from './applyCreat/applyCreat.service';
import { DraftsBoxService } from './draftsBox/draftsBox.service';
import { TableComponent } from '../../core/component/table/table.component';
import { PipeModule } from '../../core/component/pipe/pipe.module';

// import { WorkBenchRoutingModule } from './workbench.routing';

@NgModule({
    imports: [
        RouterModule,
        CommonModule,
        // CalendarModule,
        // ButtonModule,
        // TabViewModule,
        // AccordionModule,
        // ToolbarModule,
        // GrowlModule,
        // ConfirmDialogModule,
        // FormsModule,
        // ModalModule.forRoot()
    ],
    declarations: [
        WorkbenchComponent
    ],
    providers: [ApproveListService, ApplyCreatService, DraftsBoxService, MyapplyService, ApplyTrackService, WorkBenchService]
})
export class WorkBenchModule { }
