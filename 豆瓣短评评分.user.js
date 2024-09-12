// ==UserScript==
// @name        豆瓣短评评分
// @description zh-cn
// @namespace   http://tampermonkey.net/
// @version     2.0.0
// @match       https://movie.douban.com/subject/*
// @match       https://book.douban.com/subject/*
// @require     https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @grant       GM_log
// @grant       GM_xmlhttpRequest
// @grant       GM_setClipboard
// @grant       GM_notification
// @grant       GM_getValue
// @grant       GM_setValue
// ==/UserScript==

GM_setValue("total_rating", 0);
GM_setValue("good_rating", 0);
GM_setValue("num", 0);

function get_url(url) {
    let re = /https:\/\/(movie|book)\.douban\.com\/subject\/(\d+)/g;
    let matches = re.exec(url);
    if (matches && matches.length > 1) {
        return matches[0];
    }
}
 
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

function get_rate(kk) {
    let url = $(location).attr('href');
    url = get_url(url)
    let api_url = url + "/comments?start=" + kk + "&limit=20&status=P&sort=new_score";
    console.log(api_url);
    GM_xmlhttpRequest({
        method: "GET",
        url: api_url,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'Cookie': '_ga=GA1.2.107451784.1605067144; _gid=GA1.2.382883749.1605067144; __root_domain_v=.tool4seller.cn; _qddaz=QD.2zmis3.ispgxl.khcvjii2; Hm_lvt_569f3a439a97ca4944bfec5572da3369=1605067145,1605068601,1605070250; Hm_lpvt_569f3a439a97ca4944bfec5572da3369=1605071825',
        },
        onload: function (response) {
            console.log(response.status);
            if (response.status === 200) {
                console.log("begian");
                let result = response.responseText;
                let re = /allstar(\d\d)/g;
                let matches = result.match(re);
                let num = GM_getValue("num");
                let total_rating = GM_getValue("total_rating");
                let good_rating = GM_getValue("good_rating");
                if (matches && matches.length > 1) {
                    num += matches.length;
                    for (let i = 1; i < matches.length; i++){
                        let rating = matches[i];
                        rating = rating.replace("allstar", "")
                        rating = parseInt(rating)
                        total_rating += rating;
                        if (rating > 30) {
                            good_rating += 1;
                        }
                    }
                    GM_setValue("total_rating", total_rating);
                    GM_setValue("good_rating", good_rating);
                    GM_setValue("num", num);
                }}}
    })
}

function main() {
    for (var i=0; i<11; i++){
    let kk = i * 20;
    get_rate(kk);
    }
    let num = GM_getValue("num");
    let total_rating = GM_getValue("total_rating");
    console.log(total_rating);
    let good_rating = GM_getValue("good_rating");
    total_rating = total_rating / num * 2 / 10;
    total_rating = total_rating.toFixed(1);
    good_rating = good_rating / num;
    good_rating = good_rating * 100;
    good_rating = good_rating.toFixed(1);

    let hhtml = '<div class="rating_wrap clearbox" rel="v:rating"><div class="clearfix"><div class="rating_logo ll">短评评分      好评率：' + good_rating + '%' + '</div></div><div class="rating_self clearfix" typeof="v:Rating"><strong class="ll rating_num" property="v:average">' + total_rating + '</strong><span property="v:best" content="10.0"></span><div class="rating_right "><div class="ll bigstar bigstar45"></div><div class="rating_sum"><a href="comments" class="rating_people"><span property="v:votes">' + num + '</span>人评价</a></div></div></div></div>';
    $("div#interest_sectl").append(hhtml);
    }

window.setTimeout(function () {
    main();
}, 5000);
