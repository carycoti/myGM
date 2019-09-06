// ==UserScript==
// @name         期权计算器
// @namespace    http://tampermonkey.net/
// @version      1.3.0
// @description  计算卖出认沽期权的年化收益率和得分,只适用于卖出认沽期权.使用时请选择类型为认沽期权
// @author       Kung
// @match        http://data.eastmoney.com/other/valueAnal.html
// @require      https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @grant        GM_log
// @grant        GM_setClipboard
// @grant        GM_notification
// ==/UserScript==

function dom(tag, attr, inner) {
    let el = document.createElement(tag);
    for (let key in attr) {
        if (attr.hasOwnProperty(key)) {
            el.setAttribute(key,attr[key]);
        }
    }
    if (inner) {
        el.innerHTML = inner;
    }
    return el;
}

// 计算相距天数
function tab(date){
	let oDate = new Date();
	let nY = oDate.getFullYear();
	let nM = oDate.getMonth();
	let nD = oDate.getDate();
	let newDate = new Date(nY,nM,nD,0,0,0);
	let dates = date.split('-');
	if (nM > dates[0]) { nY += 1;}
	let lastDate = new Date(nY, (dates[0]-1), dates[1], 0, 0, 0);
	return Math.abs(newDate.getTime()-lastDate.getTime())/86400000;
}

function add_th() {
	let annualized_rate_of_return_th = dom("th",
	 {'style': "padding: 0px; width: 45px;"},
	 '年化收益率<i title="理想状态下的最大年化收益率">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</i>');
	let score_th = dom("th",
	 {'style': "padding: 0px; width: 45px;"},
	 '得分<i title="综合安全垫和年化收益率算出的值,比较偏重安全垫">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</i>');
	$("#dt_1 thead.h101 tr").append(annualized_rate_of_return_th, score_th);
}

function get_value() {
	$("#tabBody tr").each(function () {
		// 行权价格
		let exercise_price = $(this).find("td")[1].innerText;
		exercise_price = exercise_price.replace("A", "").split("月")[1];
		exercise_price = exercise_price / 1000;
		// 期权最新价格
		let new_price = $(this).find("td")[2].innerText;
		// 最低保证金率
		let deposit_rate = new_price / exercise_price + 0.07;
		// 标的最新价格
		let new_price_50 = $(this).find("td")[8].innerText;
		// 安全垫
		let safety_mat = -(exercise_price / new_price_50 - 1);
		// 收益率
		let rate_of_return = new_price / (deposit_rate * exercise_price);
		// 到期日期
		let date_of_expiry = $(this).find("td")[10].innerText;
		// 到期天数
		let maturity_days = tab(date_of_expiry);
		// 年化收益率
		let annualized_rate_of_return = rate_of_return / maturity_days * 360;
		let annualized_rate_of_return_str = Number(annualized_rate_of_return*100).toFixed(2);
		annualized_rate_of_return_str += "%";
		// 得分
		let score = (safety_mat * safety_mat * safety_mat) * annualized_rate_of_return * 10000;
		score = score.toFixed(2);
		let annualized_rate_of_return_td = dom("td", {}, annualized_rate_of_return_str);
		let score_td = dom("td", {}, score);
		$(this).append(annualized_rate_of_return_td, score_td);
		// 添加score属性用于排序
		$(this).attr("score", score);
	});
}

function sortTableByScore() {
    var $trList = $("#tabBody tr");
    //冒泡排序
    for (var i = 0; i < $trList.length - 1; i++) {
        for (var j = 0; j < $trList.length - 1 - i; j++) {
            var value1 = Number($trList[j].attributes["score"].nodeValue);
            var value2 = Number($trList[j + 1].attributes["score"].nodeValue);
            if (value1 < value2) {
                var $temp = $trList[j];
                $trList[j] = null;
                $trList[j] = $trList[j + 1];
                $trList[j + 1] = null;
                $trList[j + 1] = $temp;
            }
        }
    }
    //将原来的tr清空，再将排序后的tr插入到table的dom中
	$trList.appendTo($("#tabBody").empty());
}

function main(){
	 $(document).ready(function () {
		 $("#dt_1 thead.h101,div.qq_search div.qq_btn img,#PageCont").click(function () {
			 window.setTimeout(function(){add_th(); get_value(); sortTableByScore()}, 1500);
		 });
	 });
}

window.setTimeout(function(){main();}, 1500);
