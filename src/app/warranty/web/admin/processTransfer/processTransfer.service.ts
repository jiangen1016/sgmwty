import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { DfHTTP } from '../../../../app.network.service';
import { NetworkConfig } from '../../../../app.service';

@Injectable()

export class ProcessTransferService {
    constructor(
        private dfHTTP: DfHTTP
    ) {
    }

    /**
     * 获取流程转接数据
     * jiangen  2017年12月4日20:35:18
     * @param {any} urlParmas
     * @param {any} params
     * @returns
     * @memberof ProcessTransferService
     */
    getProcessTransferData(urlParmas, params) {
        return this.dfHTTP.pagePost(NetworkConfig.path.getProcessTransfer, urlParmas, params).map((data) => {
            return data;
        }, (error) => {
            return error;
        });
    }

    /**
     * 获取流程转移人员
     * jiagnen  2017年12月4日20:36:21
     * @param {any} params
     * @returns
     * @memberof ProcessTransferService
     */
    getTransferPerson() {
        return this.dfHTTP.post(NetworkConfig.path.getAdminMemberList).map((data) => {
            return data;
        }, (error) => {
            return error;
        });
    }

    /**
     * 获取 路由的流程节点
     * jiagnen  2017年12月18日14:39:30
     * @param {any} params
     * @returns
     * @memberof ProcessTransferService
     */
    getProcessList(params) {
        return this.dfHTTP.get(NetworkConfig.path.getProcessList, params).map((data) => {
            return data;
        }, (error) => {
            return error;
        });
    }

    /**
     * 流程管理 转接
     * jiangen  2017年12月11日11:26:43
     * @param {any} params
     * @returns
     * @memberof ProcessTransferService
     */
    doTransfer(params) {
        return this.dfHTTP.post(NetworkConfig.path.doTransfer, params).map((data) => {
            return data;
        }, (error) => {
            return error;
        });
    }

    /**
     * 流程管理 路由
     * jiangen  2017年12月11日11:26:43
     * @param {any} params
     * @returns
     * @memberof ProcessTransferService
     */
    doRoute(params) {
        return this.dfHTTP.post(NetworkConfig.path.doRoute, params).map((data) => {
            return data;
        }, (error) => {
            return error;
        });
    }



    /**
     * 流程管理  - 终止
     * jiangen  2017年12月11日11:27:26
     * @param {any} params
     * @returns
     * @memberof ProcessTransferService
     */
    doEnd(params) {
        return this.dfHTTP.post(NetworkConfig.path.doAbortTask, params).map((data) => {
            return data;
        }, (error) => {
            return error;
        });
    }

    /**
     * 流程管理 - 暂停
     *
     * @param {any} params
     * @returns
     * @memberof ProcessTransferService
     */
    doSuspendTask(params) {
        return this.dfHTTP.post(NetworkConfig.path.doSuspendTask, params).map((data) => {
            return data;
        }, (error) => {
            return error;
        });
    }

    /**
     * 流程管理  - 激活
     * jiangen   2017年12月11日13:29:45
     * @param {any} params
     * @returns
     * @memberof ProcessTransferService
     */
    doResumeTask(params) {
        return this.dfHTTP.post(NetworkConfig.path.doResumeTask, params).map((data) => {
            return data;
        }, (error) => {
            return error;
        });
    }
}
