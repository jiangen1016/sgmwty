import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { AccessService } from './access.service';
import { LocalStorage } from '../../core/component/localStorage/localStorage.component';
import { AppService, Language } from '../../../app.service';
import { DfHTTP } from '../../../app.network.service';

@Component({
    selector: 'app-access-get',
    template: '<div></div>'
})

export class AccessComponent {
    constructor(
        private activatedRoute: ActivatedRoute,
        private location: Location,
        private router: Router,
        private accessService: AccessService,
        private ls: LocalStorage,
        private appService: AppService,
        private dfHTTP: DfHTTP
    ) {
        this.getAccess();
    }

    /**
     * 是否有token 是否认证
     * jiangen  2017年11月24日14:51:12
     * @memberof AccessComponent
     */
    getAccess() {
        console.log('get token');
        if (!this.ls.get('token')) {
            // tslint:disable-next-line:max-line-length

            window.location.href = 'http://idpdev.saic-gm.com/oauthweb/oauth/authorize?client_id=adf9f77d-52bc-4937-85e1-1ad51877c6d3&response_type=code&redirect_uri=http://bpmddevweb.jqdev.saic-gm.com/dreamswtyweb';
            // tslint:disable-next-line:max-line-length
            // window.location.href = 'http://idpdev.saic-gm.com/oauthweb/oauth/authorize?client_id=70ca06f3-e3b3-4cc0-accb-26b558f30bb3&response_type=code&redirect_uri=http://bpmdqaweb.jqdev.saic-gm.com/dreamswtyweb';
            // tslint:disable-next-line:max-line-length
            // window.location.href = "http://idp.saic-gm.com/oauthweb/oauth/authorize?client_id=dba6e0d2-e110-43e7-9190-51804ea9c278&response_type=code&redirect_uri=http://bpmdoaweb.saic-gm.com/dreamsito";
        } else {
            if (this.ls.get('userRoles').indexOf('LeastPrivilege') !== -1 || this.ls.get('userRoles').indexOf('DataOperator') !== -1) {
                this.router.navigate(['/work/info']);
            } else {
                this.router.navigate(['/work/approve']);
            }
            const language = this.ls.get('language');
            this.ls.setObject('display', Language[language]);
        }
    }
}
