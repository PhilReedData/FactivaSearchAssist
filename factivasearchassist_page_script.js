// factivasearchassist_page_script.js

function hasArticleLoaded() {
  if (document.querySelector('#artHdr1 span')) return true;
  else return false;
}

function copyHighlights(i) {
  // Find the highlights, put them in the div indicated
  
  // If loaded, get the b tags
  // Get all the highlighted terms (bold elements)
  var highlights = [].slice.apply(document.querySelectorAll('#articleFrame .articleParagraph b'));
  
  //var highlights = document.querySelectorAll('.articleParagraph b');
  console.log('Headline ' + (i+1) + ', highlights = ' + highlights.length);
  var boldWords = [];
  if (highlights.length > 0 ) {
    boldWords = highlights.map(function(element) {
      // Return an anchor text
      return element.innerHTML;
    });
  } else {
    boldWords = ["NO ARTICLE HIGHLIGHTS FOUND"];
  }
  var boldWordsContext = [];
  if (highlights.length > 0 ) {
    boldWordsContext = highlights.map(function(element) {
      // Return an anchor text
      return element.parentElement.outerHTML;
    });
  }
  
  // Show just the bold words
  var injectionText = "<div class='headlineInject' id='headlineInject"+i+"'>";
  for (var j = 0; j< boldWordsContext.length; j++) {
    //injectionText += "<p><strong>" + boldWords[j] + "</strong></p>";
    injectionText +=  boldWordsContext[j] ;
  }
  
  // // Find anything else? TEST
  if (!document.querySelector('#artHdr1 span')) {
    injectionText += "<p>ARTICLE NOT LOADED</p>";
  }
  
  injectionText += "</div>";
  
  //...
  
  theDiv = document.getElementById('headlineInject' + i);
  //theP = document.createElement('p');
  // not quite right, as this adds nested p elements... FIX!
  //theP.innerHTML = injectionText;
  theDiv.outerHTML += injectionText;
  //"Has article loaded? " + hasArticleLoaded();
  theDiv.appendChild(theP);
}

//alert('loaded page script');