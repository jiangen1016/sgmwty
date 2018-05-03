import {
    Component, Output, Input, EventEmitter, TemplateRef, ViewChild, OnInit,
    ChangeDetectorRef, AfterViewInit, ElementRef
} from '@angular/core';
import { LocalStorage } from '../localStorage/localStorage.component';
import { AppService } from '../../../../app.service';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/startWith';


declare var $;

@Component({
    selector: 'app-dreams-table',
    templateUrl: './table.component.html'
})

export class TableComponent implements OnInit, AfterViewInit {
    // @ViewChild('input') input: FormControl;
    @Input('history') history: any;
    @Input('showFiles') showFiles: boolean;
    @Input('tableData') tableData: Array<any>;
    @Input('tableConfig') tableConfig: any;
    @Input('tableCols') tableCols: Array<any>;
    @Input('totalRecords') totalRecords: number;
    @Input('historyData') historyData: any;
    @Input('historyTotal') historyTotal: number;
    @Input('loading') loading: boolean;
    @Output('pageParams') pageParams: EventEmitter<any> = new EventEmitter<any>();
    @Output('goDetail') goDetail: EventEmitter<any> = new EventEmitter<any>();
    @Output('editItem') editItem: EventEmitter<any> = new EventEmitter<any>();
    @Output('deleteItem') deleteItem: EventEmitter<any> = new EventEmitter<any>();
    @Output('selectRow') selectRow: EventEmitter<any> = new EventEmitter<any>();
    @Output('unSelectRow') unSelectRow: EventEmitter<any> = new EventEmitter<any>();

    @ViewChild('titleCell') myCell: TemplateRef<any>;

    isManager = false;
    sortF: string;
    public selectedTable: Array<any> = [];
    display: any = {};
    userInfo: any = {};
    // tableData = [
    //     { "number": "1", "title": "标题1", "name": "申请1", "date": "2017-11-1", "do": "删除" },
    //     { "number": "2", "title": "标题2", "name": "申请2", "date": "2017-11-12", "do": "删除" },
    //     { "number": "3", "title": "标题3", "name": "申请3", "date": "2017-11-13", "do": "删除" },
    //     { "number": "4", "title": "标题4", "name": "申请4", "date": "2017-11-14", "do": "删除" },
    //     { "number": "5", "title": "标题5", "name": "申请5", "date": "2017-11-15", "do": "删除" },
    //     { "number": "6", "title": "标题6", "name": "申请6", "date": "2017-11-16", "do": "删除" },
    //     { "number": "7", "title": "标题7", "name": "申请7", "date": "2017-11-17", "do": "删除" },
    //     { "number": "8", "title": "标题8", "name": "申请8", "date": "2017-11-18", "do": "删除" },
    //     { "number": "9", "title": "标题9", "name": "申请9", "date": "2017-10-11", "do": "删除" },
    //     { "number": "10", "title": "标题10", "name": "申请10", "date": "2017-1-11", "do": "删除" },
    //     { "number": "11", "title": "标题11", "name": "申请11", "date": "2017-2-11", "do": "删除" },
    //     { "number": "12", "title": "标题12", "name": "申请12", "date": "2017-3-11", "do": "删除" },
    //     { "number": "13", "title": "标题13", "name": "申请13", "date": "2017-4-11", "do": "删除" },
    //     { "number": "14", "title": "标题14", "name": "申请14", "date": "2017-5-11", "do": "删除" },
    //     { "number": "15", "title": "标题15", "name": "申请15", "date": "2017-7-11", "do": "删除" }
    // ]
    // cols = [
    //     { "header": this.display.DocumentNo, "field": "number" },
    //     { "header": this.display.Title, "field": "title" },
    //     { "header": this.display.Processname, "field": "name" },
    //     { "header": "发起时间", "field": "date" },
    //     { "header": this.display.Operation, "field": "do" }
    // ];
    constructor(
        private ls: LocalStorage,
        private changeDetectorRef: ChangeDetectorRef,
        private appService: AppService,
    ) {
        this.userInfo = this.appService.getUserInfo();
        this.display = this.ls.getObject('display');
        this.appService.languageChange$.subscribe(() => {
            this.display = this.ls.getObject('display');
        });
        this.totalRecords = this.totalRecords ? this.totalRecords : 0;
        this.historyTotal = this.historyTotal ? this.historyTotal : 0;
        if (this.userInfo.roles.indexOf('ITManager') !== -1 || this.userInfo.roles.indexOf('BusinessManager') !== -1) {
            this.isManager = true;
        }
    }

    /**
     * 分页切换
     * jiangen 2017年11月22日14:49:41
     * @param {any} data 分页当前信息
     * @memberof TableComponet
     */
    paginate(data) {
        this.pageParams.emit(data);
    }

    /**
     * 表格排序
     * jiangen 2017年11月22日14:50:08
     * @param {any} event
     * @memberof TableComponet
     */
    changeSort(event) {
        this.sortF = event.field;
    }

    /**点击表格列标题或名称前往详情页面
     * zw 2017年11月17日09:51:24
     * @param data
     */
    gotoDetail(data) {
        this.goDetail.emit(data);
    }

    /**点击表格操作列编辑按钮
     * zw 2017年11月17日10:54:45
     * @param data
     */
    clickEdit(data) {
        this.editItem.emit(data);
    }

    /**点击表格操作列删除按钮
     * zw 2017年11月17日10:54:50
     * @param data
     */
    clickDelete(data) {
        this.deleteItem.emit(data);
    }

    selected(e) {
        this.selectRow.emit(e.data);
    }

    unSelect(e) {
        this.unSelectRow.emit(true);
    }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
    }
}
