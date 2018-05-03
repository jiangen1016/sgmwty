import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ApplyCreatComponent } from './applyCreat.component';
import { Login } from '../../../core/component/canActive/loginActive.component';

const routes: Routes = [
    {
        path: '',
        component: ApplyCreatComponent,
        canActivate: [Login]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ApplyCreatRoutingModule { }
