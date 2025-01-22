let currentGame = {
    players: [],
    rounds: [],
    totals: []
};
let gameHistory = JSON.parse(localStorage.getItem('dominoHistory')) || [];

function createPlayerInputs() {
    const count = parseInt(document.getElementById('playerCount').value);
    const container = document.getElementById('playerNames');
    container.innerHTML = Array.from({length: count}, (_, i) => `
        <div class="col">
            <label class="form-label">Player ${i + 1} Name</label>
            <input type="text" class="form-control" id="player${i + 1}">
        </div>
    `).join('');
}

function startGame() {
    const count = parseInt(document.getElementById('playerCount').value);
    currentGame.players = Array.from({length: count}, (_, i) => {
        const name = document.getElementById(`player${i + 1}`).value || `Player ${i + 1}`;
        return { name, score: 0 };
    });
    
    currentGame.rounds = [];
    currentGame.totals = currentGame.players.map(() => 0);
    
    document.getElementById('gameSection').style.display = 'block';
    updateScoreboard();
    createScoreInputs();
}

function createScoreInputs() {
    const container = document.getElementById('scoreInputs');
    container.innerHTML = currentGame.players.map((player, i) => `
        <div class="col">
            <label class="form-label">${player.name}'s Score</label>
            <input type="number" class="form-control score-input" 
                   id="score${i + 1}" min="0" required>
        </div>
    `).join('');
}

function updateScoreboard() {
    const container = document.getElementById('scoreboard');
    container.innerHTML = `
        <div class="d-flex justify-content-between flex-wrap gap-3">
            ${currentGame.players.map((player, i) => `
                <div class="player-score">
                    ${player.name}: <span class="badge bg-primary">${currentGame.totals[i]}</span>
                </div>
            `).join('')}
        </div>
    `;
}

function addRound() {
    const scores = currentGame.players.map((_, i) => {
        const value = parseInt(document.getElementById(`score${i + 1}`).value) || 0;
        currentGame.totals[i] += value;
        return value;
    });
    
    currentGame.rounds.push(scores);
    updateScoreboard();
    clearInputs();
}

function clearInputs() {
    currentGame.players.forEach((_, i) => {
        document.getElementById(`score${i + 1}`).value = '';
    });
}

function finalizeGame() {
    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <p>Final Scores:</p>
        ${currentGame.players.map((player, i) => `
            <p>${player.name}: ${currentGame.totals[i]}</p>
        `).join('')}
        <p>Save this game?</p>
    `;
    
    new bootstrap.Modal(document.getElementById('confirmModal')).show();
}

function saveGame() {
    const gameEntry = {
        date: new Date().toLocaleString(),
        players: currentGame.players.map(p => p.name),
        rounds: currentGame.rounds,
        totals: currentGame.totals
    };
    
    gameHistory.unshift(gameEntry);
    localStorage.setItem('dominoHistory', JSON.stringify(gameHistory));
    
    updateHistoryDisplay();
    document.getElementById('gameSection').style.display = 'none';
    new bootstrap.Modal(document.getElementById('confirmModal')).hide();
}

function updateHistoryDisplay() {
    const container = document.getElementById('gameHistory');
    container.innerHTML = gameHistory.map(game => `
        <div class="history-entry">
            <h5>Game - ${game.date}</h5>
            <p>Players: ${game.players.join(', ')}</p>
            ${game.rounds.map((round, i) => `
                <p class="mb-1">Round ${i + 1}: ${round.join(' - ')}</p>
            `).join('')}
            <hr>
            <p class="fw-bold">Final Scores: ${game.totals.join(' - ')}</p>
        </div>
    `).join('');
}

// Initialize
createPlayerInputs();
updateHistoryDisplay();
