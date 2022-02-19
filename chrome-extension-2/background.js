chrome.action.onClicked.addListener((tab) => {
	chrome.scripting.executeScript({
		target: { tabId: tab.id },
		function: speechify
	});	
});

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		chrome.tts.speak(request.selection);
	}
);

speechify = () => {
	let selection = window.getSelection().toString();
	// alert(selection);
	chrome.runtime.sendMessage({selection: selection});
};