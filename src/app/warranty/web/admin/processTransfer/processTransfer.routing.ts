import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ProcessTranferComponent } from './processTransfer.component';
import { Login } from '../../../core/component/canActive/loginActive.component';

const routes: Routes = [
    {
        path: '',
        component: ProcessTranferComponent,
        canActivate: [Login]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProcessTransferRoutingModule { }
