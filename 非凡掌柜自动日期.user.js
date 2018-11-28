// ==UserScript==
// @name         非凡掌柜自动日期
// @namespace    https://github.com/carycoti/myGM
// @version      1.3.3
// @description  非凡掌柜自动填写开始和结束日期，默认7天
// @author       Kung
// @match        *://shop.zhuofannuo.com/discountMod*
// @grant        none
// ==/UserScript==

const log = console.log.bind(console);

function fun_date(aa, sep="-"){
        let date = new Date();
        date.setDate(date.getDate()+aa);
    return date.getFullYear()+sep+(fillZero(date.getMonth()+1))+sep+fillZero(date.getDate());
    }


function fillZero(value){
if(value.toString().length<2){
    return "0"+value;
}
return value;
}

function main() {
    let start = fun_date(0) + " 22:00:00";
    let start_date = document.getElementById("startTime");
    start_date.value = start;
    let end = fun_date(7) + " 22:00:00";
    let end_date = document.getElementById("endTime");
    end_date.value = end;
}

log(window.setTimeout(function () {main();}, 100));
