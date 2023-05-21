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
  getWords(getCountWords(), words)
    .then((item) => startPrint(item))
    .catch((err) => console.error(err.message));
}

function startPrint(words) {
  document.removeEventListener("keyup", startListener);
  let cursorPosition = 0;
  gameArea.innerHTML = `<div class="words">
  ${words
    .map(
      (word) =>
        `<div class="word">${Array.from(word)
          .map((letter) => `<div class="letter">${letter}</div>`)
          .join("")}</div>`
    )
    .join(`<div class="letter">&nbsp;</div>`)}
  </div>`;
  let letters = gameArea.querySelectorAll(".letter");
  let printListener = (event) => {
    let currentLetter = letters[cursorPosition].innerHTML.toUpperCase();
    console.log(event.keyCode);
    if (event.keyCode == 8 && cursorPosition) {
      cursorPosition--;
      document
        .querySelectorAll(".letter.active")
        .forEach((letter, index, arr) => {
          if (arr.length - 1 == index) {
            letter.classList.remove("cursor", "active", "correct", "incorrect");
          } else if (arr.length - 2 == index) {
            letter.classList.add("cursor");
          }
        });
    } else if (event.keyCode == currentLetter.charCodeAt()) {
      letters[cursorPosition].classList.add("correct", "active");
      cursorPosition++;
      document
        .querySelectorAll(".letter.active")
        .forEach((letter, index, arr) =>
          arr.length - 1 == index
            ? letter.classList.add("cursor")
            : letter.classList.remove("cursor")
        );
    } else if (event.keyCode == 32 && currentLetter == "&NBSP;") {
      letters[cursorPosition].classList.add("correct", "active");
      cursorPosition++;
      document
        .querySelectorAll(".letter.active")
        .forEach((letter, index, arr) =>
          arr.length - 1 == index
            ? letter.classList.add("cursor")
            : letter.classList.remove("cursor")
        );
    } else {
      letters[cursorPosition].classList.add("incorrect", "active");
      cursorPosition++;
      document
        .querySelectorAll(".letter.active")
        .forEach((letter, index, arr) =>
          arr.length - 1 == index
            ? letter.classList.add("cursor")
            : letter.classList.remove("cursor")
        );
    }

    if (cursorPosition == letters.length) {
      document.removeEventListener("keydown", printListener);
      startGame();
    }
  };

  document.addEventListener("keydown", printListener);
}

async function getWords(count) {
  try {
    let result = [];
    let response = await fetch(
      "https://random-word-api.vercel.app/api?words=500"
    );
    if (response.ok) {
      let arr = await response.json();
      for (let i = 0; i < count; i++) {
        result[i] = arr[Math.floor(Math.random() * arr.length)];
      }
      return result;
    }
  } catch (err) {
    throw Error("Нет ответа от сервера");
  }
}

document.addEventListener("keyup", startListener);
