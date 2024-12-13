// ブラックリスト／ホワイトリストの定義
// Qiitaはテスト用
const BLACKLIST_PAGE_URLS = ['mail.google.com', 'qiita.com'];

// Googleのサービスへのリンクと、URLが絶対パスで指定されているリンクは置換処理の対象から除外
var WHITELIST_HREF_URLS = ['https://www.google.com', /^\//ig, 'https://qiita-user-contents.imgix.net/'];


const REPLACED = '#（ ˘⊖˘）。o(まてよ、標的型攻撃メールでは？)';


// ---


// URLを置換
const mask = (str) => {
    return get_hostname(str);
    // return remove_query(str);
};


// ホスト名まで抽出（クエリ文字列じゃなくてパスで個人を識別するようになるかもしれないので）
const get_hostname = (str) => {
    if (str) {
        if (str.indexOf('http') == 0) {
            try {
                const url = new URL(str);
                return url.origin + REPLACED;
            } catch (e) {
                console.error({ e });
            }
        }
    }
    return '';
};


// クエリ文字列を削除
const remove_query = (str) => {
    return str ? str.replace(/[\?#].+$/gi, REPLACED) : '';
};


// ページ内のすべてのリンクを確認
const checkLinkTags = _ => {
    const linkTags = document.getElementsByTagName('a');
    Array.prototype.forEach.call(linkTags, function (item) {
        const href_url = item.getAttribute('href');
        const safe_redirect_url = item.getAttribute('data-saferedirecturl');
        if (href_url) {
            if (href_url.indexOf('?') > -1) {
                // リンク先URLの判定
                let flag_white_href = false;
                WHITELIST_HREF_URLS.some(function (wh_url) {
                    if (href_url.search(wh_url) > -1) {
                        // console.info('skipped', window.location, href_url, wh_url);
                        flag_white_href = true;
                        return true;
                    }
                });

                if (!flag_white_href) {
                    // // リンク先URLの置換
                    // item.setAttribute('href', mask(href_url));
                    // item.setAttribute('data-saferedirecturl', mask(safe_redirect_url));

                    // // リンクに表示される文字列を元のURLにする（URLを目視確認して、必要であればコピペでURLを開けるようにするため）
                    // item.innerText += ' → ' + href_url + ' ←';

                    // aタグをテキストエリアに置換
                    let inputElement = document.createElement('textarea');
                    inputElement.value = mask(href_url) + '\n' + href_url;
                    inputElement.style.width = (mask(href_url).length * 10) + 'px';
                    inputElement.style.height = '36px';
                    // inputElement.addEventListener('click', (ev) => ev.target.select(), false); // 全選択すると確認が漏れそう
                    item.replaceWith(inputElement);

                    console.info("replaced", window.location, href_url, mask(href_url), safe_redirect_url, mask(safe_redirect_url));
                }
            }
        }
    });
}


const main = _ => {
    const LOCATION_URL = window.location.href;
    console.info('LOCATION_URL: ', LOCATION_URL);

    // リンク元URLの判定
    var flag_black_page = false;
    BLACKLIST_PAGE_URLS.some(function (bk_url) {
        if (LOCATION_URL.search(bk_url) > -1) {
            flag_black_page = true;
            return true;
        }
    });

    if (flag_black_page) {
        window.addEventListener('load', _ => {
            const jsLoaded = _ => {
                var allLinks = document.getElementsByTagName('a');
                var num = allLinks.length;
                if (num < 5) {
                    clearInterval(jsInitCheckTimer);
                } else {
                    checkLinkTags();
                    return;
                }
            };
            const jsInitCheckTimer = setInterval(jsLoaded, 1000);
        }, false);
    }
};
main();
