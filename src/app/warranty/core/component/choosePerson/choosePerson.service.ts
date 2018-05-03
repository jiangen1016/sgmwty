import { Injectable } from '@angular/core';
import { NetworkConfig } from '../../../../app.service';
import { Http, Response } from '@angular/http';
import { DfHTTP } from '../../../../app.network.service';

export class EmpInfoListPage {
    pageNum: number;
    pageSize: number;
}


export class EmpInfoListSearch {
    empUid: String;
    cnName: String;
    displayName: String;
}

export class EmpInfoProcess {
    userUid: String;
    userName: String;
}


export class EmployeeInfoResponse extends Response {
    code: String;
    msg: String;
    data: any;
}

@Injectable()
export class ChoosePersonService {

    constructor(
        private dfHTTP: DfHTTP
    ) { }

    getEmployeeInfo(urlParams, params) {
        return this.dfHTTP.pagePost(NetworkConfig.path.getEmployeeInfo,
            urlParams, params).map((res: EmployeeInfoResponse) => {
                return res;
            }, (error) => {
                return error;
            });
    }
}
