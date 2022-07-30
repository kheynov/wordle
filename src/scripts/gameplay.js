export default function playGame(lang) {
	getData(lang)
		.then((response) => gameplay(lang, response))
		.catch((err) => console.error(err));
}

function gameplay(lang, data) {
	const keys = document.getElementsByClassName("key");
	let attempts = [[]];
	let state = [];
	let row = 0;
	if (data.word === localStorage.getItem(`${lang}Word`)) {
		attempts = JSON.parse(localStorage.getItem(`${lang}Attempts`));
		state = JSON.parse(localStorage.getItem(`${lang}State`));
		row = attempts.length - 1;
		renderAttempts(attempts);
		color(state, attempts);
	} else {
		localStorage.setItem(`${lang}Word`, data.word);
		localStorage.setItem(`${lang}Attempts`, JSON.stringify(attempts));
		localStorage.setItem(`${lang}State`, JSON.stringify(state));
	}

	let isGameOver = !(row < 6 && (!state[row - 1] || state[row - 1].join("") !== "XXXXX"));

	if (!isGameOver) {
		// listening key press
		for (let i = 0; i < keys.length; i++) {
			keys[i].onclick = ({ target }) => {
				const letter = target.getAttribute("data-key");

				if (letter === ">>") {
					if (attempts[row].length === 5) {
						fetch(
							`https://wordle.kheynov.ru/api/word/check?word=${attempts[
								row
							].join("")}&lang=${lang}`
						)
							.then((response) => response.json())
							.then((response) => {
								if (response.correct) {
									state.push(
										check(
											attempts[row],
											data.word.split("")
										)
									);
									color(state, attempts);
									row++;
									if (
										state[row - 1].join("") === "XXXXX" ||
										row > 5
									) {
										setTimeout(
											renderShare,
											1500,
											lang,
											data,
											state
										);
										isGameOver = true;
									}
									attempts.push([]);
									localStorage.setItem(
										`${lang}Attempts`,
										JSON.stringify(attempts)
									);
									localStorage.setItem(
										`${lang}State`,
										JSON.stringify(state)
									);
								}
							})
							.catch((err) => console.error(err));
					}
				} else if (letter === "backspace") {
					attempts[row].pop();
					draw(attempts[row], row);
				} else if (attempts[row].length < 5 && !isGameOver) {
					attempts[row].push(letter);
					draw(attempts[row], row);
				}
			};
		}
	} else {
		renderShare(lang, data, state);
	}
}

function draw(word, row) {
	let child;
	let filledWord = word.slice();
	while (filledWord.length < 5) {
		filledWord.push("");
	}
	const wordsOnBoard = document.querySelectorAll(".word");

	for (let i = 0; i < filledWord.length; i++) {
		child = wordsOnBoard[row].children[i];
		child.innerHTML = `<p>${filledWord[i]}</p>`;
	}
}

async function getData(lang) {
	const response = await fetch(
		`https://wordle.kheynov.ru/api/word/get?lang=${lang}`
	);
	const data = await response.json();
	return await data;
}

function check(guess, correct) {
	const attempt = guess.slice();
	const word = correct.slice();
	const state = ["", "", "", "", ""];
	for (let i = 0; i < 5; i++) {
		if (attempt[i] === word[i]) {
			state[i] = "X";
			attempt[i] = "";
			word[i] = "";
		}
	}

	for (let i = 0; i < 5; i++) {
		let index = word.findIndex((char) => char === attempt[i]);
		if (attempt[i] !== "" && index !== -1) {
			word[index] = "";
			attempt[i] = "";
			state[i] = "C";
		}
	}

	state.forEach((el) => {
		if (el === "") {
			el = "M";
		}
	});

	return state;
}

function color(state, attempts) {
	let child;
	let key;
	const wordsOnBoard = document.querySelectorAll(".word");

	for (let i = 0; i < state.length; i++) {
		for (let j = 0; j < state[0].length; j++) {
			child = wordsOnBoard[i].children[j];
			key = document.querySelector(`[data-key = "${attempts[i][j]}"]`);
			child.style.animationDelay = `${j * 250}ms`;
			switch (state[i][j]) {
				case "X":
					child.classList.add("correct", "used");
					key.classList.add("correct");
					if (key.classList.contains("contains")) {
						key.classList.remove("contains");
					}
					break;
				case "C":
					child.classList.add("contains", "used");
					if (!key.classList.contains("correct")) {
						key.classList.add("contains");
					}
					break;
				default:
					child.classList.add("wrong", "used");
					if (
						!key.classList.contains("correct") &&
						!key.classList.contains("contains")
					) {
						key.classList.add("wrong");
					}
					break;
			}
		}
	}
}

function renderAttempts(attempts) {
	const wordsOnBoard = document.querySelectorAll(".word");
	for (let i = 0; i < attempts.length - 1; i++) {
		let child = wordsOnBoard[i];
		for (let j = 0; j < attempts[0].length; j++) {
			child.children[j].innerHTML = `<p>${attempts[i][j]}</p>`;
		}
	}
}

function renderShare(lang, data, state) {
	const shareScreen = document.querySelector(".share-screen");
	shareScreen.classList.add("active");
	const drawState = [];
	let stateDiv = "";
	let clipboardValue = `Wordle(${lang.toUpperCase()})\n\n`;
	state.forEach((row) => {
		drawState.push(
			row.map((value) => {
				if (value === "X") {
					return "🟩";
				}
				if (value === "C") {
					return "🟨";
				}
				return "⬛️";
			})
		);
	});

	drawState.forEach((row) => {
		stateDiv += `<p>${row.join("")}</p>`;
		clipboardValue += `${row.join("")}\n`;
	});
	clipboardValue += "\n#вордли\nhttps://wordle.kheynov.ru/";

	document.querySelector(
		".popup-heading"
	).innerHTML = `Wordle(${lang.toUpperCase()})`;
	document.querySelector(".guessed-word").innerHTML = data.word.toUpperCase();
	document.querySelector(".state").innerHTML = stateDiv;
	document
		.querySelector(".copy-to-clipboard")
		.addEventListener("click", () =>
			navigator.clipboard.writeText(clipboardValue)
		);
	document.querySelector(".share").addEventListener("click", async () => {
		try {
			await navigator.share({ text: `${clipboardValue}` });
		} catch (err) {
			console.error(err);
		}
	});
	document
		.querySelector(".close-share")
		.addEventListener("click", () =>
			shareScreen.classList.remove("active")
		);
}
