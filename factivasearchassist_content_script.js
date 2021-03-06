//factivacrx_content_script.js
// Do something on the Factiva webpage

////// CANNOT ADD SCRIPTS FROM OTHER SITES!
//document.writeln("<script type='text/javascript' src='https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.10.8/xlsx.full.min.js'></script>");
//// CANNOT GET chome.tabs TO WORK
//chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//  $.get("https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.10.8/xlsx.full.min.js", function(result) {
//    chrome.tabs.executeScript(tabs[0].id, {code: result});
//  }, "text");
//});

var navTop = document.querySelector('#gl-navContainer');
fileSelectorHTML =  "<div id='uploader'>Select Excel file with requests: ";
fileSelectorHTML += "<input type='file' id='fileUpload0'/>";
fileSelectorHTML += "<input type='button' onclick='UploadRequestsTable()' value='Upload requests xlsx' /></div>";
navTop.outerHTML += fileSelectorHTML;


////// FROM OLD TOOL CRX
//// BASED ON download_links

// Send back to the popup a sorted deduped list of valid link URLs on this page.
// The popup injects this script into all frames in the active tab.

//var links = [].slice.apply(document.getElementsByTagName('a'));
var tags = [].slice.apply(document.querySelectorAll('a.enHeadline'));
var links = tags.map(function(element) {
  // Return an anchor's href attribute, stripping any URL fragment (hash '#').
  // If the html specifies a relative path, chrome converts it to an absolute
  // URL.
  var href = element.href;
  var hashIndex = href.indexOf('#');
  if (hashIndex >= 0) {
    href = href.substr(0, hashIndex);
  }
  return href;
});

links.sort();

// Remove duplicates and invalid URLs.
var kBadPrefix = 'javascript';
for (var i = 0; i < links.length;) {
  if (((i > 0) && (links[i] == links[i - 1])) ||
      (links[i] == '') ||
      (kBadPrefix == links[i].toLowerCase().substr(0, kBadPrefix.length))) {
    links.splice(i, 1);
  } else {
    ++i;
  }
}

// Get the headings text
var headings = tags.map(function(element) {
  // Return the heading text
  return element.innerHTML;
});

//chrome.extension.sendRequest(links);
chrome.extension.sendRequest(headings);

// Styling the injections
var css = document.createElement("style");
css.type = "text/css";
css.innerHTML = ".headlineInject { color: violet } .headlineInject strong {font-weight: bold} .headlineInject p { padding-bottom: 8px; border-bottom: 1px dotted gray} ";
document.body.appendChild(css);

function hasArticleLoaded() {
  if (document.querySelector('#artHdr1 span')) return true;
  else return false;
}

// Click each headling link, calling the article to load in the sidebar.
function loadArticles(tag, i) {
  // Do something with the article?
  // Get all the highlighted terms (bold elements)
  var highlights = [].slice.apply(document.querySelectorAll('.articleParagraph b'));
  
  //var highlights = document.querySelectorAll('.articleParagraph b');
  console.log('Headline ' + (i+1) + ', highlights = ' + highlights.length);
  var boldWords = []
  if (highlights.length > 0 ) {
    boldWords = highlights.map(function(element) {
      // Return an anchor text
      return element.innerHTML;
    });
  } else {
    boldWords = ["NO ARTICLE HIGHLIGHTS FOUND"];
  }
  // Show just the bold words
  var injectionText = "<div class='headlineInject' id='headlineInject"+i+"'><p>This article has been loaded by a Chrome Extension.</p>";
  for (var j = 0; j< boldWords.length; j++) {
    injectionText += "<p><strong>" + boldWords[j] + "</strong></p>";
  }
  
  // // Find anything else? TEST
  if (document.querySelector('#artHdr1 span')) {
    injectionText += "<p>TEST: ARTICLE LOADED</p>";
  } else {
    injectionText += "<p>TEST: ARTICLE NOT LOADED</p>";
  }
  
  injectionText += "</div>";
  // Finish
  tag.outerHTML += injectionText;
}

// function copyHightlights(i) is in factiva_page_script.js


function addButtons(tag, i) {
  // After the heading, add an instruction, and a button to pull out bolds
  var injectionText = "<div class='headlineInject' id='headlineInject"+i+"'><p>These buttons have been added by a Chrome Extension. Load article, wait, get highlights.</p>";
  
  injectionText += "<input type='button' value='Load article' onclick='alert(\"For now, please click on the article title instead, thanks.\")' />";
  injectionText += "<input type='button' value='Get highlights' onclick='copyHighlights("+i+")' />";
  
  injectionText += "</div>";
  // Finish
  tag.outerHTML += injectionText;
    
}

// http://stackoverflow.com/questions/9515704/insert-code-into-the-page-context-using-a-content-script
var s = document.createElement('script');
s.src = chrome.extension.getURL('factivasearchassist_page_script.js');
(document.head||document.documentElement).appendChild(s);
// s.onload = function() {
    // s.parentNode.removeChild(s);
// };

// Click each headling link, calling the article to load in the sidebar.
for (var i = 0; i< tags.length; i++) {
  console.log('Start ' + (i+1));
  //tags[i].click();
  // The delay from the line above means the line below fails.
  //loadArticles(tags[i], i);
  addButtons(tags[i], i);
}