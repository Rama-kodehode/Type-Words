const showWord = document.getElementById("show-word");
const gameInput = document.getElementById("input");
const userInput = document.getElementById("user-input");
const deleteBtn = document.getElementById("delete-btn");
const displayBtn = document.getElementById("display-btn");
const wordsCont = document.getElementById("words-cont");
const startBtn = document.getElementById("start-btn");
const skipBtn = document.getElementById("skip-btn");
const endBtn = document.getElementById("end-btn");
const scoreText = document.getElementById("score-text");
const showTimer = document.getElementById("timer");
const hidePara = document.getElementById("word");
const hideAddWord = document.querySelector(".add-words");

let userWords = JSON.parse(localStorage.getItem("userWords")) || [];

let wordIndex = 0;
let score = 0;
let timer;
let isDisplayed = false;

function saveWords() {
  let word = userInput.value.trim();

  if (word !== "") {
    userWords.push(word);
    localStorage.setItem("userWords", JSON.stringify(userWords));

    displayUserWords();

    userInput.value = "";
    console.log(userWords);
  }
}

function displayUserWords() {
  wordsCont.innerHTML = "";
  userWords.forEach((word, index) => {
    const displayWordCont = document.createElement("div");
    const displayWord = document.createElement("input");
    const editBtn = document.createElement("button");
    const deleteWordBtn = document.createElement("button");

    displayWordCont.classList.add("display-word-cont");
    displayWord.classList.add("displayed-words");
    editBtn.classList.add("edit-btn");
    deleteWordBtn.classList.add("delete-word-btn");

    editBtn.textContent = "EDIT";
    deleteWordBtn.textContent = "DEL";
    displayWord.disabled = true;
    displayWord.value = word;

    // Edit button
    editBtn.addEventListener("click", () => {
      displayWord.disabled = false;
      editBtn.textContent = "ACCEPT";
      displayWord.focus();
    });

    displayWord.addEventListener("blur", () => {
      const newWord = displayWord.value.trim();
      if (newWord !== "") {
        userWords[index] = newWord;
        localStorage.setItem("userWords", JSON.stringify(userWords));
        displayUserWords();
      } else {
        displayWord.value = word;
      }
    });

    // Delete button
    deleteWordBtn.addEventListener("click", () => {
      userWords.splice(index, 1);
      localStorage.setItem("userWords", JSON.stringify(userWords));
      displayUserWords();
    });

    displayWordCont.append(displayWord, editBtn, deleteWordBtn);
    wordsCont.append(displayWordCont);
  });
}

deleteBtn.addEventListener("click", () => {
  localStorage.clear();
  userInput = [];
  displayUserWords();
});

displayBtn.addEventListener("click", () => {
  if (isDisplayed) {
    wordsCont.style.display = "none";
  } else {
    wordsCont.style.display = "block";
  }
  isDisplayed = !isDisplayed;

  displayUserWords();
});

startBtn.addEventListener("click", () => {
  const savedUserWords = localStorage.getItem("userWords");
  if (savedUserWords) {
    userWords = JSON.parse(savedUserWords);
    gameInput.disabled = false;
    hidePara.textContent = `"TYPE THE WORD"`;
    startGame();
  }
});

function startGame() {
  fisherYates(userWords);
  showWord.textContent = userWords[wordIndex];
  gameInput.value = "";
  gameInput.focus();
  hideAddWord.style.display = "none";
}

function checkWord() {
  const typedWord = gameInput.value.trim().toLowerCase();
  const actualWord = userWords[wordIndex];

  if (typedWord === actualWord) {
    score++;
    hidePara.textContent = score;
    userWords.splice(wordIndex, 1);

    if (wordIndex < userWords.length) {
      startGame();
    } else {
      endGame();
    }
  }
}

userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    saveWords();
  }
});

gameInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    checkWord();
  }
});

skipBtn.addEventListener("click", () => {
  wordIndex++;
  startGame();
});

endBtn.addEventListener("click", () => {
  endGame();
});

function endGame() {
  gameInput.innerHTML = "";
  hidePara.textContent = `You scored ${score} point`;
  showWord.innerHTML = "";
  gameInput.disabled = true;
  hideAddWord.style.display = "block";
}

// Randomizez array index
function fisherYates(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
