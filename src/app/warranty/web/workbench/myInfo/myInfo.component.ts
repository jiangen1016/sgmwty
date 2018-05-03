import { Component } from '@angular/core';
import { LocalStorage } from '../../../core/component/localStorage/localStorage.component';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
    selector: 'app-info',
    templateUrl: './myInfo.component.html'
})

export class MyInfoComponent {
    display: any = {};
    url: string;
    constructor(
        private ls: LocalStorage,
        private sanitizer: DomSanitizer
    ) {
        this.display = this.ls.getObject('display'); // 获取显示字段
        // tslint:disable-next-line:max-line-length
        this.url = 'http://universedev.saic-gm.com/bpmum/bpmumweb/em/employee!newInput.do?isShow=Y&request_locale=zh_CN&locale=zh&menuName=%E4%B8%AA%E4%BA%BA%E4%BF%A1%E6%81%AF';
    }

    /**
     * 安全url
     * jiagnen 2017年12月4日10:36:07
     * @param {any} url
     * @returns
     * @memberof MyInfoComponent
     */
    safeUrl(url) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
}
