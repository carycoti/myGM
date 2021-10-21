// ==UserScript==
// @name         淘宝订单
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  生成淘宝订单，方便写单
// @author       Kung
// @match        https://trade.taobao.com/trade/itemlist/list_sold_items*
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        GM_getResourceText
// @grant        GM_log
// ==/UserScript==

function main() {
    $(document).ready(function () {
        $("div.trade-order-main").each(function () {
            if ($(this).find("tr.suborder-mod__item___dY2q5").length > 0) {
                let this_product = $(this).find("tr.suborder-mod__item___dY2q5");
                let total = "";
                for (let k = 0; k < this_product.length; k++) {
                    let this_td = $(this_product[k]).find("td.sol-mod__no-br___1FsWT");
                    let qty_td = this_td.get(2);
                    let qty = $(qty_td).text();
                    let sku_span = this_td.get(0);
                    let sku_text = $(sku_span).text();
                    let sku = sku_text.split("：")[1];
                    sku = sku.replace("GZ", "");
                    sku = sku.replace("商家编码", "");
                    let this_total = sku + "&nbsp;&nbsp;" + qty + "个 + ";
                    total += this_total;
                }
                let buyer = $(this).find(".buyer-mod__name___S9vit").text();
                total = total.substring(0, total.lastIndexOf(' + '));
                total = "<span class=\"item-mod__create-time___1DIMJ\">" + buyer + "：" + total + "：" + "</span>";
                $(this).find(".item-mod__checkbox-label___cRGUj").append(total);
            }
        });
    });
}

window.setTimeout(function () {
    main();
}, 0);