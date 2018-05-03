import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { ChooseModalService } from './chooseModal.service';
import { AppService } from '../../../../app.service';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { LocalStorage } from '../localStorage/localStorage.component';

@Component({
    selector: 'app-choose-modal',
    templateUrl: './chooseModal.componet.html'
})

export class ChooseModalComponent implements OnInit {
    @Input('tableType') tableType: any; // 表格源数据类型
    @Input('selectionMode') selectionMode: string; // 选择类型
    @Input('tableData') tableData: Array<any> = []; // 表格源数据
    @Input('tableCols') tableCols: Array<any> = []; // 表格列
    @Input('originData') originData: Array<any>; // 原始数据
    @Output('close') close: EventEmitter<any> = new EventEmitter<any>();
    @Output('submit') submit: EventEmitter<any> = new EventEmitter<any>();

    selectedItem: any; // 选中行
    searchStr = ''; // 搜索字符串
    display: any = {};

    constructor(
        private chooseModalService: ChooseModalService,
        private appService: AppService,
        private ls: LocalStorage
    ) {
        this.display = this.ls.getObject('display'); // 获取显示字段
        this.appService.isClose$.subscribe((data) => {
            if (data) {
                this.reset();
            }
        });
    }

    ngOnInit() {

    }

    showSelect(data) {

    }

    closeDialog() {
        this.close.emit(true);
        this.reset();
    }
    chooseDialog(data?) {
        this.submit.emit(this.selectedItem);
        this.reset();
    }

    searchTable() {
        if (this.searchStr !== '') {
            const getData = [];
            for (const item of this.originData) {
                if (item) {
                    for (const key in item) {
                        if (key) {
                            const isObj = item[key] instanceof Object;
                            if (!isObj) {
                                if (item[key] && item[key].toString().toLocaleLowerCase()
                                    .indexOf(this.searchStr.toLocaleLowerCase()) !== -1) {
                                    getData.push(item);
                                    break;
                                }
                            }
                        }
                    }
                }
            }
            this.tableData = getData;
        } else {
            this.tableData = this.originData;
        }
    }

    reset() {
        this.selectedItem = '';
        this.searchStr = '';
        this.tableData = this.originData;
    }
}
