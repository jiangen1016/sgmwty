import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { MyInfoComponent } from './myInfo.component';
import { Login } from '../../../core/component/canActive/loginActive.component';

const routes: Routes = [
    {
        path: '',
        component: MyInfoComponent,
        canActivate: [Login]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MyInfoRoutingModule { }
