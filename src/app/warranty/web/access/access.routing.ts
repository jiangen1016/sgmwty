import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AccessComponent } from './access.component';

const routes: Routes = [
    {
        path: '',
        component: AccessComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AccessRoutingModule { }
