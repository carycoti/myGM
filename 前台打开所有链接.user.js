// ==UserScript==
// @name         前台打开所有链接
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  前台打开所有速卖通卖家后台的链接
// @author       Kung
// @match        https://gsp.aliexpress.com/*
// @match        https://www.dianxiaomi.com/*
// @grant GM_setClipboard
// @grant GM_notification
// ==/UserScript==

const log = console.log.bind(console);

function main(){
    let all_a = document.querySelectorAll("a");
    for (let i = 0; i < all_a.length; i++){
         if (all_a[i].href) {
        all_a[i].target = "_self";
    }
    }
}

log(window.setTimeout(function(){main();}, 1500));
