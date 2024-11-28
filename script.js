// Show loading screen before starting the game
window.onload = function() {
    setTimeout(() => {
        // Hide loading screen and show the game screen
        document.querySelector('.loading-screen').style.display = 'none';
        document.querySelector('.game-screen').classList.remove('hidden');
    }, 3000); // 3 seconds for loading
};

// Rest of your existing game logic...

// Handle the game logic as before...


// The rest of the game logic remains the same
const cells = document.querySelectorAll('.cell');
const statusText = document.querySelector('.status');
const restartBtn = document.querySelector('.restart');
const resultScreen = document.querySelector('.result-screen');
const resultMessage = document.querySelector('.result-message');
const newGameBtn = document.querySelector('.new-game');
const modeSelection = document.querySelectorAll('input[name="mode"]');

const xWinsText = document.getElementById('x-wins');
const oWinsText = document.getElementById('o-wins');
const drawsText = document.getElementById('draws');

let currentPlayer = 'X';
let board = ['', '', '', '', '', '', '', '', ''];
let isGameOver = false;
let mode = 'AI'; // Default to single-player mode

// Score tracking
let scores = {
    X: 0,
    O: 0,
    Draws: 0
};

const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

// Update mode based on player selection
modeSelection.forEach(option => {
    option.addEventListener('change', () => {
        mode = document.querySelector('input[name="mode"]:checked').value;
        restartGame(); // Restart the game to apply the new mode
    });
});

// Handles cell clicks
function handleClick(e) {
    const index = e.target.dataset.index;

    // Ensure we don't overwrite a taken cell or play after the game is over
    if (board[index] !== '' || isGameOver) return;

    board[index] = currentPlayer;
    e.target.textContent = currentPlayer;
    e.target.classList.add('taken');

    // Remove any previous player class (in case of a reset or new game)
    e.target.classList.remove('x', 'o'); // Clear previous X or O class

    // Add the appropriate class for glowing effect (x or o)
    if (currentPlayer === 'X') {
        e.target.classList.add('x');
    } else if (currentPlayer === 'O') {
        e.target.classList.add('o');
    }

    if (checkWin()) {
        handleWin();
        return;
    }

    if (board.every(cell => cell !== '')) {
        handleDraw();
        return;
    }

    // Switch turns after player move
    if (mode === 'AI' && currentPlayer === 'X') {
        currentPlayer = 'O';
        statusText.textContent = "Player O's Turn (AI)";
        setTimeout(aiMove, 500); // AI makes a move after a delay
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusText.textContent = `Player ${currentPlayer}'s Turn`;
    }
}

// AI makes a random move (only if it's O's turn)
function aiMove() {
    if (isGameOver) return;

    // Find all empty cells
    const emptyCells = board
        .map((value, index) => value === '' ? index : -1)
        .filter(index => index !== -1);

    // Pick a random empty cell
    const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    // Apply the AI's move (O)
    board[randomIndex] = 'O';
    const aiCell = cells[randomIndex];
    aiCell.textContent = 'O';
    aiCell.classList.add('taken');
    aiCell.classList.remove('x', 'o'); // Remove any previous classes
    aiCell.classList.add('o'); // Add O class for glowing effect

    // Check if AI wins
    if (checkWin()) {
        handleWin();
        return;
    }

    // If no winner, switch to player X's turn
    currentPlayer = 'X';
    statusText.textContent = "Player X's Turn";
}

// Checks if the current player wins
function checkWin() {
    const winningPattern = winPatterns.find(pattern =>
        pattern.every(index => board[index] === currentPlayer)
    );

    if (winningPattern) {
        highlightWinningCells(winningPattern);
        return true;
    }

    return false;
}

// Highlights the winning cells
function highlightWinningCells(pattern) {
    pattern.forEach(index => {
        cells[index].classList.add('winning');
    });
}

// Handles a win
function handleWin() {
    scores[currentPlayer]++;
    updateScoreboard();
    showResult(`Player ${currentPlayer} Wins!`);
    isGameOver = true;
}


// Handles a draw
function handleDraw() {
    scores.Draws++;
    updateScoreboard();
    showResult("It's a Draw!");
    isGameOver = true;
}

// Updates the scoreboard
function updateScoreboard() {
    xWinsText.textContent = scores.X;
    oWinsText.textContent = scores.O;
    drawsText.textContent = scores.Draws;
}

// Displays result screen
function showResult(message) {
    resultMessage.textContent = message;
    resultScreen.classList.remove('hidden');
}

// Restarts the game
function restartGame() {
    currentPlayer = 'X';
    board = ['', '', '', '', '', '', '', '', ''];
    isGameOver = false;
    statusText.textContent = "Player X's Turn";
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('taken', 'winning'); // Clear winning animation
    });
}

// Starts a new game
function newGame() {
    restartGame();
    resultScreen.classList.add('hidden');
}

cells.forEach(cell => cell.addEventListener('click', handleClick));
restartBtn.addEventListener('click', restartGame);
newGameBtn.addEventListener('click', newGame);   
