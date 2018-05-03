import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { NetworkConfig } from './app.service';
import { LocalStorage } from './warranty/core/component/localStorage/localStorage.component';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NotifyService } from 'ngx-notify';


/**
 * 网络请求基础服务
 *
 * @export DmHttp
 * @class DmHttp
 */
@Injectable()
export class DmHttp {

    /**
     * 网络请求基础服务构造函数
     * @param {Http} http angular http请求
     *
     * @memberOf DmHttp
     */
    constructor(private http: Http, private ls: LocalStorage, private notifyService: NotifyService) { }

    /**
     * get请求方法
     *
     * @param {any} url 请求地址
     * @param {any} [params] 请求参数 可选
     * @returns {Observable<any>} Observable请求结果
     *
     * @memberOf DmHttp
     */
    get(url, params?): Observable<any> {
        const tempHeader = Object.assign({}, NetworkConfig.headers);
        if (this.ls.get('token')) {
            tempHeader['x-access-token'] = this.ls.get('token');
        }
        if (this.ls.get('language')) {
            tempHeader['languageCode'] = this.ls.get('language');
        }
        if (params) {
            url += '?';
            for (const key in params) {
                if (params.hasOwnProperty(key)) {
                    url += `${key}=${params[key]}&`;
                }
            }
        }

        return this.http.get(url, { headers: tempHeader })
            .catch(this.handleError);
    }

    /**
     * get请求方法
     *
     * @param {any} url 请求地址
     * @param {any} [params] 请求参数 可选
     * @returns {Observable<any>} Observable请求结果
     *
     * @memberOf DmHttp
     */
    post(url, params?, isRefreshToken?: boolean): Observable<any> {
        const tempHeader = Object.assign({}, NetworkConfig.headers);
        if (this.ls.get('token')) {
            tempHeader['x-access-token'] = this.ls.get('token');
        }
        if (this.ls.get('language')) {
            tempHeader['languageCode'] = this.ls.get('language');
        }
        return this.http.post(url, params, { headers: tempHeader })
            .catch(this.handleError);
    }


    /**
     * 通用网络请求error handler
     *
     * @private
     * @param {(Response | any)} error 错误信息
     * @returns {{ErrorObservable}} Observable错误
     *
     * @memberOf DmHttp
     */
    private handleError(error: Response | any) {
        console.log('network error----------------------------------------');
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json();
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        console.log('network error end-------------------------------------');
        // return null ;
        return Observable.throw(errMsg);
    }

}

/**
 * 定制网络请求服务
 *
 * @export DfHTTP
 * @class DfHTTP
 */
@Injectable()
export class DfHTTP {
    // Wires up BlockUI instance
    @BlockUI() blockUI: NgBlockUI;

    /**
     * domain
     *
     * @type {string}
     * @memberOf DfHTTP
     */
    domain: string = NetworkConfig.domain;
    timeout: any = 300000;
    loader: any;

    display: any = {};

    /**
     * 定制网络请求服务构造函数f
     * @param {DmHttp} dmHttp 网络请求基础服务
     * @param {LoadingController} loadingController 风火轮Controller
     * @param {ToastController} toastController toast controller
     *
     * @memberOf DfHTTP
     */
    constructor(
        public dmHttp: DmHttp,
        private router: Router,
        private ls: LocalStorage,
        private notifyService: NotifyService
    ) {
        this.display = this.ls.getObject('display');
    }

    /**
     * 不使用domain的get请求
     *
     * @param {string} url 地址全名
     * @param {*} [params] 请求参数 可选
     * @param {string} [loadingText] 请求中的提示信息 可选
     * @param {string} [errorText='网络请求失败'] 请求失败信息 可选 默认'网络请求失败'
     * @returns {Observable<any>} Observable请求结果
     *
     * @memberOf DfHTTP
     */
    fullGet(url: string, params?: any, errorText: string = '网络请求失败'): Observable<any> {
        this.blockUI.start(this.display.loading);

        return this.dmHttp.get(url, params)
            .map((response) => {
                this.blockUI.stop();
                let data = response.json();
                if (typeof data === 'undefined') {
                    data = {};
                } else if (data.code !== 'SUCCESS' && data.code !== 'success') {
                    // this.showErrorToast(data.msg);
                    if (data.devMsg === 'TOKEN_TIME_OUT') {
                        sessionStorage.clear();
                        // this.router.navigate(['login']);
                    }
                }
                return data;
            }, (error) => {
                this.blockUI.stop();
                if (errorText.length > 0) {
                    // this.showErrorToast(errorText);
                }
                return error;
            })
            .timeout(this.timeout)
            .catch((error: Response | any) => {
                this.blockUI.stop();
                this.showErrorToast(error);
                return Observable.throw(error);
            });
    }

    /**
     * 不使用domain的post请求
     *
     * @param {string} url 地址全名
     * @param {*} [params] 请求参数 可选
     * @param {string} [loadingText] 请求中的提示信息 可选
     * @param {string} [errorText='网络请求失败'] 请求失败信息 可选 默认'网络请求失败'
     * @returns {Observable<any>} Observable请求结果
     *
     * @memberOf DfHTTP
     */
    fullPost(url: string, params?: any, errorText: string = '网络请求失败', showToast?: string, isRefreshToken?: true): Observable<any> {
        let isShowToast = false;
        this.blockUI.start(this.display.loading);
        if (!showToast || showToast === 'Y') {
            isShowToast = true;
        }
        if (typeof isRefreshToken === 'undefined') {
            isRefreshToken = true;
        }

        return this.dmHttp.post(url, params, isRefreshToken)
            .map((response) => {
                this.blockUI.stop();
                const data = response.json();
                if (data.code !== 'SUCCESS' && data.code !== 'success') {
                    if (isShowToast) {
                        if (url.indexOf('MobCommServices/UserVerificationRestPS') > -1) {
                            // this.showErrorToast(data.msg, '登录失败');
                        } else {
                            // this.showErrorToast(data.userMsg);
                        }
                    }

                    if (data.devMsg === 'TOKEN_TIME_OUT') {
                        sessionStorage.clear();
                        // this.router.navigate(['login']);
                    }
                }
                return data;
            }, (error) => {
                this.blockUI.stop();
                if (errorText.length > 0) {
                    // TODO: toast
                }
                return error;
            })
            .timeout(this.timeout)
            .catch((error: Response | any) => {
                this.blockUI.stop();
                if (isShowToast) {
                    this.showErrorToast(error);
                }
                console.log('------------------PBHTTP LOG------------------');
                console.error(error);
                console.log('----------------PBHTTP LOG END----------------');
                return Observable.throw(error);
            });
    }

    forkPost(requests: Array<any>, errorText: string = '网络请求失败'): Observable<any> {
        const observableBatch = [];
        for (const item of requests) {
            observableBatch.push(this.post(item.url, item.params));
        }
        return Observable.forkJoin(observableBatch)
            .map((res) => {
                return res;
            })
            .timeout(this.timeout)
            .catch((error: Response | any) => {
                // this.showErrorToast('网络出现问题,请稍候再试');
                return Observable.throw(error);
            });
    }

    fullForkPost(requests: Array<any>, errorText: string = '网络请求失败', showToast?: string): Observable<any> {
        const observableBatch = [];
        for (const item of requests) {
            observableBatch.push(this.fullPost(item.url, item.params, errorText, showToast));
        }
        return Observable.forkJoin(observableBatch).map((res) => {
            return res;
        }).timeout(this.timeout).catch((error: Response | any) => {
            this.showErrorToast('网络出现问题,请稍候再试');
            return Observable.throw(error);
        });
    }

    /**
     * 使用domain的get请求
     *
     * @param {string} url 地址路径
     * @param {*} [params] 请求参数 可选
     * @param {string} [loadingText] 请求中的提示信息 可选
     * @param {string} [errorText='网络请求失败'] 请求失败信息 可选 默认'网络请求失败'
     * @returns {Observable<any>} Observable请求结果
     *
     * @memberOf DfHTTP
     */
    get(url, params?, errorText?: string): Observable<any> {
        const fullURL = this.domain + url;
        return this.fullGet(fullURL, params, errorText);
    }

    /**
     * 使用domain的post请求
     *
     * @param {string} url 地址路径
     * @param {*} [params] 请求参数 可选
     * @param {string} [loadingText] 请求中的提示信息 可选
     * @param {string} [errorText='网络请求失败'] 请求失败信息 可选 默认'网络请求失败'
     * @returns {Observable<any>} Observable请求结果
     *
     * @memberOf DfHTTP
     */
    post(url, params?, errorText?: string): Observable<any> {
        const fullURL = this.domain + url;
        return this.fullPost(fullURL, params, errorText);
    }

    /**
     *
     *
     * @param {any} url  地址
     * @param {any} urlParmas  分页参数
     * @param {any} [params]   请求参数
     * @param {string} [errorText]
     * @returns {Observable<any>}
     * @memberof DfHTTP
     */
    pagePost(url, urlParmas?, params?, errorText?: string): Observable<any> {
        let fullURL = this.domain + url;
        // let fullURL = url;
        fullURL += '?';
        for (const key in urlParmas) {
            if (urlParmas.hasOwnProperty(key)) {
                fullURL += `${key}=${urlParmas[key]}&`;
            }
        }
        return this.fullPost(fullURL, params, errorText);
    }

    private showErrorToast(errorText: string, errorTitle?: string) {
        const notifyConfig = {
            timeout: 3000,
            progress: true,
            rtl: false
        };
        this.notifyService.error(errorTitle ? errorTitle : 'ERROR', errorText, notifyConfig);
    }

}
