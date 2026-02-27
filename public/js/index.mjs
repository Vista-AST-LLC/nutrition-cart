const welcomeScreen = document.getElementById('welcomeScreen');

let pressedKeys = new Set();
const adminTools = new Set(['Control',' ','m']);
const adminButtons = document.getElementById('adminButtons');
document.addEventListener('keydown', (e) => {
    pressedKeys.add(e.key);
    if (areSetsEqual(pressedKeys, adminTools)) {
        adminButtons.style.display = 'flex';
    }
});

document.addEventListener('keyup', (e) => {
    pressedKeys.delete(e.key);
})

function areSetsEqual (a, b) {
  if (a.size !== b.size) {
    return false;
  }
  return [...a].every(value => b.has(value));
};

adminButtons.addEventListener('click', () => {
    let objVersion = JSON.stringify(Object.fromEntries(new Map()));
    localStorage.setItem('WeekLeaderboard', objVersion);
    localStorage.setItem('SingleLeaderboard', objVersion);
    adminButtons.innerHTML = `<a class="admin-button">Leaderboards Cleared!</a>`;
})
