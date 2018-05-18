//background.js
// the backbone of the extension, store global variables


// Global accessor that the popup uses.

// Show page action icon inside omnibar if URL matches
// http://stackoverflow.com/questions/20183957/chrome-extension-page-action-not-showing-next-to-omnibar
var hostRegex = /^[^:]+:\/\/[^\/]*global.factiva.com/i;
function checkURL(tabId, info, tab) {
    if (info.status === "complete") {
        if (hostRegex.test(tab.url)) {
            chrome.pageAction.show(tabId);
        }
    }
}
chrome.tabs.onUpdated.addListener(checkURL);