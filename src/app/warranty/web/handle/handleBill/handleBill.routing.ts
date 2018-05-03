import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { HandleBillComponent } from './handleBill.component';
import { Login } from '../../../core/component/canActive/loginActive.component';

const routes: Routes = [
    {
        path: '',
        component: HandleBillComponent,
        canActivate: [Login]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HandleBillRoutingModule { }
