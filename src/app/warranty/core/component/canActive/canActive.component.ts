import { Injectable } from '@angular/core';
import { DfHTTP } from '../../../../app.network.service';
import { LocalStorage } from '../../../core/component/localStorage/localStorage.component';
import { AppService, Language } from '../../../../app.service';
import swal from 'sweetalert2';

import {
    CanActivate, //  守卫，处理导航到某路由的情况。
    Router,
    ActivatedRouteSnapshot,  //
    RouterStateSnapshot, //
    CanActivateChild //  守卫，处理导航到子路由的情况
} from '@angular/router';


@Injectable()
export class Guard implements CanActivate {
    constructor(
        private router: Router,
        private dfHTTP: DfHTTP,
        private ls: LocalStorage,
        private appService: AppService
    ) {
    }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        // if (this.ls.get('change') == "change") {
        //     this.ls.setObject('display', Language[this.ls.get('language')]);
        //     this.appService.languageChangeFun(true);
        // }
        // else {
        //     this.getBrowserLanguage();
        // }

        this.getBrowserLanguage();
        const url = window.location.href;
        const params = url.split('?')[1];
        console.log(params);
        if (url.indexOf('?code=') !== -1) {
            // 这里获取用户信息
            this.getAcessInfo(params).subscribe((data) => {
                if (data.code === 'SUCCESS') {
                    console.log('login');
                    this.ls.set('token', data.data.token); // token
                    this.ls.set('userId', data.data.uid); // user id
                    this.ls.set('userName', data.data.cn); // user name
                    this.ls.set('userRoles', data.data.roles); // 用户角色
                    this.appService.getUserFun(true);
                    this.appService.getMenuFun(true);
                    if (this.ls.get('userRoles').indexOf('LeastPrivilege') !== -1 || this.ls.get('userRoles')
                        .indexOf('DataOperator') !== -1) {
                        this.router.navigate(['/work/info']);
                    } else {
                        this.router.navigate(['/work/approve']);
                    }
                } else {
                    // alert(data.msg);
                    swal(data.msg);
                    // window.location.href = "http://idp.saic-gm.com/pkmslogout";     // 正式环境
                    window.location.href = 'http://idpdev.saic-gm.com/pkmslogout';     // 测试环境
                }
            });
            return false;
        } else {
            return true;
        }
    }

    /**
     * 获取用户信息
     * jiangen 2017年11月24日16:32:00
     * @param {any} params  参数   code=xxx
     * @returns  用户角色
     * @memberof Guard
     */
    getAcessInfo(params) {
        const accessUrl = 'dreamswty/dreamswtyAuth?' + params;
        return this.dfHTTP.get(accessUrl).map((data) => {
            return data;
        }, (error) => {
            return error;
        });
    }

    /**
     * 获取浏览器语言
     * jiangen 2017年11月24日14:49:16
     * navigator.language 非IE浏览器  navigator.browserLanguage  IE浏览器
     * @memberof AccessComponent
     */
    getBrowserLanguage() {
        if (!this.ls.get('language')) {
            let language = navigator.language;
            const trident = window.navigator.userAgent.indexOf('Trident');
            if (trident !== -1) {
                language = window.navigator['browserLanguage'];
            } else {
                language = navigator.language.toString();
            }
            if (language.indexOf('zh') !== -1) {
                language = 'zh_CN';
            } else if (language.indexOf('en') !== -1) {
                language = 'en_US';
            }
            this.ls.set('language', language);
            this.ls.setObject('display', Language[language]);
        }
    }
}
