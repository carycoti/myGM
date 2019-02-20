// ==UserScript==
// @name         追踪号加链接
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  追踪号加链接
// @author       Kung
// @match        https://www.dianxiaomi.com/package/searchPackage*
// @grant GM_setClipboard
// @grant GM_notification
// ==/UserScript==

function main(){
let tracking_numbers = document.querySelectorAll("span.limingcentUrlpicson");
for (let i = 0; i < tracking_numbers.length; i++) {
    let tracking_number_a = tracking_numbers[i].querySelector("a");
    let tracking_number = tracking_number_a.textContent;
    tracking_number_a.href = 'https://t.17track.net/en#nums=' + tracking_number;
    tracking_number_a.target = "_blank";
    }
}

main();
