import { Injectable } from '@angular/core';
import { DfHTTP } from '../../../../app.network.service';
import { LocalStorage } from '../../../core/component/localStorage/localStorage.component';
import { AppService, Language } from '../../../../app.service';
import swal from 'sweetalert2';

import {
    CanActivate, // 守卫，处理导航到某路由的情况。
    Router,
    ActivatedRouteSnapshot,  //
    RouterStateSnapshot, //
    CanActivateChild // 守卫，处理导航到子路由的情况
} from '@angular/router';

@Injectable()
export class Login implements CanActivate {
    constructor(
        private router: Router,
        private dfHTTP: DfHTTP,
        private ls: LocalStorage,
        private appService: AppService
    ) {
    }


    /**
     * 是否 有token 和用户名
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns  boolean
     * @memberof Login
     */
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const href = window.location.href.split('#')[1];
        let goNoPage = false;
        const canIroute = this.appService.canIroute;
        if (this.ls.get('token') && this.ls.get('userId')) {
            this.appService.getUserFun(true);
            if (href.indexOf('dreamswtyweb') !== -1) {
                return true;
            } else if (href === '/') {
                return true;
            } else {
                if (canIroute && canIroute.length) {
                    for (const item of canIroute) {
                        if (href.indexOf(item) !== -1) {
                            goNoPage = true;
                            break;
                        } else {
                            goNoPage = false;
                        }
                    }
                    if (goNoPage) {
                        return true;
                    } else {
                        // alert("");
                        swal('暂无此页面!');
                        return false;
                    }
                } else {
                    this.router.navigate(['/dreamswtyweb']);
                }
            }
        } else if (!this.ls.get('token')) {
            // if (this.ls.get('change') == "change") {
            //     this.ls.setObject('display', Language[this.ls.get('language')]);
            // }
            // else {
            //     this.appService.languageChangeFun(true);
            // }
            this.router.navigate(['/']);
        }
    }

    // /**
    //  * 获取浏览器语言
    //  * jiangen 2017年11月24日14:49:16
    //  * navigator.language 非IE浏览器  navigator.browserLanguage  IE浏览器
    //  * @memberof AccessComponent
    //  */
    // getBrowserLanguage() {
    //     let language = navigator.language;
    //     let trident = window.navigator.userAgent.indexOf('Trident');
    //     if (trident != -1) {
    //         language = window.navigator['browserLanguage'];
    //     }
    //     else {
    //         language = navigator.language.toString();
    //     }
    //     if (language.indexOf("zh") != -1) {
    //         language = "zh_CN";
    //     }
    //     else if (language.indexOf("en") != -1) {
    //         language = "en_US";
    //     }
    //     this.ls.set("language", language);
    //     this.ls.setObject('display', Language[language]);
    // }
}
