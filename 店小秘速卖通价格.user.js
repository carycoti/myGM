// ==UserScript==
// @name         店小秘速卖通价格
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  店小秘速卖通产品的价格
// @author       Kung
// @match        *://www.dianxiaomi.com/smtProduct/batchEdit.htm
// @grant        GM_setClipboard
// @grant        GM_notification
// ==/UserScript==

function main() {
    let this_div = document.querySelectorAll('div.typeDiv');
    let num = this_div.length / 12;
    let result = [];
    for (let i = 0; i < num; i++) {
        let sku = this_div[6 + 12 * i].querySelector('input').value;
        let price = this_div[3 + 12 * i].querySelector('input').value;
        let str = [];
        str.push(sku);
        str.push(price);
        let str1 = str.join("\t");
        result.push(str1);
    }
    let rst = result.join("\n");
    GM_setClipboard(rst);
    GM_notification("SKU & 价格已复制到剪切板中~");
}
