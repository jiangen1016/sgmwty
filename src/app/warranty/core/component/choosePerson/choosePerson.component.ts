import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { ChoosePersonService, EmployeeInfoResponse, EmpInfoListPage, EmpInfoListSearch } from './choosePerson.service';
import { AppService } from '../../../../app.service';
import { DataTable } from 'primeng/primeng';
import { LocalStorage } from '../localStorage/localStorage.component';

@Component({
    selector: 'app-choose-person',
    templateUrl: 'choosePerson.component.html'
})

export class ChoosePersonComponent implements OnInit {
    @Input('chooseType') chooseType: string;
    @ViewChild('scroller') private scroller: ElementRef;
    @ViewChild('sourceTable') private sourceTable: DataTable;

    @Output('selectPerson') selectPerson: EventEmitter<any> = new EventEmitter<any>();
    @Output('cancleEvent') cancleEvent: EventEmitter<any> = new EventEmitter<any>();

    private empInfoListPage: EmpInfoListPage = new EmpInfoListPage();
    empInfoListSearch: EmpInfoListSearch = new EmpInfoListSearch();

    tableCols = [];

    originData: Array<any> = [];
    sourceData: Array<any> = [];
    targetData: Array<any> = [];
    originTarget: Array<any> = [];
    selectedItem: Array<any> = [];

    searchTarget = '';
    display: any = {};

    constructor(
        private choosePersonService: ChoosePersonService,
        private appService: AppService,
        private ls: LocalStorage
    ) {
        this.display = this.ls.getObject('display'); // 获取显示字段
        this.tableCols = [
            // { 'header': this.display.UserId, 'field': 'empUid', 'width': '60%', 'isSort': true },
            { 'header': this.display.Name, 'field': 'displayName', 'width': '80%', 'isSort': true },
        ];
    }

    ngOnInit() {
        this.empInfoListPage.pageNum = 1;
        this.empInfoListPage.pageSize = 20;
        this.getChoosePeople(false);

    }

    toRight() {
        for (const obj of this.selectedItem) {
            if (this.sourceData.indexOf(obj) > -1) {
                this.sourceData.splice(this.sourceData.indexOf(obj), 1);
            }
        }
        if (this.targetData.length === 0) {
            this.targetData = this.selectedItem;
        } else {
            Array.prototype.push.apply(this.targetData, this.selectedItem);
        }
        this.originTarget = Object.assign([], this.targetData);
        this.freshDataTable();
    }

    toLeft() {
        for (const obj of this.selectedItem) {
            if (this.targetData.indexOf(obj) > -1) {
                this.targetData.splice(this.targetData.indexOf(obj), 1);
            }
        }
        this.originTarget = Object.assign([], this.targetData);
        if (this.sourceData.length === 0) {
            this.sourceData = this.selectedItem;
        } else {
            Array.prototype.push.apply(this.sourceData, this.selectedItem);
        }
        this.freshDataTable();
    }

    allToRight() {
        this.sourceData = [];
        this.targetData = Object.assign([], this.originData);
        this.freshDataTable();
    }

    allToLeft() {
        this.sourceData = Object.assign([], this.originData);
        this.targetData = [];
        this.originTarget = [];
        this.freshDataTable();
    }

    freshDataTable() {
        this.sourceData = this.sourceData.slice();
        this.targetData = this.targetData.slice();
        this.selectedItem = [];
    }

    showSelect(data) {

    }

    onscroll() {
        // this.empInfoListPage.pageNum = this.sourceData.length/this.empInfoListPage.pageSize + 1;
        this.empInfoListPage.pageNum++;
        this.getChoosePeople(true);
    }

    searchLeft() {
        this.empInfoListPage.pageNum = 1;
        this.getChoosePeople(false);
        this.scroller.nativeElement.scrollTo(0, 0);
    }

    searchRight() {
        if (this.searchTarget === '') {
            this.targetData = Object.assign([], this.originTarget);
        } else {
            this.targetData = [];
            for (let i = 0; i < this.originTarget.length; i++) {
                if (this.originTarget[i]['displayName'].indexOf(this.searchTarget) > -1) {
                    this.targetData.push(this.originTarget[i]);
                }
                // if (this.originTarget[i]['empUid'].indexOf(this.searchTarget) > -1 ||
                //     this.originTarget[i]['cnName'].indexOf(this.searchTarget) > -1) {
                //     this.targetData.push(this.originTarget[i]);
                // }
            }
        }
        this.freshDataTable();
    }

    getChoosePeople(scroll: boolean) {
        if (this.chooseType === 'role') {
            this.empInfoListSearch.displayName = this.empInfoListSearch.displayName;
        } else if (this.chooseType === 'process') {
            this.empInfoListSearch.displayName = this.empInfoListSearch.displayName;
        }
        this.choosePersonService.getEmployeeInfo(this.empInfoListPage, this.empInfoListSearch)
            .subscribe((res: EmployeeInfoResponse) => {
                if (res.code === 'SUCCESS') {
                    if (scroll) {
                        Array.prototype.push.apply(this.sourceData, res.data.list);
                    } else {
                        this.sourceData = res.data.list;
                    }
                    this.sourceData = this.sourceData.slice();
                    this.originData = Object.assign([], this.sourceData);
                }
            });
    }

    selected() {
        this.selectPerson.emit(this.targetData);
        this.cancle();
    }

    cancle() {
        this.cancleEvent.emit(true);
        this.allToLeft();
    }
}
