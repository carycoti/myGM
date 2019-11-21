// ==UserScript==
// @name         通哥数据分析
// @namespace    http://tampermonkey.net/
// @version      1.3.1
// @description  通哥数据分析-市场综合评分
// @author       Kung
// @match        https://datamatrix.aliexpress.com/cateAnalyze.htm*
// @require      https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @grant        GM_log
// @grant        GM_setClipboard
// @grant        GM_notification
// ==/UserScript==

function dom(tag, attr, inner) {
	let el = document.createElement(tag);
	for (let key in attr) {
		if (attr.hasOwnProperty(key)) {
			el.setAttribute(key, attr[key]);
		}
	}
	if (inner) {
		el.innerHTML = inner;
	}
	return el;
}

function add_th() {
	let score_th = dom("th", {
			'rowspan': "2",
			"style": "border: 2px solid #FFF;"
		},
		'得分');
	$("#src-tb thead tr:first-child").append(score_th);
}

function get_value() {
	$("#tb-tbody tr").each(function () {
		// 搜索指数
		let search_index = $(this).find("td")[1].innerText;
		// 供需指数
		let supply_and_demand_index = $(this).find("td")[3].innerText;
		supply_and_demand_index = supply_and_demand_index.replace("%", "");
		supply_and_demand_index = supply_and_demand_index / 100;
		// 支付金额占比
		let rate_of_payment = $(this).find("td")[4].innerText;
		rate_of_payment = rate_of_payment.replace("%", "");
		rate_of_payment = rate_of_payment / 100;
		// 客单价
		let customer_price = $(this).find("td")[6].innerText;
		// 购买力
		let purchase_power = rate_of_payment / search_index;
		// 得分
		let score = (search_index * purchase_power * customer_price) / supply_and_demand_index;
		score = score.toFixed(2);
		// 创建相应的td
		let score_td = dom("td", {
			"class": "tb-normal-score"
		}, score);
		$(this).append(score_td);
	});
}

function main() {
	$(document).ready(function () {
		window.setTimeout(function () {
			add_th();
			get_value()
		}, 1500);
		$("#selectedLastInfo").click(function () {
			window.setTimeout(function () {
				add_th();
				get_value()
			}, 1500);
		});
	})
}

window.setTimeout(function () {
	main();
}, 1500);