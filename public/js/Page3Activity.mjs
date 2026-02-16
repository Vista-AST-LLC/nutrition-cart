import { createFoodItem, FoodItem, Weekday, Constants } from "./common.mjs";

let active;

//Function to Select the Active Day
async function setActiveDay(day) {
    switch (day) {
        case 'M':
            localStorage.setItem("ActiveDay", 'Monday')
            document.getElementById('monday').style.backgroundColor = 'lightgoldenrodyellow'
            updateBackgroundColor('tuesday', 'wednesday', 'thursday', 'friday')
            active = 'mon'
            break;
        case 'T':
            localStorage.setItem("ActiveDay", 'Tuesday')
            document.getElementById('tuesday').style.backgroundColor = 'lightgoldenrodyellow'
            updateBackgroundColor('monday', 'wednesday', 'thursday', 'friday')
            active = 'tues'
            break;
        case 'W':
            localStorage.setItem("ActiveDay", 'Wednesday')
            document.getElementById('wednesday').style.backgroundColor = 'lightgoldenrodyellow'
            updateBackgroundColor('monday', 'tuesday', 'thursday', 'friday')
            active = 'wed'
            break;
        case 'TH':
            localStorage.setItem("ActiveDay", 'Thursday')
            document.getElementById('thursday').style.backgroundColor = 'lightgoldenrodyellow'
            updateBackgroundColor('monday', 'tuesday', 'wednesday', 'friday')
            active = 'thurs'
            break;
        case 'F':
            localStorage.setItem("ActiveDay", 'Friday')
            document.getElementById('friday').style.backgroundColor = 'lightgoldenrodyellow'
            updateBackgroundColor('monday', 'tuesday', 'wednesday', 'thursday')
            active = 'fri'
            break;
        default:
            resetBackgroundColor('monday', 'tuesday', 'wednesday', 'thursday', 'friday')
            active = 'mon'
            break;
    }
}

let keyLastTime = performance.now();
let keyEntry = '';

/*let monday = new Weekday();
localStorage.setItem('Monday', JSON.stringify(monday));
localStorage.setItem('ActiveDay', 'Monday');*/

const foodCodeInput = document.getElementById('foodCode');
const addFoodButton = document.getElementById('addFoodButton');

foodCodeInput.addEventListener('keydown', async function (e) {
    if (e.key === 'Enter') {
        await addFoodItem();
        await updateFoodItems();
    }
});

addFoodButton.addEventListener('click', function (e) {
    foodCodeInput.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Enter' })
    );
});

document.addEventListener('keydown', (e) => {
    // Always focus the input when a key is pressed
    if (document.activeElement !== foodCodeInput) {
        foodCodeInput.focus();
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
            foodCodeInput.value = keyEntry;
            keyEntry = '';
        }
        return;
    }

    keyEntry += e.key;
});

async function addFoodItem() {
    let item;

    const code = foodCodeInput.value.trim().toUpperCase();
    const codeHelp = document.getElementById('codeHelp');

    // Reset visual state
    foodCodeInput.classList.remove('error', 'success');
    codeHelp.classList.add('hidden');

    if (!code) {
        foodCodeInput.classList.add('error');
        codeHelp.textContent = 'Please enter a food code.';
        codeHelp.classList.remove('hidden');
        return;
    }

    try {
        item = await createFoodItem(code);
    } catch (e) {
        codeHelp.textContent = 'Error: ' + e.message;
        codeHelp.classList.remove('hidden');
        foodCodeInput.value = '';
        return;
    }

    // If all checks pass, add the item
    let activeDay = localStorage.getItem('ActiveDay');
    let parsed = JSON.parse(localStorage.getItem(activeDay));
    if (!parsed) {
        console.log("Parsed day is null: " + activeDay);
    }
    let day = await Weekday.fromJSON(parsed);
    day.addFoodItem(item);
    localStorage.setItem(activeDay, JSON.stringify(day));

    // Clear the input field after successful addition
    foodCodeInput.value = '';
    foodCodeInput.classList.remove('error', 'success');
    codeHelp.classList.add('hidden');
}

async function updateFoodItems() {
    const activeDay = localStorage.getItem('ActiveDay');
    let parsed = JSON.parse(localStorage.getItem(activeDay));
    if (!parsed) {
        console.log("Parsed day is null: " + activeDay);
    }
    let day = await Weekday.fromJSON(parsed);

    const breakfastItems = document.getElementById(`${active}BreakfastItems`);
    const lunchItems = document.getElementById(`${active}LunchItems`);
    const dinnerItems = document.getElementById(`${active}DinnerItems`);
    const snackItems = document.getElementById(`${active}SnackItems`);

    breakfastItems.innerHTML = '';
    lunchItems.innerHTML = '';
    dinnerItems.innerHTML = '';
    snackItems.innerHTML = '';

    let buttonCount = 0;
    day.breakfast.forEach(item => {
        let trashButtonID = Constants.BREAKFAST + buttonCount++;
        const div = document.createElement('div');
        div.innerHTML = `
            <div class='breakfast-food-item'>${item.itemName}
                <button class='trash-button' id=${trashButtonID}>🗑︎</button>
            </div>
        `;
        breakfastItems.append(div);
    });
    buttonCount = 0;
    day.lunch.forEach(item => {
        let trashButtonID = Constants.LUNCH + buttonCount++;
        const div = document.createElement('div');
        div.innerHTML = `
            <div class='lunch-food-item'>${item.itemName}
                <button class='trash-button' id=${trashButtonID}>🗑︎</button>
            </div>
        `;
        lunchItems.append(div);
    });
    buttonCount = 0;
    day.dinner.forEach(item => {
        let trashButtonID = Constants.DINNER + buttonCount++;
        const div = document.createElement('div');
        div.innerHTML = `
            <div class='dinner-food-item'>${item.itemName}
                <button class='trash-button' id=${trashButtonID}>🗑︎</button>
            </div>
        `;
        dinnerItems.append(div);
    });
    buttonCount = 0;
    day.snacks.forEach(item => {
        let trashButtonID = Constants.SNACKS + buttonCount++;
        const div = document.createElement('div');
        div.innerHTML = `
            <div class='snacks-food-item'>${item.itemName}
                <button class='trash-button' id=${trashButtonID}>🗑︎</button>
            </div>
        `;
        snackItems.append(div);
    });

    localStorage.setItem(activeDay, JSON.stringify(day));
}

//Functions to Delete Items from Each Day
const monFoodItemsContainer = document.getElementById('monday');
const tuesFoodItemsContainer = document.getElementById('tuesday');
const wedFoodItemsContainer = document.getElementById('wednesday');
const thursFoodItemsContainer = document.getElementById('thursday');
const friFoodItemsContainer = document.getElementById('friday');

monFoodItemsContainer.addEventListener('click', async (e) => {
    if (e.target.classList.contains('trash-button')) {
        const name = e.target.id;
        await removeFoodItemDiv(name);
        await updateFoodItems();
    }
});

tuesFoodItemsContainer.addEventListener('click', async (e) => {
    if (e.target.classList.contains('trash-button')) {
        const name = e.target.id;
        await removeFoodItemDiv(name);
        await updateFoodItems();
    }
});

wedFoodItemsContainer.addEventListener('click', async (e) => {
    if (e.target.classList.contains('trash-button')) {
        const name = e.target.id;
        await removeFoodItemDiv(name);
        await updateFoodItems();
    }
});

thursFoodItemsContainer.addEventListener('click', async (e) => {
    if (e.target.classList.contains('trash-button')) {
        const name = e.target.id;
        await removeFoodItemDiv(name);
        await updateFoodItems();
    }
});

friFoodItemsContainer.addEventListener('click', async (e) => {
    if (e.target.classList.contains('trash-button')) {
        const name = e.target.id;
        await removeFoodItemDiv(name);
        await updateFoodItems();
    }
});

async function removeFoodItemDiv(name) {
    const target = document.getElementById(name);
    let meal = name[0];
    let id = name.slice(1);
    let activeDay = localStorage.getItem("ActiveDay");
    let parsed = JSON.parse(localStorage.getItem(activeDay));
    if (!parsed) {
        console.log("Parsed day is null: " + activeDay);
    }
    let day = await Weekday.fromJSON(parsed);
    await day.removeFoodItem(meal, id);
    localStorage.setItem(activeDay, JSON.stringify(day));
}

const deleteAllFoodItems = document.getElementById('clearAllFoodItems');

deleteAllFoodItems.addEventListener('click', async (e) => {
    if (e.target.id === "clearAllFoodItems") {
        await clearAllFoodItems();
        await updateFoodItems();
    }
});

async function clearAllFoodItems() {
    let activeDay = localStorage.getItem("ActiveDay");
    let day = new Weekday();
    localStorage.setItem(activeDay, JSON.stringify(day));
}

//Calendar Update Functions
async function updateBackgroundColor(day, dayTwo, dayThree, dayFour) {

    document.getElementById(day).style.backgroundColor = 'white';
    document.getElementById(dayTwo).style.backgroundColor = 'white';
    document.getElementById(dayThree).style.backgroundColor = 'white';
    document.getElementById(dayFour).style.backgroundColor = 'white';
}

async function resetBackgroundColor(mon, tues, wed, thur, fri) {
    document.getElementById(mon).style.backgroundColor = 'white';
    document.getElementById(tues).style.backgroundColor = 'white';
    document.getElementById(wed).style.backgroundColor = 'white';
    document.getElementById(thur).style.backgroundColor = 'white';
    document.getElementById(fri).style.backgroundColor = 'white';
}

//Modifying calendar based on active day
document.getElementById('monBtn').addEventListener("click", async function () { setActiveDay('M') })
document.getElementById('tuesBtn').addEventListener("click", async function () { setActiveDay('T') })
document.getElementById('wedBtn').addEventListener("click", async function () { setActiveDay('W') })
document.getElementById('thursBtn').addEventListener("click", async function () { setActiveDay('TH') })
document.getElementById('friBtn').addEventListener("click", async function () { setActiveDay('F') })