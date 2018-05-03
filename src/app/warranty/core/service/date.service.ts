import { Injectable } from '@angular/core';

@Injectable()
export class DateService {

    constructor() { }

    getDateStr(date: Date): string {
        return this.formatDate(date, 'yyyy-MM-dd HH:mm:ss');
    }

    getShortDateStr(date: Date): string {
        return this.formatDate(date, 'yyyy-MM-dd');
    }

    /**
     * 截取日期
     * yyyy-MM-dd HH:mm:ss --> yyyy-MM-dd
     * @param {string} dateStr
     * @returns {string}
     * @memberof DateService
     */
    subTime(dateStr: string): string {
        let temp = dateStr;
        if (dateStr) {
            const index = dateStr.indexOf(' ');
            temp = dateStr.substring(0, index < 0 ? dateStr.length : index);
        }
        return temp;
    }

    formatDate(date: Date, formatter: string): string {
        const o = {
            'M+': date.getMonth() + 1, // 月份
            'd+': date.getDate(), // 日
            'H+': date.getHours(), // 小时
            'm+': date.getMinutes(), // 分
            's+': date.getSeconds(), // 秒
            'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
            'S': date.getMilliseconds() // 毫秒
        };
        if (/(y+)/.test(formatter)) {
            formatter = formatter.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        for (const k in o) {
            if (new RegExp('(' + k + ')').test(formatter)) {
                if (o.hasOwnProperty(k)) {
                    formatter = formatter.replace(RegExp.$1,
                        (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
                }
            }
        }
        return formatter;
    }

    formatTime(date: string): string {
        let temp = date;
        if (date) {
            const index = date.lastIndexOf(':');
            temp = date.substring(0, index < 0 ? date.length : index);
        }
        return temp;
    }
    formatMonth(date: string): string {
        let temp = date;
        if (date) {
            const index = date.lastIndexOf('-');
            temp = date.substring(0, index < 0 ? date.length : index);
        }
        return temp;
    }

}

