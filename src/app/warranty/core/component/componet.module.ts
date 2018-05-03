import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import {
    DataTableModule, Footer, PaginatorModule, CalendarModule, TabViewModule,
    AccordionModule, RadioButtonModule, DialogModule, ToolbarModule, DataScrollerModule,
    MessageModule, MessagesModule, FileUploadModule, ButtonModule, GrowlModule, ConfirmDialogModule,
    PanelMenuModule, MenuItem
} from 'primeng/primeng';

import { HeaderComponent } from './header/header.component';
import { TableComponent } from './table/table.component';
import { FooterComponent } from './footer/footer.component';
import { ChooseModalComponent } from './chooseModal/chooseModal.componet';
import { ModalModule } from 'ngx-bootstrap';

import { Guard } from './canActive/canActive.component';
import { Login } from './canActive/loginActive.component';

import { ChoosePersonService } from './choosePerson/choosePerson.service';
import { ChooseModalService } from './chooseModal/chooseModal.service';
import { MenuService } from './menu/menu.service';
import { ComponentService } from './component.service';


import { ChoosePersonComponent } from './choosePerson/choosePerson.component';
import { MenuComponent } from './menu/menu.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

// import { CKEditorModule } from 'ng2-ckeditor';
import { PipeModule } from './pipe/pipe.module';
import { ExpiredComponent } from './modal/expired/expired.component';
import { ExpiredService } from './modal/expired/expired.service';
import { ReplaceComponent } from './modal/replace/replace.component';
import { ReplaceService } from './modal/replace/replace.service';
import { PromotionsComponent } from './modal/promotions/promotions.component';
import { PromotionsService } from './modal/promotions/promotions.service';
import { QualityComponent } from './modal/quality/quality.component';
import { QualityService } from './modal/quality/quality.service';
import { ReturnComponent } from './modal/return/return.component';
import { ReturnService } from './modal/return/return.service';
import { NormalComponent } from './modal/document/document.component';
import { DocumentService } from './modal/document/document.service';
import { UploadComponent } from './upload/upload.component';
import { SceneComponent } from './modal/scene/scence.component';
import { SceneService } from './modal/scene/scence.service';
import { RemoteComponent } from './modal/remote/remote.component';
import { RemoteService } from './modal/remote/remote.service';
import { SummaryComponent } from './modal/summary/summary.component';
import { SummaryService } from './modal/summary/summary.service';

@NgModule({
    imports: [
        ConfirmDialogModule,
        PipeModule,
        CommonModule,
        DataTableModule,
        InfiniteScrollModule,
        PaginatorModule,
        CalendarModule,
        TabViewModule,
        AccordionModule,
        RadioButtonModule,
        FileUploadModule,
        ButtonModule,
        DialogModule,
        ModalModule,
        PanelMenuModule,
        MessageModule,
        MessagesModule
    ],

    declarations: [
        HeaderComponent,
        TableComponent,
        FooterComponent,
        ChooseModalComponent,
        ExpiredComponent,
        ReplaceComponent,
        PromotionsComponent,
        QualityComponent,
        ReturnComponent,
        NormalComponent,
        UploadComponent,
        SceneComponent,
        RemoteComponent,
        SummaryComponent,
        MenuComponent,
        ChoosePersonComponent,
        // PrintComponet
    ],
    providers: [
        ComponentService,
        ChooseModalService,
        ExpiredService,
        ReplaceService,
        PromotionsService,
        QualityService,
        ReturnService,
        DocumentService,
        SceneService,
        RemoteService,
        SummaryService,
        Guard,
        MenuService,
        ChoosePersonService,
        Login
    ],
    exports: [
        HeaderComponent,
        TableComponent,
        FooterComponent,
        ChooseModalComponent,
        ExpiredComponent,
        ReplaceComponent,
        PromotionsComponent,
        QualityComponent,
        ReturnComponent,
        NormalComponent,
        UploadComponent,
        SceneComponent,
        RemoteComponent,
        SummaryComponent,
        MenuComponent,
        ChoosePersonComponent
    ]
})
export class ComponetModule { }
