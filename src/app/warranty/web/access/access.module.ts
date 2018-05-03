import { NgModule } from '@angular/core';
import { AccessComponent } from './access.component';
import { AccessService } from './access.service';
// import { CommonModule } from "@angular/common";
import { AccessRoutingModule } from './access.routing';
import { LocalStorage } from '../../core/component/localStorage/localStorage.component';

@NgModule({
    imports: [
        // CommonModule,
        AccessRoutingModule
    ],
    declarations: [
        AccessComponent
    ],
    providers: [AccessService, LocalStorage]
})
export class AccessModule { }
