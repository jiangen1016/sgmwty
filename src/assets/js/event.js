$(document).ready(function () {
    $(document).on("click", ".close-btn", function () {
        if (!$(this).find('i').hasClass("close-menu")) {
            $(this).find('i').addClass("close-menu");

        } else {
            $(this).find('i').removeClass("close-menu");
        }
        if ($(this).parents('.ibox-title').eq(0)) {
            $(this).parents('.ibox-title').eq(0).siblings(".search-grounp-public").eq(0).slideToggle(
                200);
        }
        return false;
    })

    $(document).on("click", ".heaer-toggle", function () {
        if (!$(this).hasClass("close-menu")) {
            $(this).addClass("close-menu");
            $(".main-meun").eq(0).css("left", "-250px");
            $(".main-content").eq(0).css("margin-left", "0px");
            // $(".my-table .fixed-div .fixed-left").eq(0).css("left", "0px");
            // tableSize();
        } else {
            $(this).removeClass("close-menu");
            $(".main-meun").eq(0).css("left", "0px");
            $(".main-content").eq(0).css("margin-left", "250px");
            // $(".my-table .fixed-div .fixed-left").eq(0).css("left", "250px");
            // tableSize();
        }
        return false;
    })

    $(document).on("click", ".prinsBtn", function () {

        if (!window.ActiveXObject || "ActiveXObject" in window) {
            var hkey_root, hkey_path, hkey_key;
            hkey_path = "HKEY_CURRENT_USER\\Software\\Microsoft\\Internet Explorer\\PageSetup\\";
            try {
                var RegWsh = new ActiveXObject("WScript.Shell");
                RegWsh.RegWrite(hkey_path + "header", "");
                RegWsh.RegWrite(hkey_path + "footer", "");
            } catch (e) {}
        }

        $(".print-main-content img").css("max-width", "1000px");
        $(".print-main-content img").css("margin-right", "40px");
    });

    window.DownLoadFile = function (options) {
        var config = $.extend(true, {
            method: 'post'
        }, options);
        var $iframe = $('<iframe id="down-file-iframe" />');
        var $form = $('<form target="down-file-iframe" method="' + config.method + '" />');
        $form.attr('action', config.url);
        for (var key in config.data) {
            $form.append('<input type="hidden" name="' + key + '" value="' + config.data[key] + '" />');
        }
        $iframe.append($form);
        $(document.body).append($iframe);
        $form[0].submit();
        $iframe.remove();
    }

    $(document).keyup(function (e) {
        var e = e || event;
        if (e && e.keyCode == 27) {
            var modal = $(".modal-key");
            if (modal.length) {
                // modal.eq(0).find(".close").eq(0).click();
                modal.each(function (index, _this) {
                    var this_modal = $(_this);
                    if (this_modal.hasClass('show')) {
                        this_modal.find("button.close").eq(0).trigger('click');
                        return false;
                    }
                })
            }
        }
    })

    $(document).scroll(".my-table", function () {
        tableSize();
    });

    function tableSize() {
        var table = $(".my-table").eq(0); //my table
        if (table.length) {
            var tableTop = table.offset().top ? table.offset().top : $(".my-table").eq(0).offsetTop;
            var documentScrollTop = document.documentElement.scrollTop;
            if ((tableTop - documentScrollTop) < 55) {
                var tableThead = table.find('app-dreams-table table thead'); //表头
                var tableTH = tableThead.find("tr th");
                var newDiv = $(
                    "<div class='fixed-div'><div class='fixed-left fixed-div'></div><div class='fixed-right fixed-div'></div></div>"
                );
                var newTable = $("<table class='fixed-table'></table>"); //新建一个表格
                var newTableThead = $("<thead><tr></tr></thead>"); //新建表格中插入表头
                newTable.width(tableThead[0].offsetWidth);
                $(".fixed-div").eq(0).css("left", $(".my-table").find(".ui-datatable-tablewrapper")
                    .eq(0).offset().left);
                newTableThead.find("tr").attr("class", "").find("th").attr("class", ""); //去掉表格中的样式
                // 把每个TD  赋值
                for (var i = 0; i < tableTH.length; i++) {
                    var newTH = $("<th>" + tableTH[i].outerText + "</th>");
                    if (i == 0) {
                        newTH.width(tableTH.eq(i).outerWidth(true) + 1 + "px");
                    } else {
                        newTH.width(tableTH.eq(i).outerWidth(true) + "px");
                    }
                    newTableThead.find("tr").append(newTH);
                }
                // if (!$(".heaer-toggle").hasClass("close-menu")) {
                //     newDiv.find(".fixed-left").css("left", "0px");
                // } else {
                //     newDiv.find(".fixed-left").css("left", "250px");
                // }
                //把每个TD  赋值
                newTableThead.appendTo(newTable); //表头插入新建的 表格中
                newDiv.append(newTable);
                //如果没有 这个表头 则插入
                if (table[0].children.length == 1) {
                    table.append(newDiv);
                }
            } else {
                // 移除新建的表头
                table.find(".fixed-div").remove();
            }
        }
    }
})
