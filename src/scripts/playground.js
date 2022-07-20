const backspace = document.querySelector("#third-line").innerHTML;

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
	console.log(backspace);
	let lines = ["", "", ""];
	for (let i = 0; i < 3; i++) {
		console.log(keyboard[i]);
		keyboard[i].forEach((key) => {
			lines[i] += `<button class="key">${key}</button>`;
		});
	}
	document.querySelector("#first-line").innerHTML = lines[0];
	document.querySelector("#second-line").innerHTML = lines[1];
	document.querySelector("#third-line").innerHTML = backspace + lines[2];
}

export function render(lang = "ru") {
	const heading = document.querySelector("h1")
	if (lang === "ru") {
		heading.innerHTML = "Wordle(RU)";
		renderKeyboard(ruKeyboard);
	} else {
		heading.innerHTML = "Wordle(EN)";
		renderKeyboard(enKeyboard);
	}
}
