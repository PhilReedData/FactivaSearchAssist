// factivasearchassist_page_script.js

function UploadRequestsTable() {
			document.body.style.cursor  = 'wait';
			var fileUpload0 = document.getElementById("fileUpload0");
			var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xlsx)$/;
			if (regex.test(fileUpload0.value.toLowerCase())) {
				if (typeof (FileReader) != "undefined") {
					var reader = new FileReader();
					reader.onload = function (e) {
						var data = e.target.result;
            
    
            $.getScript('https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.10.8/xlsx.full.min.js', function() {

              var workbook = XLSX.read(data, {
							type: 'binary'
						  });
		/* From /8238407/how-to-parse-excel-file-in-javascript-html5 */
              // Here is your object
              var first_sheet_name = workbook.SheetNames[0];
              var json_object = XLSX.utils.sheet_to_json(workbook.Sheets[first_sheet_name]);
              //console.log(json_object);
    					window.requestsTable = json_object;
              console.log(Object.keys(json_object[0]));
    					var requestsHeadings = Object.keys(json_object[0]);
    /*          // Show headings 
              var dropdown = document.getElementById("statsHeadings");
              dlen = dropdown.options.length;
              for (i = 0; i < dlen; i++) {
                dropdown.options[i] = null; // clear old
                //dropdown.remove(i); // why isn't this working either? KNOWN BUG
                console.log('deleted dropdown option, may have failed');
              }
              for (o = 0; o<statsHeadings.length; o++) {
                var opt = document.createElement("option"); 
                opt.text = statsHeadings[o];
                opt.value = statsHeadings[o];
                if (statsHeadings[o] == "filename_txt" || statsHeadings[o] == "file_name_txt") {
                  opt.selected = true;
                  console.log('found ' + statsHeadings[o]);
                }
                dropdown.add(opt);*
              }*/
              
              // Assume "News Date" is name of date column, assume company is Apple Inc.
              //date1 = window.requestsTable[0]["News Date"];
              //date2 = window.requestsTable[1]["News Date"];
              var numRequests = window.requestsTable.length;
              
              var navTop = document.querySelector('#gl-navContainer');// see above
              document.querySelector('#uploader').remove();

              var importedString = "<div id='importedSpace'>";
              importedString += "<p>Open the Company\u25B6 section, then click a button below to load up a query. ";
              importedString += "Company is not fully selected, you must click in the text field, press Space then selet the best match.</p>\n";
              //importedString += "<button type='button' onclick=\"$('#coTab .pnlTabArrow').trigger('click');return false;\">Show/hide company field</button>";
              importedString += "<p>Imported queries:</p><div id='dateButtons'>\n";
              //importedString += makeButtonForQuery("Apple Inc.", date1);
              //importedString += makeButtonForQuery("Apple Inc.", date2);
              for (var r = 0 ; r<numRequests; r++) {
                importedString += makeButtonForQuery("Apple Inc.", window.requestsTable[r]["News Date"]) + " \n";
              }
              importedString += "</div></div>\n";
              navTop.outerHTML += importedString;

              
              document.body.style.cursor  = 'default';
              });
    
						
					}
				}
				reader.readAsBinaryString(fileUpload0.files[0]);
				reader.onerror = function(ex) {
					console.log(ex);
					document.body.style.cursor  = 'default';
				};
			} else {
				alert("Please upload a valid Excel xlsx file.");
				document.body.style.cursor  = 'default';
			}
		};


// Create a button element with a button with jQuery commands to set the criteria.
function makeButtonForQuery(company, dateString) {
  // assume dateString is YYYY-MM-DD
  var d = dateString.substring(8,10);
  var m = dateString.substring(5,7);
  var y = dateString.substring(0,4);
  s = "<button type='button' onclick=\"$('#dr').val('Custom');$('#dr').trigger('change');$('#frd').val('";
  s = s + d + "');$('#frm').val('" + m + "');$('#fry').val('" + y + "');$('#tod').val('";
  s = s + d + "');$('#tom').val('" + m + "');$('#toy').val('" + y + "');$('#coTxt').val('";
  s = s + company + "');return false;\">";
  s = s + company + ", " + dateString + "</button>";
  return s;
}



///////


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