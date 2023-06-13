

/*** I don't know the creator it's fixed by @ranki. 
 I don't create the extension, I just fix the photo problem and add a scroll bar***/


document.getElementById("button_clear").addEventListener("click", function()
{
	chrome.storage.sync.clear(function(){});
	document.getElementById("button_clear").value = "Done. Please refresh intra pages.";
});