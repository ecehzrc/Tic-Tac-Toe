let gridSize = 3;
const nameEntryScreen = document.getElementById("nameEntryScreen");
const createGameScreen = document.getElementById("createGameScreen");
const listGamesScreen = document.getElementById("listGamesScreen");
const gameScreen = document.getElementById("gameScreen");
const board = document.getElementById("board");
const gameList = document.getElementById("gameList");
const nameEntryForm = document.getElementById("nameEntryForm");
const nameInput = document.getElementById("nameInput");
const gameNameInput = document.getElementById("gameNameInput");
const gridSizeInput = document.getElementById("gridSizeInput");
const backgroundColorInput = document.getElementById("backgroundColorInput");
let currentPlayer = "X";
let gameBoard = [];
let gameResults = [];

function submitName() {
  const playerName = nameInput.value.trim();
  const gameName = gameNameInput.value.trim();
  if (playerName && gameName) {
    createGameScreen.style.display = "block";
    listGamesScreen.style.display = "none";
    gameScreen.style.display = "none";
    createBoard();
  } else {
    alert("Please enter your name and a game name.");
  }
  nameEntryScreen.style.display = "none";
  return false; // prevent form submission
}

function startNewGame() {
  gridSize = parseInt(gridSizeInput.value);
  if (gridSize >= 3) {
    createGameScreen.style.display = "none";
    listGamesScreen.style.display = "none";
    gameScreen.style.display = "block";
    createBoard();
  } else {
    alert("Please choose a grid size of at least 3.");
  }
}

function goToCreateGame() {
  createGameScreen.style.display = "block";
  listGamesScreen.style.display = "none";
  gameScreen.style.display = "none";
  document.body.style.backgroundColor = ""; // Reset background color
}

function goToListGames() {
  createGameScreen.style.display = "none";
  listGamesScreen.style.display = "block";
  gameScreen.style.display = "none";
  displayGameHistory();
}

function createBoard() {
  gameBoard = Array.from({ length: gridSize * gridSize }, () => "");
  board.innerHTML = "";
  board.style.gridTemplateColumns = `repeat(${gridSize}, 100px)`;
  board.style.gridTemplateRows = `repeat(${gridSize}, 100px)`;
  for (let i = 0; i < gridSize * gridSize; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.style.backgroundColor = backgroundColorInput.value;
    cell.setAttribute("data-index", i);
    cell.addEventListener("click", handleCellClick);
    board.appendChild(cell);
  }
}

function handleCellClick(event) {
  const index = event.target.getAttribute("data-index");

  if (gameBoard[index] === "") {
    gameBoard[index] = currentPlayer;
    event.target.textContent = currentPlayer;

    if (checkWinner()) {
      document.getElementById("winnerDisplay").innerHTML = `<p>${currentPlayer === "X" ? "X" : "O"} wins!</p>`;
      recordGameResult(currentPlayer);
      setTimeout(resetGame, 1500); // Reset the game after 1.5 seconds
    } else if (isBoardFull()) {
      document.getElementById("winnerDisplay").innerHTML = "<p>It's a tie!</p>";
      recordGameResult("Tie");
      resetGame();
    } else {
      currentPlayer = currentPlayer === "X" ? "O" : "X";
      setTimeout(makeComputerMove, 500);
    }
  }
}

function makeComputerMove() {
  const emptyCells = gameBoard.reduce((acc, cell, index) => {
    if (cell === "") {
      acc.push(index);
    }
    return acc;
  }, []);

  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  const computerMove = emptyCells[randomIndex];

  gameBoard[computerMove] = currentPlayer;
  document.querySelector(`[data-index="${computerMove}"]`).textContent = currentPlayer;

  if (checkWinner()) {
    document.getElementById("winnerDisplay").innerHTML = `<p>${currentPlayer} wins!</p>`;
    recordGameResult(currentPlayer);
    resetGame();
  } else if (isBoardFull()) {
    document.getElementById("winnerDisplay").innerHTML = "<p>It's a tie!</p>";
    recordGameResult("Tie");
    resetGame();
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
  }
}

function checkWinner() {
  const winPatterns = getWinPatterns();
  for (const pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (gameBoard[a] !== "" && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
      return true;
    }
  }
  return false;
}

function getWinPatterns() {
  const rows = Array.from({ length: gridSize }, (_, index) =>
    Array.from({ length: gridSize }, (_, col) => index * gridSize + col)
  );

  const columns = Array.from({ length: gridSize }, (_, index) =>
    Array.from({ length: gridSize }, (_, row) => row * gridSize + index)
  );

  const diagonals = [
    Array.from({ length: gridSize }, (_, index) => index * gridSize + index),
    Array.from({ length: gridSize }, (_, index) => index * gridSize + (gridSize - 1 - index))
  ];

  return [...rows, ...columns, ...diagonals];
}

function isBoardFull() {
  return gameBoard.every(cell => cell !== "");
}

function recordGameResult(winner) {
  const playerName = nameInput.value.trim();
  gameResults.push({ winner, playerName, date: new Date().toLocaleString() });
  displayGameHistory();
}

function displayGameHistory() {
  gameList.innerHTML = "";
  gameResults.forEach(result => {
    const listItem = document.createElement("li");
    listItem.classList.add("gameListItem");
    const [name, date, time] = result.date.split(' ');
    listItem.textContent = `${result.winner === 'Tie' ? 'It\'s a tie!' : `Winner: ${result.winner}`} - ${result.playerName || 'Anonymous'} - ${name} ${date}`;
    gameList.appendChild(listItem);
  });
}

function resetGame() {
  gameBoard = Array.from({ length: gridSize * gridSize }, () => "");
  currentPlayer = "X";
  
  document.getElementById("winnerDisplay").innerHTML = ""; // Clear the winner display
  createBoard();
  displayGameHistory();
  document.getElementById("winnerDisplay").innerHTML = ""; // Clear the winner display
}

function backToCreateGame() {
  const confirmation = confirm("Do you want to go back to Create Game?");
  if (confirmation) {
    nameEntryScreen.style.display = "block";
    createGameScreen.style.display = "none";
    listGamesScreen.style.display = "none";
    gameScreen.style.display = "none";
    document.body.style.backgroundColor = "";
  } else {
    resetGame();
  }
}
