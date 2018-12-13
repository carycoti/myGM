// ==UserScript==
// @name         店小秘速卖通价格
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  店小秘速卖通产品的价格
// @author       Kung
// @match        *://www.dianxiaomi.com/smtProduct/batchEdit.htm
// @grant        GM_setClipboard
// @grant        GM_notification
// ==/UserScript==

function main() {
    let re = /.+(\d+).+?/g;
    let this_div = document.querySelectorAll('div.typeDiv');
    let num = this_div.length / 12;
    let result = [];
    for (let i = 0; i < num; i++) {
        let sku = this_div[6 + 12 * i].querySelector('input').value;
        let title = this_div[12 * i].querySelector('textarea').textContent;
        let group = this_div[1 + 12 * i].querySelector('a[name=real]').textContent.trim();
        let qty = this_div[2 + 12 * i].querySelector('a[name=real]').textContent.trim();
        matches = re.exec(qty);
        if (matches && matches.length > 1) {
            qty = parseInt(matches[1]);
        }
        else {
            qty = 1;
        }
        let price = this_div[3 + 12 * i].querySelector('input').value;
        let weight = this_div[8 + 12 * i].querySelector('input').value;
        let str = [];
        str.push(sku);
        str.push(title);
        str.push(group);
        str.push(qty);
        str.push(price);
        str.push(weight);
        let str1 = str.join("\t");
        result.push(str1);
    }
    let rst = result.join("\n");
    GM_setClipboard(rst);
    GM_notification("SKU & 价格已复制到剪切板中~");
}

window.setTimeout(function(){main();}, 1000);
