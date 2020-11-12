// ==UserScript==
// @name         利润计算器
// @namespace    http://tampermonkey.net/
// @version      1.3.0
// @description  利润计算器
// @author       Kung
// @match        https://members.helium10.com/black-box*
// @match        https://members.helium10.com/black-box/my-list*
// @require      https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @resource     custom_css https://cdn.jsdelivr.net/gh/carycoti/myGM@master/style/style.css
// @grant        GM_log
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// ==/UserScript==

function add_readfree_style() {
	GM_addStyle(GM_getResourceText("custom_css"));
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

function get_rate() {
	$(document).ready(function () {
		$('#bb-table tbody tr').each(function (i) {
			if (i % 2 == 0) {
				try {
					let my_div = $(this).find("div.mr-3 > div.mt-1")[0];
					let numberOfSellersTD = $(this).find(".numberOfSellers-column")[0];
					let numberOfSellers = numberOfSellersTD.innerText;
					let monthlyRevenueTD = $(this).find(".monthlyRevenue-column")[0];
					let asin = my_div.innerText;
					let monthlyRevenue = monthlyRevenueTD.innerText;
					monthlyRevenue = monthlyRevenue.replace(/[$,]/g, "");
					// 默认为美国站: marketplaceId=ATVPDKIKX0DER 其他站点可以改成对应的marketplaceId, 参考以下链接:
					// http://docs.developer.amazonservices.com/zh_CN/dev_guide/DG_Endpoints.html
					let api_url = "https://das-server.tool4seller.cn/ap/fba/calculate?marketplaceId=ATVPDKIKX0DER&asin=" + asin;
					GM_xmlhttpRequest({
						method: "GET",
						url: api_url,
						headers: {
							'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
							'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
							'Cookie': '_ga=GA1.2.107451784.1605067144; _gid=GA1.2.382883749.1605067144; __root_domain_v=.tool4seller.cn; _qddaz=QD.2zmis3.ispgxl.khcvjii2; Hm_lvt_569f3a439a97ca4944bfec5572da3369=1605067145,1605068601,1605070250; Hm_lpvt_569f3a439a97ca4944bfec5572da3369=1605071825',
						},
						onload: function (response) {
							if (response.status === 200) {
								let result = JSON.parse(response.responseText);
								if (result.status === 1) {
									let item_info = result.content;
									let amount = item_info.amount;
									let fbaFee = item_info.fbaFee;
									let storageFee = item_info.storageFee;
									let listFee = 0;
									let referralFee = amount * 0.15;
									let UnitManufacturingFee = amount * 0.2;
									let height = item_info.height;
									height = height * 2.54;
									let width = item_info.width;
									width = width * 2.54;
									let length = item_info.length;
									length = length * 2.54;
									let weight = item_info.weight;
									weight = weight * 0.4536;
									let volumeWeight = height * length * width / 5000;
									let EstFreightCost = 9;
									let freightFee = 0;
									if (volumeWeight > weight) {
										freightFee = volumeWeight * EstFreightCost;
									} else {
										freightFee = weight * EstFreightCost;
									};
									let profit = amount - fbaFee - storageFee - listFee - referralFee - UnitManufacturingFee - freightFee;
									let margin_num = profit / amount * 100;
									let margin = margin_num.toFixed(2);
									margin = margin + "%";
									let monthlyProfit = monthlyRevenue * margin_num / numberOfSellers / 100;
									monthlyProfit = monthlyProfit.toFixed(2);
									// 创建相应的div
									if ($(my_div).find(".set-margin")) {
										$($(my_div).find(".set-margin")[0]).remove();
									}
									let margin_html = '<strong>Margin: <span class="text-rate">' + margin + '</span></strong>'
									let score_div = dom("div", {
										"class": "text-center mt-1 set-margin"
									}, margin_html);
									my_div.append(score_div);
									if ($(monthlyRevenueTD).find(".set-profit")) {
										$($(monthlyRevenueTD).find(".set-profit")[0]).remove();
									}
									let profit_html = '<strong><span class="text-rate">$' + monthlyProfit + '</span></strong>'
									let profit_div = dom("div", {
										"class": "text-center mt-1 set-profit"
									}, profit_html);
									$(monthlyRevenueTD).append(profit_div);
								}
							}
						}
					})
				} catch (err) {};
			}
		});
	});
}

function remove_margin() {
	$(".set-margin").each(function () {
		$(this).remove();
	});
	$(".set-profit").each(function () {
		$(this).remove();
	});
}

function main() {
	$(document).ready(function () {
		window.setTimeout(function () {
			remove_margin();
			get_rate();
		}, 1500);
		$(".action-load-selected-project").click(function () {
			window.setTimeout(function () {
				remove_margin();
				get_rate();
			}, 15000);
		});
		$("body").on("click", "nav,.action-load-selected-project,.page-item,#w0,.pagination,.page-link,.action-search", function () {
			window.setTimeout(function () {
				remove_margin();
				get_rate();
			}, 1500);
		});
	});
}

GM_log(window.setTimeout(function () {
	add_readfree_style();
	main();
}, 1500));