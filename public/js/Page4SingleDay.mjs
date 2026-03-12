import { createFoodItem, DayGrade, Weekday, Constants } from "./common.mjs";
import { clean } from './profanity-cleaner/index.mjs';

let grade;
let refresh = true;
if (refresh) {
    await updateFoodItems();
    refresh = false;
    if (!localStorage.getItem('SingleDay')) {
        let day = new Weekday();
        this.localStorage.setItem('SingleDay', JSON.stringify(day));
    }
}

let keyLastTime = performance.now();
let keyEntry = '';

const singleFoodCodeInput = document.getElementById('singleFoodCode');
const singleAddFoodButton = document.getElementById('singleAddFoodButton');

singleFoodCodeInput.addEventListener('keydown', async function (e) {
    if (e.key === 'Enter') {
        await addFoodItem();
        await updateFoodItems();
    }
});

singleAddFoodButton.addEventListener('click', function (e) {
    singleFoodCodeInput.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Enter' })
    );
});

document.addEventListener('keydown', (e) => {
    // Always focus the input when a key is pressed
    if (document.activeElement !== singleFoodCodeInput && document.activeElement !== userName) {
        singleFoodCodeInput.focus({ preventScroll: true });
    }

    // According to old logic, ignore shift for scanners
    if (e.key === 'Shift') return;

    // If the keys are typed quickly enough, assume it's the scanner
    const now = performance.now();
    const isScannerInput = (now - keyLastTime) < 60;
    keyLastTime = now;

    // If it is not the scanner, return
    if (!isScannerInput) {
        keyEntry = e.key;
        return;
    }

    if (e.key === 'Enter' || e.key === 'Tab') {
        if (keyEntry.length > 0) {
            singleFoodCodeInput.value = keyEntry;
            keyEntry = '';
        }
        return;
    }

    keyEntry += e.key;
});

async function addFoodItem() {
    let item;

    const code = singleFoodCodeInput.value.trim().toUpperCase();
    const codeHelp = document.getElementById('codeHelp');

    // Reset visual state
    singleFoodCodeInput.classList.remove('error', 'success');
    codeHelp.classList.add('hidden');

    if (!code) {
        singleFoodCodeInput.classList.add('error');
        codeHelp.textContent = 'Please enter a food code.';
        codeHelp.classList.remove('hidden');
        return;
    }

    try {
        item = await createFoodItem(code);
    } catch (e) {
        codeHelp.textContent = 'Error: ' + e.message;
        codeHelp.classList.remove('hidden');
        singleFoodCodeInput.value = '';
        return;
    }

    // If all checks pass, add the item
    let activeDay = 'SingleDay';
    let parsed = JSON.parse(localStorage.getItem(activeDay));
    if (!parsed) {
        console.log("Parsed day is null: " + activeDay);
    }
    let day = await Weekday.fromJSON(parsed);
    day.addFoodItem(item);
    localStorage.setItem(activeDay, JSON.stringify(day));

    // Clear the input field after successful addition
    singleFoodCodeInput.value = '';
    singleFoodCodeInput.classList.remove('error', 'success');
    codeHelp.classList.add('hidden');
}

async function updateFoodItems() {
    const activeDay = 'SingleDay';
    const dayHelp = document.getElementById('dayHelp');

    dayHelp.classList.add('hidden');
    dayHelp.textContent = ''
    let parsed = JSON.parse(localStorage.getItem(activeDay));
    if (!parsed) {
        console.log("Parsed day is null: " + activeDay);
    }
    let day = await Weekday.fromJSON(parsed);

    const singleBreakfastItems = document.getElementById(`singleBreakfastItems`);
    const singleLunchItems = document.getElementById(`singleLunchItems`);
    const singleDinnerItems = document.getElementById(`singleDinnerItems`);
    const singleSnackItems = document.getElementById(`singleSnackItems`);

    singleBreakfastItems.innerHTML = '';
    singleLunchItems.innerHTML = '';
    singleDinnerItems.innerHTML = '';
    singleSnackItems.innerHTML = '';

    let buttonCount = 0;
    day.breakfast.forEach(item => {
        let trashButtonID = Constants.BREAKFAST + buttonCount++;
        const div = document.createElement('div');
        div.classList.add('breakfast-food-item')
        div.innerHTML = `
                    ${item.itemName}
                    <button class='trash-button' id=${trashButtonID}>🗑︎</button>`;
        singleBreakfastItems.append(div);
    });
    buttonCount = 0;
    day.lunch.forEach(item => {
        let trashButtonID = Constants.LUNCH + buttonCount++;
        const div = document.createElement('div');
        div.classList.add('lunch-food-item')
        div.innerHTML = `
                ${item.itemName}
                <button class='trash-button' id=${trashButtonID}>🗑︎</button>`;
        singleLunchItems.append(div);
    });
    buttonCount = 0;
    day.dinner.forEach(item => {
        let trashButtonID = Constants.DINNER + buttonCount++;
        const div = document.createElement('div');
        div.classList.add('dinner-food-item')
        div.innerHTML = `
                ${item.itemName}
                <button class='trash-button' id=${trashButtonID}>🗑︎</button>`;
        singleDinnerItems.append(div);
    });
    buttonCount = 0;
    day.snacks.forEach(item => {
        let trashButtonID = Constants.SNACKS + buttonCount++;
        const div = document.createElement('div');
        div.classList.add('snacks-food-item')
        div.innerHTML = `
                ${item.itemName}
                <button class='trash-button' id=${trashButtonID}>🗑︎</button>`;
        singleSnackItems.append(div);
    });

    let fillGradeInfo = new DayGrade(day);
    fillGradeInfo.fillHTML();

    grade = fillGradeInfo.score[DayGrade.SCORE][Constants.SCOREAVG];
    grade = Math.round(grade * 100) / 100;

    colorPointsCircle(grade);

    localStorage.setItem(activeDay, JSON.stringify(day));
}

function colorPointsCircle(gradeScore) {
    let color;

    if (gradeScore <= 50) {
        color = 0; // red
    } else if (gradeScore <= 70) {
        // red -> yellow
        color = (gradeScore - 50) / 20 * 60;
    } else if (gradeScore <= 95) {
        // yellow -> green
        color = 60 + (gradeScore - 70) / 25 * 60;
    } else {
        color = 120; // full green
    }

    document.getElementById('pointsCircle').style.backgroundColor = `hsl(${color}, 75%, 40%)`;
}

const singleDayFoodItemsContainer = document.getElementById('singleDay');

singleDayFoodItemsContainer.addEventListener('click', async (e) => {
    if (e.target.classList.contains('trash-button')) {
        const name = e.target.id;
        await removeFoodItemDiv(name);
        await updateFoodItems();
    }
});

async function removeFoodItemDiv(name) {
    let meal = name[0];
    let id = name.slice(1);
    let activeDay = 'SingleDay';
    let parsed = JSON.parse(localStorage.getItem(activeDay));
    if (!parsed) {
        console.log("Parsed day is null: " + activeDay);
    }
    let day = await Weekday.fromJSON(parsed);
    await day.removeFoodItem(meal, id);
    localStorage.setItem(activeDay, JSON.stringify(day));
}

//********Function to submit grade and username to be used in leaderboard********/
const userName = document.getElementById('userName');
const submitToLeaderboardButton = document.getElementById('singleDayGradeButton');
submitToLeaderboardButton.addEventListener('click', async function () {
    let user = userName.value.trim();
    if (user == '') return;
    user = clean(user);
    userName.value = user;
    let leaderboardEntries = JSON.parse(localStorage.getItem('SingleLeaderboard')) || [];
    let entries = new Map(Object.entries(leaderboardEntries));

    entries.set(user, { score: grade });

    let objVersion = JSON.stringify(Object.fromEntries(entries));
    localStorage.setItem('SingleLeaderboard', objVersion);

    document.getElementById('singleDayGradeButton').style.visibility = 'hidden';
    userName.value = ''
})

const clearAllPopUp = document.getElementById('clearAllPopUp');
const deleteFoodItems = document.getElementById('clearFoodItems');
const confirmDeleteAll = document.getElementById('confirmDeleteBtn');
const cancelClear = document.getElementById('cancelBtn');

//********Function used to delete all food item data********/
async function clearFoodItems() {
    let day = new Weekday();
    localStorage.setItem("SingleDay", JSON.stringify(day));
}

let clearallAnimation = [];
async function animateClearAll() {
    if (clearallAnimation.length == 0) {
        const animation = clearAllPopUp.animate([
            { transform: "scaleX(0)", transformOrigin: "bottom" },
            { transform: "scaleX(1)", transformOrigin: "bottom" }
        ], {
            duration: 300,
            easing: "ease-in-out",
            fill: "forwards"
        });

        clearallAnimation.push(animation);
        return animation.finished;
    } else {
        const animation = clearallAnimation[0];
        animation.reverse();
        clearallAnimation = [];
        return animation.finished;
    }
}

deleteFoodItems.addEventListener('click', async (e) => {
    if (e.target.id === "clearFoodItems") {
        animateClearAll();
        clearAllPopUp.style.display = 'flex';
        singleAddFoodButton.disabled = true;
        deleteFoodItems.disabled = true;
        submitToLeaderboardButton.disabled = true;
    }
});

cancelClear.addEventListener('click', async (e) => {
    if (e.target.id === "cancelBtn") {
        await animateClearAll();
        clearAllPopUp.style.display = 'none';
        singleAddFoodButton.disabled = false;
        deleteFoodItems.disabled = false;
        submitToLeaderboardButton.disabled = false;
    }
});

confirmDeleteAll.addEventListener('click', async (e) => {
    if (e.target.id === "confirmDeleteBtn") {
        await animateClearAll();
        clearAllPopUp.style.display = 'none';
        singleAddFoodButton.disabled = false;
        deleteFoodItems.disabled = false;
        submitToLeaderboardButton.disabled = false;
        await clearFoodItems();
        await updateFoodItems();
    }
});