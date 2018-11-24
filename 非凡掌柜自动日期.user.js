// ==UserScript==
// @name         非凡掌柜自动日期
// @namespace    https://github.com/carycoti/myGM
// @version      1.2.0
// @description  非凡掌柜自动填写开始和结束日期，默认7天
// @author       Kung
// @match        *://shop.zhuofannuo.com/discountMod*
// @grant        none
// ==/UserScript==

function fun_date(aa, sep="-"){
        let date = new Date();
        date.setDate(date.getDate()+aa);
    return date.getFullYear()+sep+(date.getMonth()+1)+sep+date.getDate();
    }

const start = fun_date(0) + " 22:00:00";
const start_date = document.getElementById("startTime");
start_date.value = start;
const end = fun_date(7) + " 22:00:00";
const end_date = document.getElementById("endTime");
end_date.value = end;
