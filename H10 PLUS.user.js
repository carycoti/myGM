// ==UserScript==
// @name         H10 PLUS
// @namespace    http://tampermonkey.net/
// @version      2.0.1
// @description  H10 PLUS
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

function fanyi(text, eldom) {
	// yeekit API
	// let app_kid = "5fad1a6e76c3c";
	// let app_key = "bc5cad061aab405e1b1331cf77a025d8";
	// let bath_url = "https://api.yeekit.com/dotranslate.php?from=en&to=zh&app_kid=";
	// let api_url = bath_url + app_kid + "&app_key=" + app_key + "&text=" + text;

	let api_url = "http://fanyi.youdao.com/translate?&doctype=json&type=AUTO&i=" + text
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
				result = result.translateResult[0][0].tgt;
				let fy_html = dom("p", {
					"class": "set-product-title"
				}, result);
				eldom.after(fy_html);
			}
		}
	});
}

function get_rate() {
	$(document).ready(function () {
		let url = $(document).find(".selected-domain")[0].innerText;
		let marketplaceId = 'ATVPDKIKX0DER';
		var vatrate = 0;
		var EstFreightCost = 9;
		if (url.indexOf("amazon.co.jp") != -1) {
			marketplaceId = 'A1VC38T7YXB528';
			EstFreightCost = 800;
		}
		else if (url.indexOf("amazon.co.uk") != -1) {
			marketplaceId = 'A1F83G8C2ARO7P';
			EstFreightCost = 7;
			vatrate = 20;
		}
		else if (url.indexOf("amazon.com.au") != -1) {
			marketplaceId = 'A39IBJ37TRP1C6';
			EstFreightCost = 15;
		}
		else if (url.indexOf("amazon.de") != -1) {
			marketplaceId = 'A1PA6795UKMFR9';
			EstFreightCost = 8;
			vatrate = 19;
		}
		else if (url.indexOf("amazon.it") != -1) {
			marketplaceId = 'APJ6JRA9NG5V4';
			EstFreightCost = 8;
			vatrate = 22;
		}
		else if (url.indexOf("amazon.es") != -1) {
			marketplaceId = 'A1RKKUPIHCS9HS';
			EstFreightCost = 8;
			vatrate = 21;
		}
		else if (url.indexOf("amazon.fr") != -1) {
			marketplaceId = 'A13V1IB3VIYZZH';
			EstFreightCost = 8;
			vatrate = 20;
		}
		else if (url.indexOf("amazon.nl") != -1) {
			marketplaceId = 'A1805IZSGTT6HS';
			EstFreightCost = 8;
			vatrate = 20;
		}
		else if (url.indexOf("amazon.ca") != -1) {
			marketplaceId = 'A2EUQ1WTGCTBG2';
		}
		else if (url.indexOf("amazon.com.mx") != -1) {
			marketplaceId = 'A1AM78C64UM0Y8';
		}
		else if (url.indexOf("amazon.in") != -1) {
			marketplaceId = 'A21TJRUUN4KGV';
		}
		$('#bb-table tbody tr').each(function (i) {
			if (i % 2 == 0) {
				try {
					let my_div = $(this).find("div.mr-3 > div.mt-1")[0];
					let numberOfSellersTD = $(this).find(".numberOfSellers-column")[0];
					let numberOfSellers = numberOfSellersTD.innerText;
					let monthlyRevenueTD = $(this).find(".monthlyRevenue-column")[0];
					let asin = my_div.innerText;
					let monthlyRevenue = monthlyRevenueTD.innerText;
					monthlyRevenue = monthlyRevenue.replace(/[$,£€CDN$₹ ￥]/g, "");
					let mediaBodyTd = $(this).find(".media-body")[0];
					let mediaBodyH5 = $(mediaBodyTd).find("h5")[0];
					let title = mediaBodyH5.innerText;
					title = title.replace(/[#$&*=\?%']/g, "");
					if ($(this).find(".h10-plus").length==0){
						$(this).append(dom("div", {"class": "h10-plus"}, ""));
						fanyi(title, mediaBodyH5);
						// 默认为美国站: marketplaceId=ATVPDKIKX0DER 其他站点可以改成对应的marketplaceId, 参考以下链接:
						// http://docs.developer.amazonservices.com/zh_CN/dev_guide/DG_Endpoints.html
						let api_url = "https://das-server.tool4seller.cn/ap/fba/calculate?marketplaceId=" + marketplaceId + "&asin=" + asin;
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
										let vatFee = amount / (100 + vatrate) * vatrate;
										let fbaFee = item_info.fbaFee;
										let storageFee = item_info.storageFee;
										let listFee = 0;
										let referralFee = amount * 0.15;
										let UnitManufacturingFee = amount * 0.2;
										UnitManufacturingFee = UnitManufacturingFee.toFixed(2);
										let heightUnits = item_info.heightUnits;
										let heightRate = 1;
										if (heightUnits.indexOf('inches') != -1) {
											heightRate = 2.54;
										}
										let height = item_info.height;
										height = height * heightRate;
										height = height.toFixed(2);
										let width = item_info.width;
										width = width * heightRate;
										width = width.toFixed(2);
										let length = item_info.length;
										length = length * heightRate;
										length = length.toFixed(2);
										let weight = item_info.weight;
										let weightUnits = item_info.weightUnits;
										let weightRate = 1;
										if (weightUnits.indexOf('pounds') != -1) {
											weightRate = 0.4536;
										}
										weight = weight * weightRate;
										weight = weight.toFixed(2);
										let volumeWeight = height * length * width / 5000;
										let freightFee = 0;
										if (volumeWeight > weight) {
											freightFee = volumeWeight * EstFreightCost;
										} else {
											freightFee = weight * EstFreightCost;
										};
										freightFee = freightFee.toFixed(2);
										let profit = amount - fbaFee - storageFee - listFee - referralFee - UnitManufacturingFee - freightFee - vatFee;
										profit = profit.toFixed(2);
										let margin_num = profit / amount * 100;
										let margin = margin_num.toFixed(2);
										margin = margin + "%";
										let monthlyProfit = monthlyRevenue * margin_num / numberOfSellers / 100;
										monthlyProfit = monthlyProfit.toFixed(2);
										// 创建相应的div
										let margin_html = '<strong>Margin: <span class="text-rate">' + margin + '</span></strong>'
                                        let score_div = dom("div", {
                                            "class": "text-center mt-1 set-margin"
                                        }, margin_html);
                                        my_div.append(score_div);
                                        let profit_html = '<strong><span class="text-rate">$' + monthlyProfit + '</span></strong>'
                                        let profit_div = dom("div", {
                                            "class": "text-center mt-1 set-profit"
                                        }, profit_html);
                                        $(monthlyRevenueTD).append(profit_div);
									}
								}
							}
						})
					}
				} catch (err) {};
			}
		});
	});
}

function main() {
	$(document).ready(function () {
		get_rate();
		$("body").on("click", "nav,.action-load-selected-project,.page-item,#w0,.pagination,.page-link,.action-search,#sort,.action-restore-last-search", function () {
			window.setTimeout(function () {
				get_rate();
			}, 8000);
		});
	});
}

add_readfree_style();
main();