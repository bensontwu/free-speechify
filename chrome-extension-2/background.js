chrome.action.onClicked.addListener((tab) => {
	chrome.scripting.executeScript({
		target: { tabId: tab.id },
		function: speechify
	});	
});

function playData(data) {
	console.log(data);
	const audio = new Audio('data:audio/mpeg;base64,' + data);
	const playPromise = audio.play();

	if (playPromise !== undefined) {
		playPromise.then(() => {
			console.log('Audio should be playing!');
		}).catch((error) => {
			console.log('Error:', error);
		});
	}
};

const speechify = () => {
	let selection = window.getSelection().toString();
	// alert(selection);
	const url = 'https://2kwb0638vc.execute-api.us-west-2.amazonaws.com/prod/speech';
	const key = 'gC9xh56TnO3FMxixhsmCN38pY1VAfORW6PI4Jon9';
	fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'x-api-key': key
		},
		body: JSON.stringify({
			'text': selection,
			'voice_id': 'Salli'
		})
	})
	.then(data => {
		console.log(data);
		const reader = data.body.getReader();
		let fullData = '';
		reader.read().then(function processText({ done, value }) {
			if (done) {
				console.log("stream complete");
				const audio = new Audio('data:audio/mpeg;base64,' + fullData);
				const playPromise = audio.play();

				if (playPromise !== undefined) {
					playPromise.then(() => {
						console.log('Audio should be playing!');
					}).catch((error) => {
						console.log('Error:', error);
					});
				}
				return;
			}
			var decoder = new TextDecoder('utf8');
			const chunk = decoder.decode(value);
			fullData += chunk;
			return reader.read().then(processText);
		});
	});
};

