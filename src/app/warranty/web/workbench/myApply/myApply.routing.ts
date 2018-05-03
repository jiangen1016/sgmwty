import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { MyApplyComponent } from './myApply.component';
import { Login } from '../../../core/component/canActive/loginActive.component';

const routes: Routes = [
    {
        path: '',
        component: MyApplyComponent,
        canActivate: [Login]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MyApplyRoutingModule { }
