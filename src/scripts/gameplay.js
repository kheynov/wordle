export default function playGame(lang) {
	const keys = document.getElementsByClassName("key");
	const attempts = [[]];
	const state = [];
	let row = 0;
	let data;
	getData(lang)
		.then((response) => (data = response))
		.catch((err) => console.error(err));

	// listening key press
	for (let i = 0; i < keys.length; i++) {
		keys[i].onclick = ({ target }) => {
			const letter = target.getAttribute("data-key");
			if (row < 6) {
				if (letter === ">>") {
					if (attempts[row].length === 5) {
						const options = { method: "POST" };

						fetch(
							`https://wordle.kheynov.ru/api/word/check?word=${attempts[row].join("")}&lang=${lang}`,
							options
						)
							.then((response) => response.json())
							.then((response) => {
								console.log(response.correct);
								if (response.correct) {
									state.push(
										check(
											attempts[row],
											data.word.split("")
										)
									);
									color(state, attempts);
									row++;
									attempts.push([]);
									console.log(state);
								}
							})
							.catch((err) => console.error(err));
					}
				} else if (letter === "backspace") {
					attempts[row].pop();
					draw(attempts[row], row);
				} else if (attempts[row].length < 5) {
					attempts[row].push(letter);
					draw(attempts[row], row);
				}
			}
		};
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
		child.innerHTML = filledWord[i];
	}
}

async function getData(lang) {
	const options = { method: "POST" };
	const response = await fetch(
		`https://wordle.kheynov.ru/api/word/get?lang=${lang}`,
		options
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
