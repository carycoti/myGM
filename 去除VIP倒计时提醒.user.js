// ==UserScript==
// @name        去除VIP倒计时提醒
// @namespace   *
// @description 去除店小秘VIP倒计时提醒
// @author       Kung
// @include     https://www.dianxiaomi.com/*
// @include     https://dianxiaomi.com/*
// @include     https://*.dianxiaomi.com/*
// @version     1.0.0
// @grant       none
// ==/UserScript==

var adSidebar = document.getElementById('expireVipShowModal');
if (adSidebar) {
	adSidebar.parentNode.removeChild(adSidebar);
}