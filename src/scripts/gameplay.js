const keys = document.getElementsByClassName("key");

export default function playGame(lang) {
	const attempts = [[]];
	let row = 0;
	console.log(lang);
	// let word;
	// lang === "ru" ? (word = "удило") : (word = "aboba");

	for (let i = 0; i < keys.length; i++) {
		keys[i].onclick = ({ target }) => {
			const letter = target.getAttribute("data-key");
			if (row < 6) {
				if (letter === ">>") {
					if (attempts[row].length === 5) {
						row++;
						attempts.push([]);
					}
				} else if (letter === "backspace") {
					attempts[row].pop();
					console.log(attempts[0]);
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
