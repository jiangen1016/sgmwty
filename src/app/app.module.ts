import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { WorkBenchModule } from './warranty/web/workbench/workbench.component.module';
import { HandleModule } from './warranty/web/handle/handle.module';
import { AdminModule } from './warranty/web/admin/admin.modlue';
import { HelpModule } from './warranty/web/help/help.modue';
import { AccessModule } from './warranty/web/access/access.module';
import { AppNetworkModule } from './app.network.module';
import { AppConfigModule } from './warranty/web/appConfig/appConfig.module';
import { ComponetModule } from './warranty/core/component/componet.module';
import { PipeModule } from './warranty/core/component/pipe/pipe.module';
import { BlockUIModule } from 'ng-block-ui';
import { AppService } from './app.service';
import { AttachmentService } from './warranty/core/service/attachment.service';
import { DateService } from './warranty/core/service/date.service';
import { ToastService } from './warranty/core/service/toast.service';
import { NotifyModule } from 'ngx-notify';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BlockUIModule,
        BrowserModule,
        AppRoutingModule,
        WorkBenchModule,
        HandleModule,
        AdminModule,
        HelpModule,
        AccessModule,
        AppNetworkModule,
        AppConfigModule,
        ComponetModule,
        PipeModule,
        NotifyModule.forRoot({ options: { position: ['right', 'top'], className: 'pb-notify', zIndex: 1000000000000, maxStack: 20 } }),
        BrowserAnimationsModule
    ],
    providers: [
        AppService,
        AttachmentService,
        DateService,
        ToastService
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }
