import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ComponetModule } from '../../../core/component/componet.module';

import { MyInfoComponent } from './myInfo.component';
import { MyInfoRoutingModule } from './myInfo.routing';

@NgModule({
    imports: [
        RouterModule,
        CommonModule,
        ComponetModule,
        MyInfoRoutingModule
    ],
    declarations: [
        MyInfoComponent
    ],
    providers: []
})
export class MyInfoModule { }
