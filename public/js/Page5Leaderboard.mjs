

let reload = true;
if (reload) {
    reload = false;
    const entries = new Map();
    entries.set("test1", {score: 87});
    entries.set("test2", {score: 90});
    entries.set("test3", {score: 45});
    entries.set("test4", {score: 99});
    entries.set("test5", {score: 75});
    entries.set("test6", {score: 86});

    let objVersion = JSON.stringify(Object.fromEntries(entries));
    localStorage.setItem('WeekLeaderboard', objVersion);

    
    entries.set("test1", {score: 54});
    entries.set("test2", {score: 82});
    entries.set("test3", {score: 94});
    entries.set("test4", {score: 76});
    entries.set("test5", {score: 75});
    entries.set("test6", {score: 92});
    
    objVersion = JSON.stringify(Object.fromEntries(entries));
    localStorage.setItem('DayLeaderboard', objVersion);
    await populateLeaderboards();
}

async function populateLeaderboards() {
    // WEEK VERSION
    let leaderboardEntries = JSON.parse(localStorage.getItem('WeekLeaderboard'));
    let sorted = Object.entries(leaderboardEntries)
        .sort((a,b) => b[1].score - a[1].score);

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
        <div class="space-filler-set-size"></div>
        <div class="score">${info.score}</div>`;
        leaderboard.append(li);
    });

    // DAY VERSION
    leaderboardEntries = JSON.parse(localStorage.getItem('DayLeaderboard'));
    sorted = Object.entries(leaderboardEntries)
        .sort((a,b) => b[1].score - a[1].score);
    leaderboard = document.getElementById('dayLeaderboard');

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
        <div class="space-filler-set-size"></div>
        <div class="score">${info.score}</div>`;
        leaderboard.append(li);
    });
}