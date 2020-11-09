// ==UserScript==
// @name         卖家精灵-选市场增强
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  卖家精灵-选市场增强
// @author       Kung
// @match        https://www.sellersprite.com/v2/market-research
// @require      https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @resource     custom_css https://cdn.jsdelivr.net/gh/carycoti/myGM@master/style/style.css
// @grant        GM_log
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        GM_getResourceText
// @grant        GM_addStyle
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

function set_rate(domEle, num){
	let sales = $(domEle).find("td div.td")[num];
	let my_sales = $(sales).find("div.text-center");
	let monthly_sales = my_sales[0].innerText;
	monthly_sales = monthly_sales.replace(",", "");
	let top_monthly_sales = my_sales[1].innerText;
	top_monthly_sales = top_monthly_sales.replace(",", "");
	let sales_rate = top_monthly_sales / monthly_sales;
	sales_rate = sales_rate.toFixed(2);
	// 创建相应的div
	let score_div = dom("div", {
		"class": "mr-2 text-center text-muted text-rate"
	}, sales_rate);
	$(sales).append(score_div);
}

function set_new_product_rate(domEle, num1, num2){
	let sales = $(domEle).find("td div.td")[num1];
	let my_sales = $(sales).find("div.text-center");
	let monthly_sales = my_sales[1].innerText;
	monthly_sales = monthly_sales.replace(",", "");
	let sales2 = $(domEle).find("td div.td")[num2];
	let my_sales2 = $(sales2).find("div.text-center");
	let top_monthly_sales = my_sales2[0].innerText;
	top_monthly_sales = top_monthly_sales.replace(",", "");
	let sales_rate = monthly_sales / top_monthly_sales * 100;
	sales_rate = sales_rate.toFixed(2);
	// 创建相应的div
	let score_div = dom("div", {
		"class": "mr-2 text-center text-muted text-rate"
	}, sales_rate);
	$(sales2).append(score_div);
}

function get_rate(){
	$(document).ready(function () {
		$('#table-condition-search tbody tr').each(function(i){
		   if (i%3==0){
			   try{
				set_rate(this, 4);
				set_rate(this, 5);
				set_new_product_rate(this, 12, 13);
			   }
			   catch(err){};
		   }
		});
	});
}

function main(){
	add_readfree_style();
	get_rate();
}

GM_log(window.setTimeout(function(){main();}, 1500));
