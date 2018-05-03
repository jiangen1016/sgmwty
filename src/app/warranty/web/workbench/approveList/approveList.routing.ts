import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ApproveListComponent } from './approveList.component';
import { Login } from '../../../core/component/canActive/loginActive.component';

const routes: Routes = [
    {
        path: '',
        component: ApproveListComponent,
        canActivate: [Login]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ApproveListRoutingModule { }
