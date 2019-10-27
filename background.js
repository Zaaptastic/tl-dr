var apiKey = ""

chrome.runtime.onInstalled.addListener(function(details){
    readTextFile("api_key.txt", apiKey);
	console.log(apiKey);
});

chrome.commands.onCommand.addListener(function(command) {
	console.log("Executing: " + command)
  	var selectedText = "";

  	// First get the selected text the user is trying to summarize.
	chrome.tabs.executeScript( {
	    code: "window.getSelection().toString();"
	}, function(selection) {
	    selectedText = selection[0];
		console.log(selectedText);

		// Call the Smmry API to fetch a summary of the selected text.
		var request = new XMLHttpRequest();
		request.open('POST', "http://api.smmry.com/&SM_API_KEY=" + apiKey);

		var data = new FormData();
		data.append("sm_api_input", selectedText);
	
		request.onload = function() {
			var data = JSON.parse(this.response);
			var data_content = data.sm_api_content;
			console.log(data);

			alert(data_content);
		}

		request.send(data);
	});

});

function readTextFile(file)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                apiKey = allText;
            }
        }
    }
    rawFile.send(null);
}