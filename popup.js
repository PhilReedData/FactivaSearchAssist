// popup.js

// function plot() {
  // var plot = document.getElementById("plot");
  // plot.innerHTML = "Hello world";
  // plot.addEventListener('click', function () {
    // window.close();
  // });
// }

// window.load = plot


/**
 * Get the current URL.
 *
 * @param {function(string)} callback - called when the URL of the current tab
 *   is found.
 */
function getCurrentTabUrl(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    // chrome.tabs.query invokes the callback with a list of tabs that match the
    // query. When the popup is opened, there is certainly a window and at least
    // one tab, so we can safely assume that |tabs| is a non-empty array.
    // A window can only have one active tab at a time, so the array consists of
    // exactly one tab.
    var tab = tabs[0];

    // A tab is a plain object that provides information about the tab.
    // See https://developer.chrome.com/extensions/tabs#type-Tab
    var url = tab.url;

    // tab.url is only available if the "activeTab" permission is declared.
    // If you want to see the URL of other tabs (e.g. after removing active:true
    // from |queryInfo|), then the "tabs" permission is required to see their
    // "url" properties.
    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url);
  });

  // Most methods of the Chrome extension APIs are asynchronous. This means that
  // you CANNOT do something like this:
  //
  // var url;
  // chrome.tabs.query(queryInfo, function(tabs) {
  //   url = tabs[0].url;
  // });
  // alert(url); // Shows "undefined", because chrome.tabs.query is async.
}



function renderStatus(statusText) {
  document.getElementById('status').textContent = statusText;
}

function setStatus(statusHTML) {
  document.getElementById('status').innerHTML = statusHTML
}

// FROM OTHER: This extension demonstrates using chrome.downloads.download() to
// download URLs.

var allLinks = [];
var visibleLinks = [];


// Display all visible links.
function showLinks() {
  var linksString = 'Use the buttons added to the page.\n\nHeadlines\n\n'
  for (var index in allLinks) {
    linksString += allLinks[index] + "<br />\n";
  }
  //...
  renderStatus(linksString); // READ FROM allLinks list
}

// Write the list of buttons with query dates/actions to the popup area.
function showSourceQueries() {
  setStatus("<p>Instructed page to import queries.</p>");
}

// Add links to allLinks and visibleLinks, sort and show them.  send_links.js is
// injected into all frames of the active tab, so this listener may be called
// multiple times.
chrome.extension.onRequest.addListener(function(links) {
  //for (var index in links) {
  //  allLinks.push(links[index]);
  //}
  ////allLinks.sort();
  //visibleLinks = allLinks;
  //showLinks();
  showSourceQueries();
});


document.addEventListener('DOMContentLoaded', function() {
  getCurrentTabUrl(function(url) {
    // Start
    renderStatus('Factiva Search Assist, loading ' + url);

    // inject factivacrx_content_script.js into all frames in the active tab
    chrome.windows.getCurrent(function (currentWindow) {
    chrome.tabs.query({active: true, windowId: currentWindow.id},
                      function(activeTabs) {
      chrome.tabs.executeScript(
        activeTabs[0].id, {file: 'factivasearchassist_content_script.js', allFrames: true});
      });
    });
  });
});
