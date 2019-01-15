// ==UserScript==
// @name         网站后台生成订单sku
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  网站后台生成订单sku
// @author       Kung
// @match        https://www.caryelectronic.com/538xd2oda/index.php?controller=AdminOrders&id_order*
// @grant GM_setClipboard
// @grant GM_notification
// ==/UserScript==

const log = console.log.bind(console);

function get_sku(text) {
    let re = /Reference number (.+)<br>/g;
    let matches = re.exec(text);
    if (matches && matches.length > 1) {
        return matches[1];
    }
}

function dom(tag, attr, inner) {
    let el = document.createElement(tag);
    for (let key in attr) {
        if (attr.hasOwnProperty(key)) {
            el.setAttribute(key,attr[key]);
        }
    }
    if (inner) {
        el.innerHTML = inner;
    }
    return el;
}

function main(){
    let order_lists = document.getElementById("orderProducts");
    let orders = order_lists.querySelectorAll("tr.product-line-row");
    for (let i = 0; i < orders.length; i++) {
        let order = orders[i];
        let this_tds = order.querySelectorAll("td");
        let product = this_tds[1].querySelector("a").innerHTML;
        let sku = get_sku(product);
        let qty = this_tds[3].querySelector("span").textContent;
        sku = qty + "x" + sku;
        let my_td = dom("td", {class:"my_sku text-center"}, sku);
        order.replaceChild(my_td, this_tds[4]);
    }
    let this_ths = order_lists.querySelectorAll("th span");
    this_ths[3].textContent = "SKU";
}

log(window.setTimeout(function(){main();}, 1500));
