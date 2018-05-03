import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ApplyTrackComponent } from './applyTrack.component';
import { Login } from '../../../core/component/canActive/loginActive.component';

const routes: Routes = [
    {
        path: '',
        component: ApplyTrackComponent,
        canActivate: [Login]
    },
    {
        path: 'DocumentInquiry',
        component: ApplyTrackComponent,
        canActivate: [Login]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ApplyTrackRoutingModule { }
