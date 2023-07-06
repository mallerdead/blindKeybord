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
  let currentGameMode = "";

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

  for (let i = 0; i < gameModesBtn.length; i++) {
    if (gameModesBtn[i].classList.contains("active")) {
      currentGameMode = gameModesBtn[i].innerHTML;
    }
  }

  switch (currentGameMode) {
    case "word":
      gameModeWord(letters);
      break;
    case "time":
      break;
    default:
      throw Error("Нет такого режима игры");
  }
}

function gameModeWord(letters) {
  let cursorPosition = 0;
  let incorrectSymbol = 0;
  let timeInSeconds = 0;
  let correctSymbol = 0;
  let cursor = gameArea.querySelector(".cursor-test");
  let printListener = (event) => {
    let currentLetter = letters[cursorPosition].innerHTML.toUpperCase();
    let audio = new Audio();
    audio.src = "assets/sounds/keyClick.mp3";

    if (event.keyCode == 8 && cursorPosition) {
      letters[cursorPosition-- - 1].classList.remove("correct", "incorrect");
      incorrectSymbol++;
      audio.autoplay = true;
    } else if (event.keyCode == currentLetter.charCodeAt()) {
      letters[cursorPosition++].classList.add("correct");
      correctSymbol++;
      audio.autoplay = true;
    } else if (event.keyCode == 32 && currentLetter == "&NBSP;") {
      letters[cursorPosition++].classList.add("correct");
      correctSymbol++;
      audio.autoplay = true;
    } else if (event.keyCode != 8) {
      letters[cursorPosition++].classList.add("incorrect");
      incorrectSymbol++;
      audio.autoplay = true;
    }

    if (cursorPosition == letters.length) {
      document.removeEventListener("keydown", printListener);
      gameArea.innerHTML = `<div class="result">
      <div class="time">Time: ${timeInSeconds}s</div>
      <div class="correct-symbol">Correct: ${correctSymbol}</div>
      <div class="incorrect-symbol">Incorrect: ${incorrectSymbol}</div>
      <div>Press Space to restart</div>
    </div>
    `;
      document.addEventListener("keyup", startListener);
    } else {
      cursor.style.top = `${parseFloat(
        letters[cursorPosition].getBoundingClientRect().top.toFixed(2),
        2
      )}px`;
      cursor.style.left = `${parseFloat(
        letters[cursorPosition].getBoundingClientRect().left.toFixed(2) - 1.5,
        2
      )}px`;
    }
  };

  setInterval(() => {
    timeInSeconds++;
  }, 1000);

  document.addEventListener("keydown", printListener);
}

function gameModeTime(letters) {
  let cursorPosition = 0;
  let incorrectSymbol = 0;
  let timeInSeconds = 0;
  let correctSymbol = 0;
  let cursor = gameArea.querySelector(".cursor-test");
  let printListener = (event) => {
    let currentLetter = letters[cursorPosition].innerHTML.toUpperCase();
    let audio = new Audio();
    audio.src = "assets/sounds/keyClick.mp3";

    if (event.keyCode == 8 && cursorPosition) {
      letters[cursorPosition-- - 1].classList.remove("correct", "incorrect");
      incorrectSymbol++;
      audio.autoplay = true;
    } else if (event.keyCode == currentLetter.charCodeAt()) {
      letters[cursorPosition++].classList.add("correct");
      correctSymbol++;
      audio.autoplay = true;
    } else if (event.keyCode == 32 && currentLetter == "&NBSP;") {
      letters[cursorPosition++].classList.add("correct");
      correctSymbol++;
      audio.autoplay = true;
    } else if (event.keyCode != 8) {
      letters[cursorPosition++].classList.add("incorrect");
      incorrectSymbol++;
      audio.autoplay = true;
    }

    if (cursorPosition == letters.length) {
      document.removeEventListener("keydown", printListener);
      gameArea.innerHTML = `<div class="result">
      <div class="time">Time: ${timeInSeconds}s / ${}</div>
      <div class="correct-symbol">Correct: ${correctSymbol}</div>
      <div class="incorrect-symbol">Incorrect: ${incorrectSymbol}</div>
      <div>Press Space to restart</div>
    </div>
    `;
      document.addEventListener("keyup", startListener);
    } else {
      cursor.style.top = `${parseFloat(
        letters[cursorPosition].getBoundingClientRect().top.toFixed(2),
        2
      )}px`;
      cursor.style.left = `${parseFloat(
        letters[cursorPosition].getBoundingClientRect().left.toFixed(2) - 1.5,
        2
      )}px`;
    }
  };

  setInterval(() => {
    timeInSeconds++;
  }, 1000);

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
