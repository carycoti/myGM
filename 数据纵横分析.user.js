// ==UserScript==
// @name         数据纵横分析
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  通哥数据分析-市场综合评分
// @author       Kung
// @match        https://sycm.aliexpress.com/mc/MarketOverview*
// @require      https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @grant        GM_log
// @grant        GM_setClipboard
// @grant        GM_notification
// ==/UserScript==


function get_number(txt) {
    let re = /([\d,.]+)/g;
    let matches = re.exec(txt);
    if (matches && matches.length > 1) {
		let rst = matches[1];
		rst = rst.replace(/,/g, "")
        return rst;
    }
}

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
	let score_th = '<th class=""><span><div class="alife-dt-card-common-table-sortable-th alife-dt-card-common-table-payPerBuyerAmt sortable-th-true"><span style="cursor: pointer;">得分</span><span class="alife-dt-card-common-table-sortable-icon-wrapper" style="cursor: pointer;"><i class="anticon anticon-arrow-up oui-canary-icon oui-canary-icon-arrow-up alife-dt-card-common-table-sortable-up-icon"></i><i class="anticon anticon-arrow-down oui-canary-icon oui-canary-icon-arrow-down alife-dt-card-common-table-sortable-down-icon"></i></span></div></span></th>';
	$("div.ant-table-body table thead.ant-table-thead tr:first-child").append(score_th);
}

function get_value() {
	$("tbody.ant-table-tbody tr").each(function () {
		// 搜索指数
		let search_index = $(this).find("td")[2].innerText;
		search_index = get_number(search_index)
		GM_log("搜索指数为: " + search_index)
		// 供需指数
		let supply_and_demand_index = $(this).find("td")[5].innerText;
		supply_and_demand_index = get_number(supply_and_demand_index)
		GM_log("供需指数为: " + supply_and_demand_index)
		// supply_and_demand_index = supply_and_demand_index.replace("%", "");
		// supply_and_demand_index = supply_and_demand_index / 100;
		// 支付金额占比
		let rate_of_payment = $(this).find("td")[6].innerText;
		// rate_of_payment = rate_of_payment.replace("%", "");
		// rate_of_payment = rate_of_payment / 100;
		rate_of_payment = get_number(rate_of_payment);
		rate_of_payment = rate_of_payment / 100;
		GM_log("支付金额占比为: " + rate_of_payment)
		// 客单价
		let customer_price = $(this).find("td")[7].innerText;
		customer_price = get_number(customer_price)
		GM_log("客单价为: " + customer_price)
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
		$("a.common-picker-header, ul.ant-pagination, button.oui-canary-btn").click(function () {
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