chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.url.indexOf('http') > -1) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['replace-href.js'],
    });
  }
});