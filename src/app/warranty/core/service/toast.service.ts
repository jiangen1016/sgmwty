import { Injectable } from '@angular/core';
import { NotifyService } from 'ngx-notify';

@Injectable()
export class ToastService {

    notifyConfig = {
        timeout: 3000,
        progress: true,
        rtl: false
    };

    constructor(
        private notifyService: NotifyService
    ) { }

    showSuccess(title: string, content: string) {
        // this.notifyService.clear();
        this.notifyService.success(title, content, this.notifyConfig);
    }

    showError(title: string, content: string) {
        // this.notifyService.clear();
        this.notifyService.error(title, content, this.notifyConfig);
    }

    showInfo(title: string, content: string) {
        // this.notifyService.clear();
        this.notifyService.info(title, content, this.notifyConfig);
    }
}
