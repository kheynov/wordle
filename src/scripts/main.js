import "../styles/style.css";

import * as playground from "./playground.js";

let lang = "ru";

playground.render(lang);

document.querySelector("#change-lang").addEventListener("click", () => {
    lang === "ru" ? lang = "en" : lang = "ru";
    playground.render(lang);
});
