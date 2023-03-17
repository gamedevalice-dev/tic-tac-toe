const cells = document.querySelectorAll('.cell');
const restartButton = document.createElement('button');
const scoreBoard = document.createElement('p');
let currentPlayer = 'X';
let moves = 0;
let gameActive = true;
let playerScore = 0;
let computerScore = 0;

// Win conditions
const winConditions = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

function checkWin() {
    for (const condition of winConditions) {
        if (
            cells[condition[0]].textContent &&
            cells[condition[0]].textContent === cells[condition[1]].textContent &&
            cells[condition[0]].textContent === cells[condition[2]].textContent
        ) {
            // Add the 'win' class to the winning cells
            cells[condition[0]].classList.add('win');
            cells[condition[1]].classList.add('win');
            cells[condition[2]].classList.add('win');
            return true;
        }
    }
    return false;
}

function checkDraw() {
    return moves === 9;
}

function minimaxCheckWin(board = null) {
    const targetBoard = board || Array.from(cells, (cell) => cell.textContent);

    for (const condition of winConditions) {
        if (
            targetBoard[condition[0]] &&
            targetBoard[condition[0]] === targetBoard[condition[1]] &&
            targetBoard[condition[0]] === targetBoard[condition[2]]
        ) {
            return targetBoard[condition[0]];
        }
    }

    return null;
}

function minimaxCheckDraw(board) {
    return board.every((cell) => cell !== null);
}

function minimax(board, depth, isMaximizingPlayer) {
    const winner = minimaxCheckWin(board);

    if (winner === 'X') {
        return -10 + depth;
    }

    if (winner === 'O') {
        return 10 - depth;
    }

    if (minimaxCheckDraw(board)) {
        return 0;
    }

    if (isMaximizingPlayer) {
        let bestVal = -Infinity;

        for (let i = 0; i < 9; i++) {
            if (!board[i]) {
                board[i] = 'O';
                bestVal = Math.max(bestVal, minimax(board, depth + 1, false));
                board[i] = null;
            }
        }

        return bestVal;
    } else {
        let bestVal = Infinity;

        for (let i = 0; i < 9; i++) {
            if (!board[i]) {
                board[i] = 'X';
                bestVal = Math.min(bestVal, minimax(board, depth + 1, true));
                board[i] = null;
            }
        }

        return bestVal;
    }
}

function bestMove() {
    let bestVal = -Infinity;
    let bestMove = -1;
    const board = Array.from(cells, (cell) => cell.textContent || null);

    for (let i = 0; i < 9; i++) {
        if (!board[i]) {
            board[i] = 'O';
            const moveVal = minimax(board, 0, false);

            board[i] = null;

            if (moveVal > bestVal) {
                bestVal = moveVal;
                bestMove = i;
            }
        }
    }

    return bestMove;
}

function randomMove() {
    let availableCells = [];

    cells.forEach((cell, index) => {
        if (!cell.textContent) {
            availableCells.push(index);
        }
    });

    if (availableCells.length > 0) {
        return availableCells[Math.floor(Math.random() * availableCells.length)];
    } else {
        return -1;
    }
}

function showMessage(text) {
    const messageElement = document.getElementById('message');
    messageElement.textContent = text;
}

function computerMove() {
    setTimeout(() => {
        let computerChoice = bestMove();

        // If no valid move found by the Minimax algorithm, choose a random move
        if (computerChoice === -1) {
            computerChoice = randomMove();
        }

        if (computerChoice !== -1) {
            cells[computerChoice].textContent = 'O';
            moves++;

            if (checkWin()) {
                computerScore++;
                updateScoreBoard();
                showMessage('Computer wins!');
                restartButton.style.display = 'block';
                gameActive = false;
            } else if (checkDraw()) {
                showMessage("It's a draw!");
                restartButton.style.display = 'block';
                gameActive = false;
            }
        }
    }, 200); // 500ms delay before the computer makes a move
}

function restartGame() {
    cells.forEach((cell) => {
        cell.textContent = '';
        cell.classList.remove('win');
    });
    currentPlayer = 'X';
    moves = 0;
    showMessage(''); // Clear the message when the game restarts
    restartButton.style.display = 'none';
    gameActive = true; // Reset the game state
}
function updateScoreBoard() {
    scoreBoard.textContent = `Player: ${playerScore} - Computer: ${computerScore}`;
}

cells.forEach((cell) => {
    cell.addEventListener('click', (e) => {
        if (!e.target.textContent && gameActive) {
            e.target.textContent = currentPlayer;
            moves++;

            if (checkWin()) {
                playerScore++;
                updateScoreBoard();
                showMessage(`${currentPlayer} wins!`);
                restartButton.style.display = 'block';
                gameActive = false;
            } else if (checkDraw()) {
                showMessage("It's a draw!");
                restartButton.style.display = 'block';
                gameActive = false;
            } else {
                computerMove();
            }
        }
    });
});

// Create and configure the restart button
restartButton.textContent = 'Restart Game';
restartButton.style.display = 'none';
restartButton.addEventListener('click', restartGame);

// Create and configure the score board
updateScoreBoard();
document.body.insertBefore(scoreBoard, document.body.firstChild);

document.body.appendChild(restartButton);
