import { Component } from '@angular/core';
import { LocalStorage } from '../localStorage/localStorage.component';
import { AppService, Language } from '../../../../app.service';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
    selector: 'app-dreams-header',
    templateUrl: './header.component.html',
    providers: []
})

export class HeaderComponent {
    userInfo: any = {}; // 用户
    display: any = {};
    imgUrl = '';
    constructor(
        private ls: LocalStorage,
        private appService: AppService,
        private router: Router
    ) {
        this.userInfo.userName = '';
        this.showIcon(this.ls.get('language'));
        this.appService.getUserEd$.subscribe((data) => {
            if (data) {
                this.display = this.ls.getObject('display'); // 获取显示字段
                this.showIcon(this.ls.get('language'));
                this.userInfo = this.appService.getUserInfo();
                this.ls.setObject('display', Language[this.ls.get('language')]);
                // this.languageChange();
            }
        });
    }

    /**
     * 注销   清除 LocalStorage  到退出url
     * jiangen  2017年11月24日18:13:40
     * @memberof HeaderComponet
     */
    loginOut() {
        this.ls.remove('token'); // token
        this.ls.remove('userId'); // user id
        this.ls.remove('userName'); // user name
        this.ls.remove('userRoles'); // user Roles
        this.ls.remove('change');
        this.ls.remove('display');
        this.appService.canIroute = [];
        // window.location.href = "http://idp.saic-gm.com/pkmslogout";   //正式环境
        window.location.href = 'http://idpdev.saic-gm.com/pkmslogout';     // 测试环境

    }

    /**
     * 切换中英文
     * @memberof HeaderComponet
     */
    languageChange() {
        const language = this.ls.get('language');
        if (language.indexOf('zh') === -1) {
            this.ls.set('language', 'zh_CN');
        } else {
            this.ls.set('language', 'en_US');
        }
        this.showIcon(this.ls.get('language'));
        // this.ls.setObject('display', Language[this.ls.get('language')]);
        this.router.navigate(['']);
        this.appService.getMenuFun(true);
    }

    showIcon(language) {
        switch (language) {
            case 'en_US':
                this.imgUrl = 'assets/img/header/languageCn.png';
                break;
            case 'zh_CN':
                this.imgUrl = 'assets/img/header/languageEn.png';
                break;
        }
    }
}
