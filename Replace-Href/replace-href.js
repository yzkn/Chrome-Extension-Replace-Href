// ホワイトリストの定義
var whitelist_page_urls = ['qiita.com', 'mail.google.com'];
var whitelist_href_urls = ['qiita.com', /^\//ig];


var remove_query = function (str) {
    return str ? str.replace(/\?[^?]+$/gi, '?REPLACED') : '';
};


var location_url = window.location.href;
var queryString = window.location.search;


// リンク元URLの判定
var flag_white = false;
whitelist_page_urls.some(function (wh_url) {
    if (location_url.search(wh_url) > -1) {
        flag_white = true;
        return true;
    }
});

if (!flag_white) {
    var selects = document.getElementsByTagName('a');
    Array.prototype.forEach.call(selects, function (item) {
        href_url = item.getAttribute('href');
        if (href_url) {
            if (href_url.indexOf('?') > -1) {

                // リンク先URLの判定
                var flag_white_href = false;
                whitelist_href_urls.some(function (wh_url) {
                    if (href_url.search(wh_url) > -1) {
                        flag_white_href = true;
                        return true;
                    }
                });

                if (!flag_white_href) {
                    // 置換
                    item.setAttribute('href', remove_query(href_url));
                    item.setAttribute('data-saferedirecturl', remove_query(item.getAttribute('data-saferedirecturl')));
                }
            }
        }
    });
}
