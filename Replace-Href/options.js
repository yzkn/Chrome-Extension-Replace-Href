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

const sleep = (msec) => new Promise((resolve) => setTimeout(resolve, msec));

const init = _ => {
    console.log('init')
    chrome.storage.sync.get(["whitelist_urls"]).then((result) => {
        if(result.whitelist_urls){
            document.getElementById("whitelist_urls").value = result.whitelist_urls;
            console.log("Loaded value is set");
        } else {
            chrome.storage.sync.set({ "whitelist_urls": INIT_WHITELIST_URLS }).then(() => {
                console.log("Default value is set");
                document.getElementById("whitelist_urls").value = INIT_WHITELIST_URLS;
            });
        }
    });
};

const save = _ => {
    console.log('save')
    chrome.storage.sync.set({ "whitelist_urls": document.getElementById("whitelist_urls").value }).then(async _ => {
        console.log("Value is set");
        const alertElement = document.getElementById('alert-saved');
        alertElement.style.display = 'block';
        await sleep(1000);
        alertElement.style.display = 'none';
    });
};

document.addEventListener("DOMContentLoaded", (event) => {
    init();
    document.getElementById("whitelist_urls").addEventListener("change", save, false);
});
