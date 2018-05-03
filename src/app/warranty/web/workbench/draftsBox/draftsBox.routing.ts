import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { DraftsBoxComponent } from './draftsBox.component';
import { Login } from '../../../core/component/canActive/loginActive.component';

const routes: Routes = [
    {
        path: '',
        component: DraftsBoxComponent,
        canActivate: [Login]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DraftsBoxRoutingModule { }
