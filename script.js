let fields = [null, null, null, null, null, null, null, null, null];

let currentPlayer = "cross";
let startingPlayer = "cross";
let winningData = null;

const WINNING_COMBINATIONS = [
  { indexes: [0, 1, 2], type: "horizontal" },
  { indexes: [3, 4, 5], type: "horizontal" },
  { indexes: [6, 7, 8], type: "horizontal" },
  { indexes: [0, 3, 6], type: "vertical" },
  { indexes: [1, 4, 7], type: "vertical" },
  { indexes: [2, 5, 8], type: "vertical" },
  { indexes: [0, 4, 8], type: "diagonal-1" },
  { indexes: [2, 4, 6], type: "diagonal-2" },
];

// 1. Initial render (only once)
function init() {
  render();
}

let playerNames = { x: "Player X", o: "Player O" };
let scores = { x: 0, o: 0 };

function startGame() {
  const nameX = document.getElementById("player1-name").value;
  const nameO = document.getElementById("player2-name").value;
  if (nameX) playerNames.x = nameX;
  if (nameO) playerNames.o = nameO;

  // Update Scoreboard labels
  document.getElementById("name-x").innerText = playerNames.x;
  document.getElementById("name-o").innerText = playerNames.o;

  // Hide setup, show scores
  document.getElementById("setup-container").style.display = "none";
  document.getElementById("scoreboard").style.display = "flex";

  render();
}

function handleClick(index) {
    if (fields[index] === null && !winningData) {
        fields[index] = currentPlayer;
        updateCell(index);
        
        winningData = checkWinner();

        if (winningData) {
            drawWinLine();
            updateScore(currentPlayer);
            showResult(`Winner: ${playerNames[currentPlayer === 'cross' ? 'x' : 'o']}`);
        } else if (!fields.includes(null)) {
            // LOGICA DE EMPATE
            showResult("It's a Draw! (Remis)");
        } else {
            currentPlayer = (currentPlayer === 'cross') ? 'circle' : 'cross';
            showResult(`Turn: ${playerNames[currentPlayer === 'cross' ? 'x' : 'o']}`);
        }
    }
}

function updateScore(winner) {
    if (winner === 'cross') {
        scores.x++;
        document.getElementById('score-x').innerText = scores.x;
    } else {
        scores.o++;
        document.getElementById('score-o').innerText = scores.o;
    }
}

// Helper to update only one cell without full render
function updateCell(index) {
    const cell = document.getElementById(`cell-${index}`);
    cell.innerHTML = currentPlayer === 'circle' ? generateCircleSvg() : generateCrossSvg();
}

function checkWinner() {
  for (let combo of WINNING_COMBINATIONS) {
    const [a, b, c] = combo.indexes;
    if (fields[a] && fields[a] === fields[b] && fields[a] === fields[c]) {
      return combo;
    }
  }
  return null;
}

// Function to update the text at the top
function showResult(text) {
    document.getElementById('player-status').innerText = text;
}

// Function to reset everything
function restartGame() {
  fields = [null, null, null, null, null, null, null, null, null];
  winningData = null;

  // Lógica para alternar el inicio
  if (startingPlayer === "cross") {
    startingPlayer = "circle";
  } else {
    startingPlayer = "cross";
  }

  currentPlayer = startingPlayer; // El turno actual ahora es el del nuevo iniciador

  // Actualizamos el mensaje de texto para que los jugadores sepan quién empieza
  const nextPlayerName = playerNames[currentPlayer === "cross" ? "x" : "o"];
  showResult(`New Round: ${nextPlayerName} starts!`);

  render(); // Redibuja el tablero vacío
}

// 2. New function to add the lines ONLY when someone wins
function drawWinLine() {
  winningData.indexes.forEach((index) => {
    const cell = document.getElementById(`cell-${index}`);
    // Create the line div and add the specific type class
    const line = document.createElement("div");
    line.className = `winning-line ${winningData.type}-line`;
    cell.appendChild(line);
  });
}

function render() {
  const content = document.getElementById("content");
  let tableHtml = "<table>";

  for (let i = 0; i < 3; i++) {
    tableHtml += "<tr>";
    for (let j = 0; j < 3; j++) {
      const index = i * 3 + j;
      // We give an ID to each cell to target it later
      tableHtml += `<td id="cell-${index}" onclick="handleClick(${index})"></td>`;
    }
    tableHtml += "</tr>";
  }

  tableHtml += "</table>";
  content.innerHTML = tableHtml;
}

// function restartGame(){
//     fields = [null, null, null, null, null, null, null, null, null];
//     render();
// }
// SVG Generators (Keep them as they were)
function generateCircleSvg() {
  return `<svg class="svg-container" width="70" height="70" viewBox="0 0 70 70">
                <circle class="animated-circle" cx="35" cy="35" r="30" />
            </svg>`;
}

function generateCrossSvg() {
  return `<svg class="svg-container" width="70" height="70" viewBox="0 0 70 70">
                <line class="animated-cross-line-1" x1="15" y1="15" x2="55" y2="55" />
                <line class="animated-cross-line-2" x1="55" y1="15" x2="15" y2="55" />
            </svg>`;
}

init();

// Function to trigger confetti when someone wins
function celebrateVictory() {
    const duration = 3 * 1000; // 3 seconds of confetti
    const end = Date.now() + duration;

    // Colors of our Tic Tac Toe game
    const colors = ['#00B0EF', '#FFC000', '#FF0000'];

    (function frame() {
        // Launch from the left
        confetti({
            particleCount: 7,
            angle: 60,
            spread: 55,
            origin: { x: 0, y: 0.8 },
            colors: colors
        });
        // Launch from the right
        confetti({
            particleCount: 7,
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 0.8 },
            colors: colors
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame); // Keep it going until time runs out
        }
    }());
}

function handleClick(index) {
  if (fields[index] === null && !winningData) {
    fields[index] = currentPlayer;
    updateCell(index);

    winningData = checkWinner();

    if (winningData) {
      drawWinLine();
      updateScore(currentPlayer);
      showResult(
        `Winner: ${playerNames[currentPlayer === "cross" ? "x" : "o"]}!`
      );

      // --- ADD THIS LINE HERE ---
      celebrateVictory(); // <--- This will trigger the confetti!
    } else if (!fields.includes(null)) {
      showResult("It's a Draw! (Remis)");
    } else {
      // Change turn
      currentPlayer = currentPlayer === "cross" ? "circle" : "cross";
      showResult(`Turn: ${playerNames[currentPlayer === "cross" ? "x" : "o"]}`);
    }
  }
}