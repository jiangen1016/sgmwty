import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { EntrustComponent } from './entrust.component';
import { Login } from '../../../core/component/canActive/loginActive.component';
import { EntrustNewComponent } from './entrustNew/entrustNew.component';

const routes: Routes = [
    {
        path: '',
        component: EntrustComponent,
        canActivate: [Login]
    },
    {
        path: 'entrustNew',
        component: EntrustNewComponent,
        // canActivate: [Login]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EntrustRoutingModule { }
