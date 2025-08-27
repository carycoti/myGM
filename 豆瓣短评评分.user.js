// ==UserScript==
// @name        豆瓣短评评分
// @description zh-cn
// @namespace   http://tampermonkey.net/
// @version     3.0.0
// @match       https://movie.douban.com/subject/*
// @match       https://book.douban.com/subject/*
// @require     https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @grant       GM_log
// @grant       GM_xmlhttpRequest
// ==/UserScript==

const ratingState = {
    weighted_rating_sum: 0,
    total_votes_sum: 0,
    good_votes_sum: 0,
    num_comments: 0,
    completed_requests: 0,
    total_requests: 20 // Fetching pages number
};

function get_url(url) {
    let re = /https:\/\/(movie|book)\.douban\.com\/subject\/(\d+)/g;
    let matches = re.exec(url);
    if (matches && matches.length > 1) {
        return matches[0];
    }
    return null;
}

function displayResult() {
    if (ratingState.total_votes_sum === 0) {
        console.log("No votes found to calculate weighted score.");
        return;
    }

    // Calculate the weighted average rating (on a scale of 10-50)
    const weighted_avg_50 = ratingState.weighted_rating_sum / ratingState.total_votes_sum;

    // Convert to a 10-point scale
    let final_score = (weighted_avg_50 / 10) * 2;
    final_score = final_score.toFixed(1);

    // Calculate weighted good rating percentage
    let good_rating_percent = (ratingState.good_votes_sum / ratingState.total_votes_sum) * 100;
    good_rating_percent = good_rating_percent.toFixed(1);
    
    // Dynamically calculate bigstar class
    const bigstar_class_value = Math.round(weighted_avg_50 / 5) * 5;

    let hhtml = '<div class="rating_wrap clearbox" rel="v:rating" style="margin-top: 20px; border-top: 1px solid #eaeaea; padding-top: 10px;"><div class="clearfix"><div class="rating_logo ll">短评加权评分 (综合' + ratingState.num_comments + '条)</div></div><div class="rating_self clearfix" typeof="v:Rating"><strong class="ll rating_num" property="v:average">' + final_score + '</strong><span property="v:best" content="10.0"></span><div class="rating_right "><div class="ll bigstar bigstar' + bigstar_class_value + '"></div><div class="rating_sum"><span>基于' + ratingState.total_votes_sum + '个有用评价</span><br><span>加权好评率：' + good_rating_percent + '%</span></div></div></div></div>';
    $("div#interest_sectl").append(hhtml);
}

function process_comments(html_content) {
    $(html_content).find('.comment-item').each(function() {
        const comment = $(this);
        const rating_match = comment.find('.rating').attr('class')?.match(/allstar(\d\d)/);
        const vote_text = comment.find('.vote-count').text();

        if (rating_match && vote_text) {
            const rating = parseInt(rating_match[1], 10);
            const votes = parseInt(vote_text, 10) + 1;

            if (!isNaN(rating) && !isNaN(votes)) {
                ratingState.weighted_rating_sum += rating * votes;
                ratingState.total_votes_sum += votes;
                ratingState.num_comments++;

                if (rating > 30) {
                    ratingState.good_votes_sum += votes;
                }
            }
        }
    });
}

function get_rate(kk) {
    let url = get_url($(location).attr('href'));
    if (!url) return;

    let api_url = url + "/comments?start=" + kk + "&limit=20&status=P&sort=new_score";
    GM_xmlhttpRequest({
        method: "GET",
        url: api_url,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        },
        onload: function (response) {
            if (response.status === 200) {
                process_comments(response.responseText);
            }
            ratingState.completed_requests++;
            if (ratingState.completed_requests === ratingState.total_requests) {
                displayResult();
            }
        },
        onerror: function() {
            ratingState.completed_requests++;
            if (ratingState.completed_requests === ratingState.total_requests) {
                displayResult();
            }
        }
    });
}

function main() {
    // Process the comments already on the page first
    process_comments(document.body);
    
    for (var i = 1; i <= ratingState.total_requests; i++){
        let kk = i * 20;
        get_rate(kk);
    }
}

// Use MutationObserver for more reliable execution
const observer = new MutationObserver(function (mutations, me) {
    const interestSection = document.getElementById('interest_sectl');
    if (interestSection) {
        main();
        me.disconnect(); // stop observing
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});
