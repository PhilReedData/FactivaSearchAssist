//factivacrx_content_script.js
// Do something on the Factiva webpage

// Create a li element with a button with jQuery commands to set the criteria.
function makeLiForQuery(company, dateString) {
  // assume dateString is YYYY-MM-DD
  var d = dateString.substring(8,10);
  var m = dateString.substring(5,7);
  var y = dateString.substring(0,4);
  li = "<li><button type='button' onclick=\"$('#dr').val('Custom');$('#dr').trigger('change');$('#frd').val('";
  li = li + d + "');$('#frm').val('" + m + "');$('#fry').val('" + y + "');$('#tod').val('";
  li = li + d + "');$('#tom').val('" + m + "');$('#toy').val('" + y + "');$('#coTxt').val('";
  li = li + company + "');return false;\">";
  li = li + company + ", " + dateString + "</button></li>";
  return li;
}

//var contentLeft = document.querySelector('div#contentLeft');
var navTop = document.querySelector('#gl-navContainer');

var importedString = "<div id='importedSpace'>";
importedString += "<p>Open the Company\u25B6 section, then click a button below to load up a query. ";
importedString += "Company is not fully selected, you must click in the text field, press Space then selet the best match.</p>";
//importedString += "<button type='button' onclick=\"$('#coTab .pnlTabArrow').trigger('click');return false;\">Show/hide company field</button>";
importedString += "<p>Imported queries:</p><ol>";
importedString += makeLiForQuery("Apple Inc.", "2016-10-02");
importedString += makeLiForQuery("Apple Inc.", "2016-10-05");
importedString += "</ol></div>";
//contentLeft.innerHTML += importedString;
navTop.outerHTML += importedString;


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