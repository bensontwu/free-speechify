let page = document.getElementById("buttonDiv");
let selectedClassName = "current";
const presetButtonColors = ["#3aa757", "#e8453c", "#f9bb2d", "#4688f1"];

// Reacts to a button click by marking the selected button and saving the selection
handleButtonClick = (event) => {
	// remove the styling from the previously selected color
	let current = event.target.parentElement.querySelector(
		`.${selectedClassName}`
	);
	if (current && current !== event.target) {
		current.classList.remove(selectedClassName);
	}

	// mark the button as selected
	let color = event.target.dataset.color;
	event.target.classList.add(selectedClassName);
	chrome.storage.sync.set( {color} );
}

// add a button to the page for each supplied color
constructOptions = (buttonColors) => {
	chrome.storage.sync.get("color", (data) => {
		let currentColor = data.color;

		for (let buttonColor of buttonColors) {
			let button = createButtonOfColor(buttonColor);

			if (buttonColor === currentColor) {
				button.classList.add(selectedClassName);
			}

			button.addEventListener("click", handleButtonClick);
			page.appendChild(button);
		}
	});
};

createButtonOfColor = (buttonColor) => {
	let button = document.createElement("button");
	button.dataset.color = buttonColor;
	button.style.backgroundColor = buttonColor;
	return button;
};

initializePage = () => {
	constructOptions(presetButtonColors);
};

initializePage();