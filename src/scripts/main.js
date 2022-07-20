import "../styles/style.css";

import * as playground from "./playground.js";
import playGame from "./gameplay.js";

let lang = "ru";

document.addEventListener("DOMContentLoaded", () => {
	playground.render(lang);
	playGame(lang);
});

document.querySelector("#change-lang").addEventListener("click", () => {
	lang === "ru" ? (lang = "en") : (lang = "ru");
	playground.render(lang);
	playGame(lang);
});
