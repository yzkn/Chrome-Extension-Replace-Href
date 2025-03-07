// ブラックリスト／ホワイトリストの定義
const BLACKLIST_PAGE_URLS = ['mail.google.com', 'outlook.office.com', 'qiita.com'];

// Google,Microsoftのサービスへのリンクと、URLが絶対パスで指定されているリンクは置換処理の対象から除外
const REGEX_WHITELIST_HREF_URLS = [
    /^https?:\/\/[a-z0-9]+\.google\.co(m|\.jp)\/?/,
    /^https?:\/\/[a-z0-9]+\.office\.com\/?/,
    /^https?:\/\/([a-z0-9]+\.)*azure\.net\/?/,
    /^https?:\/\/([a-z0-9]+\.)*microsoft\.com\/?/,
    /^https?:\/\/[a-z0-9]+\.qiita\.com\/?/,
    /^\//ig,

    'mailto:',
];


const INIT_WHITELIST_URLS = `https://ap.sansan.com/
https://b.hatena.ne.jp
https://github.com
https://learn.microsoft.com
https://nam.safelink.emails.azure.net
https://open.spotify.com
https://qiita-user-contents.imgix.net/
https://suzuri.jp
https://t.co
https://teams.microsoft.com/
https://twitter.com
https://www.facebook.com
https://www.youtube.com
https://x.com`;


// ---


// URLを置換
const mask = (str) => {
    if (str) {
        if (str.indexOf('http') == 0) {
            try {
                const url = new URL(str);

                console.info('mask()', url,
                    url.protocol + '//' + url.hostname,
                    url.protocol + '//' + '<span style="color: #f00;">' + url.hostname + '</span>');

                // return url.protocol + '://' + '<span style="color: #f00;">' + url.hostname + '</span>' + url.pathname + url.search + url.hash;
                return str.replace(
                    url.protocol + '//' + url.hostname,
                    url.protocol + '//' + '<span style="color: #f00;">' + url.hostname + '</span>'
                );
            } catch (e) {
                console.error({ e });
            }
        }
    }
    return '';
};


// ページ内のすべてのリンクを確認
const checkLinkTags = (ALL_WHITELIST_HREF_URLS) => {
    const linkTags = document.getElementsByTagName('a');
    // console.info({ linkTags, ALL_WHITELIST_HREF_URLS })
    Array.prototype.forEach.call(linkTags, function (item) {
        console.info(item, item.getBoundingClientRect())

        const href_url = item.getAttribute('href');
        const safe_redirect_url = item.getAttribute('data-saferedirecturl');

        console.info('checkLinkTags()', window.location, href_url, safe_redirect_url);

        if (href_url) {
            const href_pathname = href_url.indexOf('http') == 0 ? (new URL(href_url)).pathname : '';
            const href_search = href_url.indexOf('http') == 0 ? (new URL(href_url)).search : '';
            const href_hash = href_url.indexOf('http') == 0 ? (new URL(href_url)).hash : '';
            const href_origin = href_url.indexOf('http') == 0 ? (new URL(href_url)).origin : '';
            if (window.location.origin == href_origin) {
                // オリジンが同一ならスキップ
            } else if ((href_pathname == '' || href_pathname == '/') && (href_search == '' || href_search == '?') && (href_hash == '' || href_hash == '#')) {
                // ルートならスキップ
                // console.info('skipped', window.location, href_url, href_pathname);
            } else {
                // } else if (href_url.indexOf('?') > -1) {
                // リンク先URLの判定
                let flag_white_href = false;
                ALL_WHITELIST_HREF_URLS.some(function (wh_url) {
                    if (href_url.search(wh_url) > -1) {
                        // console.info('skipped', window.location, href_url, wh_url);
                        flag_white_href = true;
                        return true;
                    }
                });

                if (flag_white_href) {
                    // console.info('flag_white_href', window.location, href_url);
                } else {
                    // console.info('!flag_white_href', window.location, href_url);

                    let divElement = document.createElement('div');
                    divElement.setAttribute('contenteditable', true);
                    divElement.innerHTML = mask(href_url);
                    divElement.style.display = 'inline-block';
                    divElement.style.height = item.getBoundingClientRect().height; // '36px';
                    divElement.style.outline = '0px solid transparent';
                    divElement.style.overflow = 'hidden';
                    divElement.style.resize = 'both';
                    divElement.style.width = item.getBoundingClientRect().width; // (mask(href_url).length * 10) + 'px';
                    // inputElement.addEventListener('click', (ev) => ev.target.select(), false); // 全選択すると確認が漏れそう
                    item.replaceWith(divElement);

                    // console.info("replaced", window.location, href_url, mask(href_url), safe_redirect_url, mask(safe_redirect_url));
                }
            }
        }
    });
}


const main = async _ => {
    const LOCATION_URL = window.location.href;
    // console.info('main()', 'LOCATION_URL: ', LOCATION_URL);

    // リンク元URLの判定
    var flag_black_page = false;
    BLACKLIST_PAGE_URLS.some(function (bk_url) {
        // console.info('main()', 'LOCATION_URL: ', LOCATION_URL, 'bk_url: ', bk_url);
        if (LOCATION_URL.search(bk_url) > -1) {
            flag_black_page = true;
            return true;
        }
    });

    if (flag_black_page) {
        // console.info('main()', 'LOCATION_URL: ', LOCATION_URL, 'flag_black_page');
        const jsLoaded = _ => {
            // console.log('main()', 'LOCATION_URL: ', LOCATION_URL, 'flag_black_page', 'jsLoaded', window.location.href);
            var allLinks = document.getElementsByTagName('a');
            var num = allLinks.length;
            if (num < 5) {
                // console.log('main()', 'LOCATION_URL: ', LOCATION_URL, 'flag_black_page', 'jsLoaded',' num < 5', window.location.href);
            } else {
                clearInterval(jsInitCheckTimer);

                chrome.storage.sync.get(["whitelist_urls"]).then((result) => {
                    // console.log({ result })
                    const whitelistUrls = String(result.whitelist_urls).split('\n').filter(v => v);
                    // console.log({ whitelistUrls })
                    const ALL_WHITELIST_HREF_URLS = REGEX_WHITELIST_HREF_URLS.concat(whitelistUrls);
                    // console.log({ ALL_WHITELIST_HREF_URLS })
                    checkLinkTags(ALL_WHITELIST_HREF_URLS);
                });

                // ページの表示が切り替わったタイミングを検知して置換処理を行う
                const observer = new MutationObserver((mutations) => {
                    if (mutations.length > 10) {
                        console.log({ mutations });

                        // checkLinkTags()での書き換えが検知されないようにするために一時停止
                        observer.disconnect();

                        chrome.storage.sync.get(["whitelist_urls"]).then((result) => {
                            // console.log({ result })
                            const whitelistUrls = String(result.whitelist_urls).split('\n').filter(v => v);
                            // console.log({ whitelistUrls })
                            const ALL_WHITELIST_HREF_URLS = REGEX_WHITELIST_HREF_URLS.concat(whitelistUrls);
                            // console.log({ ALL_WHITELIST_HREF_URLS })
                            checkLinkTags(ALL_WHITELIST_HREF_URLS);
                        });

                        // 検知再開
                        observer.observe(document, {
                            childList: true,
                            attributes: true,
                            characterData: true,
                            subtree: true,
                        });
                    }
                });
                observer.observe(document, {
                    childList: true,
                    attributes: true,
                    characterData: true,
                    subtree: true,
                });
            }
        };
        const jsInitCheckTimer = setInterval(jsLoaded, 1000);
    }
};


const onLoad = async _ => {
    // console.log('onload()', window.location.href);

    chrome.storage.sync.get(["whitelist_urls"]).then((result) => {
        if (result.whitelist_urls) {
            // console.log("Value is already set");
        } else {
            chrome.storage.sync.set({ "whitelist_urls": INIT_WHITELIST_URLS }).then(() => {
                console.log("Default value is set");
            });
        }

        main();
    });
};
window.addEventListener("load", onLoad, false);