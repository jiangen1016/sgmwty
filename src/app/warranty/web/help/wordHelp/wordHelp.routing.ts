import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { Login } from '../../../core/component/canActive/loginActive.component';
import { WordHelpComponent } from './wordHelp.component';

const routes: Routes = [
    {
        path: '',
        component: WordHelpComponent,
        canActivate: [Login]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class WordHelpRoutingModule { }
