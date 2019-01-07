// ==UserScript==
// @name         AE前台链接
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  在管理产品的后台添加相应产品的前台的链接
// @author       Kung
// @match        http://posting.aliexpress.com/wsproduct/manage/list.htm
// @grant GM_setClipboard
// @grant GM_notification
// ==/UserScript==

const log = console.log.bind(console);

function get_product_id(url) {
    let re = /productId=(\d+)/g;
    let matches = re.exec(url);
    if (matches && matches.length > 1) {
        return parseInt(matches[1]);
    }
}

function main(){
    let title = document.querySelectorAll("a.p-subject");
    for (let i = 0; i < title.length; i++) {
        let productid = get_product_id(title[i].href);
        log(productid)
    }
}

log(window.setTimeout(function(){main();}, 1500));
