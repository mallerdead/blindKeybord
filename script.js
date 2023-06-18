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
  const wordsBar = gameArea.querySelector(".words");
  let letters = gameArea.querySelectorAll(".letter");
  stringNumber = 1;
  gameArea.insertAdjacentHTML(
    "afterbegin",
    `<div class="cursor-test" style="left: ${parseFloat(
      letters[cursorPosition].getBoundingClientRect().left.toFixed(2) - 1.5,
      2
    )}px; top: ${parseFloat(
      letters[cursorPosition].getBoundingClientRect().top.toFixed(2),
      2
    )}px">`
  );
  let cursor = gameArea.querySelector(".cursor-test");
  cursorTopPosition = cursor.getBoundingClientRect().top;
  let printListener = (event) => {
    let currentLetter = letters[cursorPosition].innerHTML.toUpperCase();
    let audio = new Audio();
    audio.src = "assets/sounds/keyClick.mp3";

    if (event.keyCode == 8 && cursorPosition) {
      letters[cursorPosition-- - 1].classList.remove("correct", "incorrect");
      audio.autoplay = true;
    } else if (event.keyCode == currentLetter.charCodeAt()) {
      letters[cursorPosition++].classList.add("correct");
      audio.autoplay = true;
    } else if (event.keyCode == 32 && currentLetter == "&NBSP;") {
      letters[cursorPosition++].classList.add("correct");
      audio.autoplay = true;
    } else if (event.keyCode != 8) {
      letters[cursorPosition++].classList.add("incorrect");
      audio.autoplay = true;
    }

    if (cursorPosition == letters.length) {
      document.removeEventListener("keydown", printListener);
      document.querySelector(".words").innerHTML = `
        <div class="word">
          <div class="letter">P</div>
          <div class="letter">r</div>
          <div class="letter">e</div>
          <div class="letter">s</div>
          <div class="letter">s</div>
        </div>
        <div class="letter">&nbsp;</div>
        <div class="word">
          <div class="letter">s</div>
          <div class="letter">p</div>
          <div class="letter">a</div>
          <div class="letter">c</div>
          <div class="letter">e</div>
        </div>
        <div class="letter">&nbsp;</div>
        <div class="word">
          <div class="letter">t</div>
          <div class="letter">o</div>
        </div>
        <div class="letter">&nbsp;</div>
        <div class="word">
          <div class="letter">s</div>
          <div class="letter">t</div>
          <div class="letter">a</div>
          <div class="letter">r</div>
          <div class="letter">t</div>
        </div>`;
      document.addEventListener("keyup", startListener);
    }
    cursor.style.top = `${parseFloat(
      letters[cursorPosition].getBoundingClientRect().top.toFixed(2),
      2
    )}px`;
    cursor.style.left = `${parseFloat(
      letters[cursorPosition].getBoundingClientRect().left.toFixed(2) - 1.5,
      2
    )}px`;
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
