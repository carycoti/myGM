// ==UserScript==
// @name         淘宝订单
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  生成淘宝订单，方便写单
// @author       Kung
// @match        https://trade.taobao.com/trade/itemlist/list_sold_items*
// ==/UserScript==

function main() {
    let orders = document.querySelectorAll("div.trade-order-main");
    for (let i = 0; i < orders.length; i++) {
        let total = "";
        let order = orders[i];
        let this_product = order.querySelectorAll("tr.suborder-mod__item___dY2q5");
        for (let k = 0; k < this_product.length; k++) {
            let this_td = this_product[k].querySelectorAll("td.sol-mod__no-br___1PwLO");
            let this_p = this_td[2].querySelector("div p");
            let qty = this_p.innerHTML;
            let this_span = this_td[0].querySelector("span.production-mod__sku-item___3zYoT");
            if (this_span) {
                let this_sku = this_span.querySelectorAll("span");
                let sku = this_sku[2].innerHTML;
                sku = sku.replace("GZ", "");
                let this_total = sku + "&nbsp;&nbsp;" + qty + "个 + ";
                total += this_total;
            } else {
                let this_sku = this_td[0].querySelectorAll("div div p span");
                let sku = this_sku[6].innerHTML;
                sku = sku.replace("GZ", "");
                let this_total = sku + "&nbsp;&nbsp;" + qty + "个 + ";
                total += this_total;
            }
        }
        let this_buyer = order.querySelector(".buyer-mod__buyer___3NRwJ p a");
        let buyer = this_buyer.innerHTML;
        total = total.substring(0, total.lastIndexOf(' + '));
        total = buyer + "：" + total + "：";
        let my_td = document.createElement("span");
        my_td.innerHTML = total;
        my_td.className = "item-mod__create-time___1DIMJ";
        let add_td = order.querySelector("td label");
        add_td.parentNode.insertBefore(my_td, add_td.nextSibling);
    }
}

window.setTimeout(function () {
    main();
}, 0);