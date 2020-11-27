// ホワイトリストの定義
var blacklist_page_urls = ['mail.google.com', 'qiita.com'];
var whitelist_href_urls = ['www.google.com', /^\//ig];


var remove_query = function (str) {
    return str ? str.replace(/\?[^?]+$/gi, '#REPLACED') : '';
};

var check = function () {
    var selects = document.getElementsByTagName('a');
    Array.prototype.forEach.call(selects, function (item) {
        href_url = item.getAttribute('href');
        if (href_url) {
            if (href_url.indexOf('?') > -1) {
                // リンク先URLの判定
                var flag_white_href = false;
                whitelist_href_urls.some(function (wh_url) {
                    if (href_url.search(wh_url) > -1) {
                        // console.log('white', location_url, href_url, wh_url);
                        flag_white_href = true;
                        return true;
                    }
                });

                if (!flag_white_href) {
                    // 置換
                    item.setAttribute('href', remove_query(href_url));
                    item.setAttribute('data-saferedirecturl', remove_query(item.getAttribute('data-saferedirecturl')));

                    console.log("replaced", location_url, href_url, remove_query(href_url), item.getAttribute('data-saferedirecturl'), remove_query(item.getAttribute('data-saferedirecturl')));
                }
            }
        }
    });
}


var location_url = window.location.href;
var queryString = window.location.search;
// console.log('location_url: ', location_url);
// console.log('queryString: ', queryString);


// リンク元URLの判定
var flag_black_page = false;
blacklist_page_urls.some(function (bk_url) {
    if (location_url.search(bk_url) > -1) {
        flag_black_page = true;
        return true;
    }
});

if (flag_black_page) {
    window.addEventListener('load', main, false);

    function main(e) {
        const jsInitCheckTimer = setInterval(jsLoaded, 1000);
        function jsLoaded() {
            var allLinks = document.getElementsByTagName('a');
            var num = allLinks.length;
            if (num < 5) {
                clearInterval(jsInitCheckTimer);
            } else {
                check();
                return;
            }
        }
    }
}
