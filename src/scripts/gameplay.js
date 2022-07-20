let word;
const keys = document.getElementsByClassName("key");
const attempts = [""];

export default function playGame(lang) {
	lang === "ru" ? (word = "удило") : (word = "aboba");

	for (let i = 0; i < keys.length; i++) {
		keys[i].onclick = ({ target }) => {
			const letter = target.getAttribute("data-key");
			console.log(letter);
            attempts[0] += letter;
            draw(attempts[0]);
		};
	}
}

function draw(word) {
	const letters = word.split("");
	let child;
	const wordsOnBoard = document.querySelectorAll(".word");

	for (let i = 0; i < word.length; i++) {
		child = wordsOnBoard[0].children[i];
		child.innerHTML = letters[i];
	}
}
