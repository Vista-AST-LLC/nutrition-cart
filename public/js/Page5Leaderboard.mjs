
let reload = true;
if (reload) {
    reload = false;

    await populateLeaderboards();
}

//********Function to Populate Leaderboards using data retrieved from LocalStorage********/
async function populateLeaderboards() {
    // WEEK VERSION
    let leaderboardEntries = JSON.parse(localStorage.getItem('WeekLeaderboard'));
    if (leaderboardEntries == null) {
        leaderboardEntries = [];
    }
    let sorted = Object.entries(leaderboardEntries)
        .sort((a, b) => b[1].score - a[1].score);

    let leaderboard = document.getElementById('weekLeaderboard');
    leaderboard.innerHTML = '';

    sorted.forEach(([name, info], position) => {
        const li = document.createElement('li');
        if (position === 0) li.classList.add('first-place');
        else if (position === 1) li.classList.add('second-place');
        else if (position === 2) li.classList.add('third-place');
        li.innerHTML = `
        <div class="counterName">
            <span class="rank"></span>
            <div class="name">${name}</div>
        </div>
        <div class="score">${info.score}</div>`;
        leaderboard.append(li);
    });

    // DAY VERSION
    leaderboardEntries = JSON.parse(localStorage.getItem('SingleLeaderboard'));
    if (leaderboardEntries == null) {
        leaderboardEntries = [];
    }
    sorted = Object.entries(leaderboardEntries)
        .sort((a, b) => b[1].score - a[1].score);
    leaderboard = document.getElementById('singleLeaderboard');

    sorted.forEach(([name, info], position) => {
        const li = document.createElement('li');
        if (position === 0) li.classList.add('first-place');
        else if (position === 1) li.classList.add('second-place');
        else if (position === 2) li.classList.add('third-place');
        li.innerHTML = `
        <div class="counterName">
            <span class="rank"></span>
            <div class="name">${name}</div>
        </div>
        <div class="score">${info.score}</div>`;
        leaderboard.append(li);
    });
}