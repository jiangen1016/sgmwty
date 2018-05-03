import { Injectable } from '@angular/core';
import { NetworkConfig } from '../../../../app.service';
import { DfHTTP } from '../../../../app.network.service';

export class MenuRequest {
    userUid: string;
    languageCode: string;
}

// export class MenuRequestLanguage {
//     languageCode: string;
// }

export class MenuResponse {
    code: string;
    msg: string;
    data: any;
}

export class MenuIcon {
    '1' = 'fa fa-desktop'; // 工作台
    '2' = 'fa fa-search';
    '3' = 'fa fa-check-square-o'; // 业务处理
    '4' = 'fa fa-cogs'; // 应用配置
    '5' = 'fa fa-lock'; // 管理工具
    '6' = 'fa fa-comments-o'; // 在线帮助
    '11' = 'fa fa-list-ol'; // 审批列表
    '12' = 'fa fa-plus'; // 申请创建
    '13' = 'fa fa-pencil-square-o'; // 草稿箱
    '14' = 'fa fa-list-ol'; // 我的申请
    '15' = 'fa fa-list-ol'; // 申请单跟踪放
    '16' = 'fa fa-sitemap'; // 外出授权
    '17' = 'fa fa-user'; // 个人信息
    '21' = 'fa fa-bar-chart-o';
    '31' = 'fa fa-bar-chart-o'; // 单据处理
    '41' = 'fa fa-cog'; // 角色配置
    '42' = 'fa fa-cog'; // 字典配置
    '43' = 'fa fa-cog'; // 签名配置
    '51' = 'fa fa-cog'; // 流程管理
    '52' = 'fa fa-cog'; // 字典配置
    '61' = 'fa fa-paste'; // 帮助文档
}

@Injectable()
export class MenuService {

    constructor(
        private dfHTTP: DfHTTP
    ) { }

    /**
     * 获取菜单列表
     * zw 2017年11月24日11:33:25
     * @param params
     * @memberof MenuService
     */
    getMenuList(urlParams, params) {

        return this.dfHTTP.pagePost(NetworkConfig.path.getMenuInfo, urlParams,
            params).map((res: MenuResponse) => {
                return res;
            }, (error) => {
                return error;
            });
    }
}
