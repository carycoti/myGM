// ==UserScript==
// @name         店小秘客服+++
// @namespace    https://github.com/carycoti/myGM
// @version      2.2.0
// @description  店小秘自动勾选nextMsg：提交发送后，自动打开下一封消息;在回信页面添加历史订单链接
// @author       Kung
// @match        *://www.dianxiaomi.com/ebayMessage/edit.htm*
// @match        *://www.dianxiaomi.com/smtOrderMessage/getMsgsdetail.htm*
// ==/UserScript==

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

function checked() {
    let this_input = document.getElementById('nextMsg');
    this_input.checked = "checked";
}

function add_history_orders() {
    try {
        let this_table = document.querySelector(".tableIn");
        let this_div = this_table.querySelector("tr td div");
        let this_span = this_div.querySelector("span");
        let customer = this_div.querySelector("a").textContent;
        let order_url = 'https://www.dianxiaomi.com/package/searchPackage.htm?pageNo=0&pageSize=100&state=shipped&shopId=-1&history=&searchType=buyerAccount&content=' + customer + '&isVoided=0&isRemoved=0&commitPlatform=success&platform=&isGreen=0&isYellow=0&isOrange=0&isRed=0&isViolet=0&isBlue=0&cornflowerBlue=0&pink=0&teal=0&turquoise=0&isSearch=0&isFree=-1&isBatch=-1&isOversea=-1&orderField=shipped_time';
        let my_a = dom('a', {id: 'add_history_orders', href: order_url, target: '_blank'}, '&nbsp; 历史订单>>>');
        this_div.replaceChild(my_a, this_span);
    }
    catch (e) {
        console.log(e);
    }
}

function add_smt_history_orders() {
        try {
        let this_div = document.querySelector("div.gray-b");
        let this_span = this_div.querySelector("span.blacklist-icons");
        let customer = this_div.querySelector("span.f-black").textContent;
        customer = customer.replace(" ", "%20");
        console.log(customer);
        let order_url = 'https://www.dianxiaomi.com/package/searchPackage.htm?pageNo=0&pageSize=100&state=shipped&shopId=-1&history=&searchType=contactName&content=' + customer + '&isVoided=0&isRemoved=0&commitPlatform=success&platform=&isGreen=0&isYellow=0&isOrange=0&isRed=0&isViolet=0&isBlue=0&cornflowerBlue=0&pink=0&teal=0&turquoise=0&isSearch=1&isFree=-1&isBatch=-1&isOversea=-1&orderField=shipped_time';
        let my_a = dom('a', {id: 'add_smt_history_orders', href: order_url, target: '_blank'}, '&nbsp; 历史订单>>>');
        this_div.replaceChild(my_a, this_span);
    }
    catch (e) {
        console.log(e);
    }
}
function main() {
    checked();
    add_history_orders();
}

main();
