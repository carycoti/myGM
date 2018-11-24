// ==UserScript==
// @name         非凡掌柜自动日期
// @namespace    https://github.com/carycoti/myGM
// @version      1.1.1
// @description  非凡掌柜自动填写开始和结束日期，默认7天
// @author       Kung
// @match        *://shop.zhuofannuo.com/discountMod*
// @grant        none
// ==/UserScript==

function fun_date(aa, sep="-"){
        var date = new Date();
        date.setDate(date.getDate()+aa);
        var time = date.getFullYear()+sep+(date.getMonth()+1)+sep+date.getDate();
    return time
    }

var start = fun_date(0) + " 22:00:00"
var start_date = document.getElementById("startTime");
start_date.value = start
var end = fun_date(7) + " 22:00:00"
var end_date = document.getElementById("endTime");
end_date.value = end
