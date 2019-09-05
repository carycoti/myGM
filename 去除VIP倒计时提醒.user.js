// ==UserScript==
// @name        去除VIP倒计时提醒
// @namespace   https://github.com/carycoti/myGM
// @description 去除店小秘VIP倒计时提醒
// @author      Kung
// @include     https://www.dianxiaomi.com/*
// @include     https://dianxiaomi.com/*
// @include     https://*.dianxiaomi.com/*
// @version     1.1.0
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @grant       none
// ==/UserScript==

const log = console.log.bind(console);

function main() {
	const adSidebar = document.getElementById('expireVipShowModal');
	if (adSidebar) {
		adSidebar.parentNode.removeChild(adSidebar);
	}
	log($('div.modal-dialog[role="document"]').remove());
	log($("div.modal-content.bs-example.bs-example-tabs.col-xs-12").remove());
}

log(window.setTimeout(function () {main();}, 1000));
