import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { RoleConfigComponent } from './roleConfig.component';
import { Login } from '../../../core/component/canActive/loginActive.component';
import { RoleMemberComponent } from './roleMember/roleMember.component';

const routes: Routes = [
    {
        path: '',
        component: RoleConfigComponent,
        canActivate: [Login]
    },
    {
        path: 'roleMember',
        component: RoleMemberComponent,
        canActivate: [Login]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RoleConfigRoutingModule { }
