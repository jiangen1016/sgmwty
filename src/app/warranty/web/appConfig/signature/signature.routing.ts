import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { Login } from '../../../core/component/canActive/loginActive.component';
import { SignatureComponent } from './signature.component';
import { SignatureNewComponent } from './signatureNew/signatureNew.component';

const routes: Routes = [
    {
        path: '',
        component: SignatureComponent,
        canActivate: [Login]
    },
    {
        path: 'signature-new',
        component: SignatureNewComponent,
        canActivate: [Login]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SignatureRoutingModule { }
