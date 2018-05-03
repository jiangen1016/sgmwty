import { NgModule } from '@angular/core';

import { Routes, RouterModule, RouterLinkActive } from '@angular/router';
import { AppComponent } from './app.component';
import { ApproveListComponent } from './warranty/web/workbench/approveList/approveList.component';
import { ApplyCreatComponent } from './warranty/web/workbench/applyCreat/applyCreat.component';
import { DraftsBoxComponent } from './warranty/web/workbench/draftsBox/draftsBox.component';
import { MyApplyComponent } from './warranty/web/workbench/myApply/myApply.component';
import { ApplyTrackComponent } from './warranty/web/workbench/applyTrack/applyTrack.component';
import { EntrustComponent } from './warranty/web/workbench/entrust/entrust.component';
import { MyInfoComponent } from './warranty/web/workbench/myInfo/myInfo.component';
import { WorkbenchComponent } from './warranty/web/workbench/workbench.component';
import { HandleComponent } from './warranty/web/handle/handle.component';
import { HandleBillComponent } from './warranty/web/handle/handleBill/handleBill.component';
import { AppConfigComponent } from './warranty/web/appConfig/appConfig.component';
import { RoleConfigComponent } from './warranty/web/appConfig/roleConfig/roleConfig.component';
import { WordConfigComponent } from './warranty/web/appConfig/wordConfig/wordConfig.component';
import { AdminComponent } from './warranty/web/admin/admin.component';
import { ProcessTranferComponent } from './warranty/web/admin/processTransfer/processTransfer.component';
import { HelpComponent } from './warranty/web/help/help.component';
import { WordHelpComponent } from './warranty/web/help/wordHelp/wordHelp.component';
import { WordConfigValueComponent } from './warranty/web/appConfig/wordConfig/wordConfigValues/wordConfigValue.component';
import { RoleMemberComponent } from './warranty/web/appConfig/roleConfig/roleMember/roleMember.component';
import { AccessComponent } from './warranty/web/access/access.component';
import { WordHelpOnlineComponent } from './warranty/web/help/wordHelp/wordHelpOnline.component';
import { Guard } from './warranty/core/component/canActive/canActive.component';
import { Login } from './warranty/core/component/canActive/loginActive.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'dreamswtyweb',
        pathMatch: 'full'
    },
    {
        path: 'QueryCenter',
        component: WorkbenchComponent,
        children: [
            {
                path: '',
                loadChildren: './warranty/web/workbench/applyTrack/applyTrack.component.module#ApplyTrackModule'
            },
            {
                path: 'DocumentInquiry',
                loadChildren: './warranty/web/workbench/applyTrack/applyTrack.component.module#ApplyTrackModule'
            }
        ]
    },
    {
        path: 'work',
        canActivate: [Login],
        component: WorkbenchComponent,
        // pathMatch: 'full',
        children: [
            {
                path: '',
                loadChildren: './warranty/web/workbench/approveList/approveList.component.module#ApproveListModule'
            },
            {
                path: 'approve',
                loadChildren: './warranty/web/workbench/approveList/approveList.component.module#ApproveListModule'
            },
            {
                path: 'creat',
                loadChildren: './warranty/web/workbench/applyCreat/applyCreat.component.module#ApplyCreatModule'
            },
            {
                path: 'drafts',
                loadChildren: './warranty/web/workbench/draftsBox/draftsBox.component.module#DraftsBoxModule'
            },
            {
                path: 'apply',
                loadChildren: './warranty/web/workbench/myApply/myApply.component.module#MyApplyModule'
            },
            {
                path: 'track',
                loadChildren: './warranty/web/workbench/applyTrack/applyTrack.component.module#ApplyTrackModule'
            },
            {
                path: 'entrust',
                loadChildren: './warranty/web/workbench/entrust/entrust.component.module#EntrustModule'
            },
            {
                path: 'info',
                loadChildren: './warranty/web/workbench/myInfo/myInfo.component.module#MyInfoModule'
            }
        ]
    },

    {
        path: 'handle',
        canActivate: [Login],
        component: HandleComponent,
        // pathMatch: 'full',
        children: [
            {
                path: '',
                loadChildren: './warranty/web/handle/handleBill/handleBill.component.module#HandleBillModule'
            },
            {
                path: 'handleBill',
                loadChildren: './warranty/web/handle/handleBill/handleBill.component.module#HandleBillModule'
            }
        ]
    },
    {
        path: 'config',
        canActivate: [Login],
        component: AppConfigComponent,
        children: [
            {
                path: 'role',
                loadChildren: './warranty/web/appConfig/roleConfig/roleConfig.component.module#RoleConfigModule'
            },
            {
                path: 'word',
                loadChildren: './warranty/web/appConfig/wordConfig/wordConfig.component.module#WordConfigModule'
            },
            {
                path: 'wordValues',
                loadChildren: './warranty/web/appConfig/wordConfig/wordConfig.component.module#WordConfigModule'
            },
            {
                path: 'signature',
                loadChildren: './warranty/web/appConfig/signature/signature.component.module#SignatureModule'
            }
        ]
    },
    {
        path: 'admin',
        canActivate: [Login],
        component: AdminComponent,
        children: [
            {
                path: 'processTranfer',
                loadChildren: './warranty/web/admin/processTransfer/processTransfer.component.module#ProcessTransferModule'
            }
        ]
    },
    {
        path: 'help',
        component: HelpComponent,
        canActivate: [Login],
        children: [
            {
                path: 'word-help',
                loadChildren: './warranty/web/help/wordHelp/wordHelp.component.module#WordHelpModule'
            }
        ]
    },
    {
        path: 'dreamswtyweb',
        component: AccessComponent,
        canActivate: [Guard]
    },
    {
        path: '**',
        component: AccessComponent,
        canActivate: [Guard]
    }
];


@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule]
})

export class AppRoutingModule { }
