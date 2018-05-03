import { Component, OnInit } from '@angular/core';
import { MenuService, MenuRequest, MenuResponse, MenuIcon } from './menu.service';
import { LocalStorage } from '../localStorage/localStorage.component';
import { MenuItem } from 'primeng/primeng';
import { AppService } from '../../../../app.service';
import { ToastService } from '../../service/toast.service';

@Component({
    selector: 'app-dreams-menu',
    templateUrl: 'menu.component.html'
})

export class MenuComponent {
    private menuList: Array<any> = [];
    private menuRequest: MenuRequest = new MenuRequest();
    private menuIcon: MenuIcon = new MenuIcon();
    displayMenuList: Array<any> = [];
    // TODO: 删除
    isOpenOne = true;
    isOpenTwo = false;
    isOpenThree = false;
    isOpenFour = false;
    isOpenFive = false;
    openChange1(type) {
        this.isOpenOne = false;
        this.isOpenTwo = false;
        this.isOpenThree = false;
        this.isOpenFour = false;
        this.isOpenFive = false;
        this[type] = true;
    }

    display = {};
    items: MenuItem[] = [];
    constructor(
        private menuService: MenuService,
        private ls: LocalStorage,
        private appService: AppService,
        private toastService: ToastService

    ) {
        this.display = this.ls.getObject('display');
        // this.displayMenuList = [
        //     {
        //         label: this.display.Workbench,
        //         icon: 'fa-desktop',
        //         expanded: true,
        //         command: (event?: any) => {
        //             for (let item of this.items) {
        //                 if (item.label.indexOf(event.item.label) < 0) {
        //                     item.expanded = false;
        //                 }
        //             }
        //         },
        //         items: [
        //             {
        //                 label: this.display.ApprovalList,
        //                 routerLink: ['/work/approve']
        //             },
        //             {
        //                 label: this.display.CreateApplication,
        //                 routerLink: ['/work/creat']
        //             },
        //             {
        //                 label: this.display.DraftBox,
        //                 routerLink: ['/work/drafts']
        //             },
        //             {
        //                 label: this.display.MyApplication,
        //                 routerLink: ['/work/apply']
        //             },
        //             {
        //                 label: this.display.ApplicationTracking,
        //                 routerLink: ['/work/track']
        //             },
        //             {
        //                 label: this.display.OutAuthorization,
        //                 routerLink: ['/work/entrust']
        //             },
        //             {
        //                 label: this.display.PersonalInformation,
        //                 routerLink: ['/work/info']
        //             }
        //         ]
        //     },
        //     {
        //         label: this.display.BusinessProcessing,
        //         icon: 'fa-check-square-o',
        //         command: (event?: any) => {
        //             for (let item of this.items) {
        //                 if (item.label.indexOf(event.item.label) < 0) {
        //                     item.expanded = false;
        //                 }
        //             }
        //         },
        //         items: [
        //             {
        //                 label: this.display.DocumentProcessing,
        //                 routerLink: ['/handle/handleBill']
        //             },
        //         ]
        //     },
        //     {
        //         label: this.display.ApplicationConfiguration,
        //         icon: 'fa-cogs',
        //         command: (event?: any) => {
        //             for (let item of this.items) {
        //                 if (item.label.indexOf(event.item.label) < 0) {
        //                     item.expanded = false;
        //                 }
        //             }
        //         },
        //         items: [
        //             {
        //                 label: this.display.RoleConfiguration,
        //                 routerLink: ['/config/role']
        //             },
        //             {
        //                 label: this.display.DictionaryConfiguration,
        //                 routerLink: ['/config/word']
        //             }
        //         ]
        //     },
        //     {
        //         label: this.display.ManagementTool,
        //         icon: 'fa-lock',
        //         command: (event?: any) => {
        //             for (let item of this.items) {
        //                 if (item.label.indexOf(event.item.label) < 0) {
        //                     item.expanded = false;
        //                 }
        //             }
        //         },
        //         items: [
        //             {
        //                 label: this.display.ProcessTransfer,
        //                 routerLink: ['/admin/processTranfer']
        //             }
        //         ]
        //     },
        //     {
        //         label: this.display.OnlineHelp,
        //         icon: 'fa-comments-o',
        //         command: (event?: any) => {
        //             for (let item of this.items) {
        //                 if (item.label.indexOf(event.item.label) < 0) {
        //                     item.expanded = false;
        //                 }
        //             }
        //         },
        //         items: [
        //             {
        //                 label: this.display.HelpDocument,
        //                 routerLink: ['/help/word-help']
        //             }
        //         ]
        //     }


        // ];
        // this.appService.languageChange$.subscribe((data) => {
        //     if (data) {
        //         this.display = this.ls.getObject('display'); // 获取显示字段
        //     }
        //     // this.displayMenu();
        // })
        this.appService.getMenu$.subscribe((data) => {
            if (data) {
                // this.display = this.ls.getObject('display'); // 获取显示字段
                this.displayMenu();
            }
        });
        this.displayMenu();
    }

    /**
     * 获取菜单信息
     * jiangen  2017-12-8 18:30:56
     * @memberof MenuComponent
     */
    displayMenu() {
        const urlParam = {
            languageCode: this.ls.get('language')
        };
        const params = {
            userUid: this.ls.get('userId')
        };
        if (this.ls.get('userId')) {
            this.menuService.getMenuList(urlParam, params)
                .subscribe((res: MenuResponse) => {
                    if (res.code === 'SUCCESS') {
                        this.menuList = res.data;
                        if (this.menuList && this.menuList.length) {
                            const menuArrs = [];
                            for (let i = 0; i < this.menuList.length; i++) {
                                const menuId = this.menuList[i].parentMenuInfo.menuInfoListInfo.menuInfo.menuId + '';
                                const menuItem = {
                                    label: this.menuList[i].parentMenuInfo.menuInfoListInfo.menuName,
                                    icon: this.menuIcon[menuId],
                                    expanded: i ? false : true,
                                    command: (event?: any) => {
                                        for (const item of this.displayMenuList) {
                                            if (item.label.indexOf(event.item.label) < 0) {
                                                item.expanded = false;
                                            }
                                        }
                                    },
                                    items: []
                                };
                                if (this.menuList[i].parentMenuInfo.subMenuList && this.menuList[i].parentMenuInfo.subMenuList.length) {
                                    for (const childrenMenu of this.menuList[i].parentMenuInfo.subMenuList) {
                                        const menuIda = childrenMenu.menuInfo.menuId + '';
                                        const childrenObj = {
                                            label: childrenMenu.menuName,
                                            icon: this.menuIcon[menuIda],
                                            routerLink: [childrenMenu.menuInfo.functionUrl]
                                        };
                                        this.appService.canIroute.push(childrenMenu.menuInfo.functionUrl);
                                        menuItem.items.push(childrenObj);
                                    }
                                }

                                menuArrs.push(menuItem);
                            }
                            this.displayMenuList = menuArrs;
                            console.log(this.displayMenuList);
                        }
                        this.openChange(0);
                    } else {
                        this.toastService.showError('ERROR', res.msg);
                    }
                });
        }

    }

    /**
     * 切换菜单
     * zw 2017年11月24日14:41:54
     * @param i
     * @memberof MenuComponent
     */
    openChange(i) {
        for (const item of this.menuList) {
            item['open'] = false;
        }
        if (this.menuList[i]) {
            this.menuList[0]['open'] = true;
        }
    }
}
