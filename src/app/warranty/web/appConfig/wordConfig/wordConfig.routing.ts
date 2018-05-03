import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { WordConfigComponent } from './wordConfig.component';
import { WordConfigValueComponent } from './wordConfigValues/wordConfigValue.component';

import { Login } from '../../../core/component/canActive/loginActive.component';

const routes: Routes = [
    {
        path: '',
        component: WordConfigComponent,
        canActivate: [Login]
    },
    {
        path: 'wordValues',
        component: WordConfigValueComponent,
        canActivate: [Login]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class WordConfigRoutingModule { }
