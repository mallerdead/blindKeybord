const gameModeSettingsBtn = document.querySelectorAll(".game-mode-setting");
const gameModesBtn = document.querySelectorAll(".game-mode");
const gameArea = document.querySelector(".typing-area");

let words = [];

let startListener = (event) => {
  if (event.code == "Space") {
    startGame();
  }
};
gameModeSettingsBtn.forEach((btn) =>
  btn.addEventListener("click", () => {
    if (btn.classList.contains("active")) {
      return;
    }

    gameModeSettingsBtn.forEach((item) => {
      item.classList.remove("active");
    });

    btn.classList.add("active");
  })
);

gameModesBtn.forEach((btn) =>
  btn.addEventListener("click", () => {
    if (btn.classList.contains("active")) {
      return;
    }

    gameModesBtn.forEach((item) => {
      item.classList.remove("active");
    });

    btn.classList.add("active");
  })
);

function getCountWords() {
  for (let i = 0; i < gameModeSettingsBtn.length; i++) {
    if (gameModeSettingsBtn[i].classList.contains("active")) {
      return +gameModeSettingsBtn[i].innerHTML;
    }
  }
  throw Error("Не выбран режим игры");
}

function startGame() {
  getWords(getCountWords(), words).then((item) => startPrint(item));
}

function startPrint(words) {
  gameArea.innerHTML = `<span class="cursor"></span><div class="words">
  ${words
    .map(
      (word) =>
        `<div class="word">${Array.from(word)
          .map((letter) => `<div class="letter">${letter}</div>`)
          .join("")}</div>`
    )
    .join(`<div class="letter">&nbsp;</div>`)}
  </div>`;
  let letters = Array.from(gameArea.querySelectorAll(".letter")).map((letter) =>
    letter.innerHTML == "&nbsp;" ? " " : letter.innerHTML
  );
  document.removeEventListener("keyup", startListener);
  document.addEventListener("keydown", (event) => {
    console.log(letters[0].toUpperCase().charCodeAt());
    console.log();

    if (event.keyCode == letters[0].charCodeAt()) {
      console.log(true);
    }
  });
}

async function getWords(count) {
  let result = [];
  let response = await fetch(
    "https://random-word-api.vercel.app/api?words=500"
  );
  if (response.status == 200) {
    let arr = await response.json();
    for (let i = 0; i < count; i++) {
      result[i] = arr[Math.floor(Math.random() * arr.length)];
    }
    return result;
  }
  throw Error("Нет ответа от сервера");
}

document.addEventListener("keyup", startListener);
