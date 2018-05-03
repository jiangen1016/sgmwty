import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-word-help-online',
    templateUrl: 'wordHelpOnline.component.html'
})

export class WordHelpOnlineComponent implements OnInit {
    downloadUrl: string;
    constructor(
        private activatedRoute: ActivatedRoute
    ) { }

    ngOnInit() {
        this.downloadUrl = this.activatedRoute.snapshot.paramMap.get('downloadUrl');
        this.addDocumentSupport(this.downloadUrl);
    }

    addDocumentSupport(fileUrl) {
        if (document.URL.indexOf('file://') >= 0) {
            if (!confirm('如果从本地磁盘打开的URL，需要手工运行命令\'regsvr32 ntkopdfdoc.dll\'注册插件文件.您确认已经注册了吗？')) {
                return;
            }
        }
        const TANGER_OCX_OBJ = document.all['TANGER_OCX'];
        TANGER_OCX_OBJ.BeginOpenFromURL(fileUrl); // 打开PDF从URL
    }
}
