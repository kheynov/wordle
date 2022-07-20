const backspace = `<button class="key" id="backspace" data-key="backspace">
	<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" > 
		<path stroke-linecap="round" stroke-linejoin="round" 
		d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" />
	</svg>
</button>`;

const ruKeyboard = [
	["й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ"],
	["ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э"],
	["я", "ч", "с", "м", "и", "т", "ь", "б", "ю", ">>"],
];

const enKeyboard = [
	["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
	["a", "s", "d", "f", "g", "h", "j", "k", "l"],
	["z", "x", "c", "v", "b", "n", "m", ">>"],
];

function renderKeyboard(keyboard) {
	let lines = ["", "", ""];
	for (let i = 0; i < 3; i++) {
		keyboard[i].forEach((key) => {
			lines[i] += `<button class="key" data-key="${key}">${key}</button>`;
		});
	}
	document.querySelector("#first-line").innerHTML = lines[0];
	document.querySelector("#second-line").innerHTML = lines[1];
	document.querySelector("#third-line").innerHTML = backspace + lines[2];
}

function renderCells() {
	const cells = document.querySelector("#cells");
	let rows = "";
	for (let i = 0; i < 6; i++) {
		let row = `<div class="word">`;
		for (let j = 0; j < 5; j++) {
			row += `<div class="cell"></div>`;
		}
		row += "</div>";
		rows += row;
	}
	cells.innerHTML = rows;
}

export function render(lang = "ru") {
	const heading = document.querySelector("h1");
	renderCells();
	if (lang === "ru") {
		heading.innerHTML = "Wordle(RU)";
		renderKeyboard(ruKeyboard);
	} else {
		heading.innerHTML = "Wordle(EN)";
		renderKeyboard(enKeyboard);
	}
}
