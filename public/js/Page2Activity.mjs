import { createFoodItem, DayGrade, Weekday, Constants } from "./common.mjs";

let active;
let refresh = true;

if (refresh) {
    await updateWeekFoodItems();
    refresh = false;
}


//Function to Select the Active Day
async function setActiveDay(day) {
    switch (day) {
        case 'M':
            localStorage.setItem("ActiveDay", 'Monday')
            localStorage.setItem("Active", 'mon')
            document.getElementById('monday').style.backgroundColor = 'lightgoldenrodyellow'
            document.getElementById('monBtn').classList.add('day-button-selected')
            updateBackgroundColor('tuesday', 'wednesday', 'thursday', 'friday')
            active = 'mon'
            break;
        case 'T':
            localStorage.setItem("ActiveDay", 'Tuesday')
            localStorage.setItem("Active", 'tues')
            document.getElementById('tuesday').style.backgroundColor = 'lightgoldenrodyellow'
            document.getElementById('tuesBtn').classList.add('day-button-selected')
            updateBackgroundColor('monday', 'wednesday', 'thursday', 'friday')
            active = 'tues'
            break;
        case 'W':
            localStorage.setItem("ActiveDay", 'Wednesday')
            localStorage.setItem("Active", 'wed')
            document.getElementById('wednesday').style.backgroundColor = 'lightgoldenrodyellow'
            document.getElementById('wedBtn').classList.add('day-button-selected')
            updateBackgroundColor('monday', 'tuesday', 'thursday', 'friday')
            active = 'wed'
            break;
        case 'TH':
            localStorage.setItem("ActiveDay", 'Thursday')
            localStorage.setItem("Active", 'thurs')
            document.getElementById('thursday').style.backgroundColor = 'lightgoldenrodyellow'
            document.getElementById('thursBtn').classList.add('day-button-selected')
            updateBackgroundColor('monday', 'tuesday', 'wednesday', 'friday')
            active = 'thurs'
            break;
        case 'F':
            localStorage.setItem("ActiveDay", 'Friday')
            localStorage.setItem("Active", 'fri')
            document.getElementById('friday').style.backgroundColor = 'lightgoldenrodyellow'
            document.getElementById('friBtn').classList.add('day-button-selected')
            updateBackgroundColor('monday', 'tuesday', 'wednesday', 'thursday')
            active = 'fri'
            break;
        default:
            resetBackgroundColor('monday', 'tuesday', 'wednesday', 'thursday', 'friday')
            localStorage.setItem("Active", 'mon')
            active = 'mon'
            break;
    }
}

//********Adding Food Items Buttons/Data Validation********/
let keyLastTime = performance.now();
let keyEntry = '';

const foodCodeInput = document.getElementById('foodCode');
const addFoodButton = document.getElementById('addFoodButton');

foodCodeInput.addEventListener('keydown', async function (e) {
    if (e.key === 'Enter') {
        await addFoodItem();
        await updateWeekFoodItems();
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
        foodCodeInput.focus({ preventScroll: true });
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

//********Function to Add Foot Item Using Food Reference Code********/
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

//********Function to Update Every Day of the Week********/
async function updateWeekFoodItems() {
    for (const weekDay of ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']) {
        let activ;
        switch (weekDay) {
            case 'Monday':
                activ = "mon";
                break;
            case 'Tuesday':
                activ = "tues";
                break;
            case 'Wednesday':
                activ = "wed";
                break;
            case 'Thursday':
                activ = "thurs";
                break;
            case 'Friday':
                activ = "fri";
                break;
        }

        let dayHelp = document.getElementById('dayHelp')
        dayHelp.classList.add('hidden');
        dayHelp.textContent = ''

        let parsed = JSON.parse(localStorage.getItem(weekDay));
        if (!parsed) {
            console.log("Parsed day is null: " + weekDay);
        }
        let day = await Weekday.fromJSON(parsed);

        const breakfastItems = document.getElementById(`${activ}BreakfastItems`);
        const lunchItems = document.getElementById(`${activ}LunchItems`);
        const dinnerItems = document.getElementById(`${activ}DinnerItems`);
        const snackItems = document.getElementById(`${activ}SnackItems`);

        breakfastItems.innerHTML = '';
        lunchItems.innerHTML = '';
        dinnerItems.innerHTML = '';
        snackItems.innerHTML = '';

        let buttonCount = 0;
        day.breakfast.forEach(item => {
            let trashButtonID = Constants.BREAKFAST + buttonCount++;
            const div = document.createElement('div');
            div.classList.add('breakfast-food-item')
            div.innerHTML = `
                        ${item.itemName}
                        <button class='trash-button' id=${trashButtonID}>🗑︎</button>`;
            breakfastItems.append(div);
        });
        buttonCount = 0;
        day.lunch.forEach(item => {
            let trashButtonID = Constants.LUNCH + buttonCount++;
            const div = document.createElement('div');
            div.classList.add('lunch-food-item')
            div.innerHTML = `
                    ${item.itemName}
                    <button class='trash-button' id=${trashButtonID}>🗑︎</button>`;
            lunchItems.append(div);
        });
        buttonCount = 0;
        day.dinner.forEach(item => {
            let trashButtonID = Constants.DINNER + buttonCount++;
            const div = document.createElement('div');
            div.classList.add('dinner-food-item')
            div.innerHTML = `
                    ${item.itemName}
                    <button class='trash-button' id=${trashButtonID}>🗑︎</button>`;
            dinnerItems.append(div);
        });
        buttonCount = 0;
        day.snacks.forEach(item => {
            let trashButtonID = Constants.SNACKS + buttonCount++;
            const div = document.createElement('div');
            div.classList.add('snacks-food-item')
            div.innerHTML = `
                    ${item.itemName}
                    <button class='trash-button' id=${trashButtonID}>🗑︎</button>`;
            snackItems.append(div);
        });
    }
}

//*********Function to Update Individual Day*********/
async function updateFoodItems() {
    const activeDay = localStorage.getItem('ActiveDay');
    const dayHelp = document.getElementById('dayHelp')
    dayHelp.classList.add('hidden')

    if (activeDay == null) {
        foodCodeInput.classList.add('error');
        dayHelp.textContent = 'Please select a day from the calendar below.'
        dayHelp.classList.remove('hidden');
        return;
    }
    else {
        dayHelp.classList.add('hidden');
        dayHelp.textContent = ''
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
            div.classList.add('breakfast-food-item')
            div.innerHTML = `
                        ${item.itemName}
                        <button class='trash-button' id=${trashButtonID}>🗑︎</button>`;
            breakfastItems.append(div);
        });
        buttonCount = 0;
        day.lunch.forEach(item => {
            let trashButtonID = Constants.LUNCH + buttonCount++;
            const div = document.createElement('div');
            div.classList.add('lunch-food-item')
            div.innerHTML = `
                    ${item.itemName}
                    <button class='trash-button' id=${trashButtonID}>🗑︎</button>`;
            lunchItems.append(div);
        });
        buttonCount = 0;
        day.dinner.forEach(item => {
            let trashButtonID = Constants.DINNER + buttonCount++;
            const div = document.createElement('div');
            div.classList.add('dinner-food-item')
            div.innerHTML = `
                    ${item.itemName}
                    <button class='trash-button' id=${trashButtonID}>🗑︎</button>`;
            dinnerItems.append(div);
        });
        buttonCount = 0;
        day.snacks.forEach(item => {
            let trashButtonID = Constants.SNACKS + buttonCount++;
            const div = document.createElement('div');
            div.classList.add('snacks-food-item')
            div.innerHTML = `
                    ${item.itemName}
                    <button class='trash-button' id=${trashButtonID}>🗑︎</button>`;
            snackItems.append(div);
        });

        localStorage.setItem(activeDay, JSON.stringify(day));
    }
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

//********Removing Data from Individual Day********
const deleteSingleFoodItems = document.getElementById('clearSingleFoodItems');

deleteSingleFoodItems.addEventListener('click', async (e) => {
    if (e.target.id === "clearSingleFoodItems") {
        await clearSingleDayFoodItems();
        await updateFoodItems();
    }
});

async function clearSingleDayFoodItems() {
    let activeDay = localStorage.getItem("ActiveDay");
    let day = new Weekday();
    localStorage.setItem(activeDay, JSON.stringify(day));
}

//********Clearing All Data for Every Day*********/
const clearAllPopUp = document.getElementById('clearAllPopUp')
const clearAllFoodItems = document.getElementById('clearAllFoodItems')
const confirmDeleteAll = document.getElementById('confirmDeleteBtn')
const cancelClear = document.getElementById('cancelBtn')

clearAllFoodItems.addEventListener('click', async (e) => {
    if (e.target.id === "clearAllFoodItems") {
        clearAllPopUp.style.display = 'flex'
        clearAllFoodItems.disabled = true
        deleteSingleFoodItems.disabled = true
        addFoodButton.disabled = true
        document.getElementById('gradeDayButton').disabled = true
    }
})

cancelClear.addEventListener('click', async (e) => {
    if (e.target.id === "cancelBtn") {
        clearAllPopUp.style.display = 'none'
        clearAllFoodItems.disabled = false
        deleteSingleFoodItems.disabled = false
        addFoodButton.disabled = false
        document.getElementById('gradeDayButton').disabled = false
    }
})

confirmDeleteAll.addEventListener('click', async (e) => {
    if (e.target.id === "confirmDeleteBtn") {
        clearAllPopUp.style.display = 'none'
        clearAllFoodItems.disabled = false
        deleteSingleFoodItems.disabled = false
        addFoodButton.disabled = false
        document.getElementById('gradeDayButton').disabled = false
        await deleteAllFoodItems()
        await updateWeekFoodItems()
    }
})

async function deleteAllFoodItems() {
    let days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

    days.forEach(item => {
        localStorage.setItem("ActiveDay", item)
        let day = new Weekday()
        localStorage.setItem(item, JSON.stringify(day))
    })
}

//Calendar Update Functions
async function updateBackgroundColor(day, dayTwo, dayThree, dayFour) {
    let days = [day, dayTwo, dayThree, dayFour];
    for (const day of days) {
        switch (day) {
            case 'monday':
                document.getElementById(day).style.backgroundColor = 'white';
                document.getElementById('monBtn').classList.remove('day-button-selected');
                break;
            case 'tuesday':
                document.getElementById(day).style.backgroundColor = 'white';
                document.getElementById('tuesBtn').classList.remove('day-button-selected');
                break;
            case 'wednesday':
                document.getElementById(day).style.backgroundColor = 'white';
                document.getElementById('wedBtn').classList.remove('day-button-selected');
                break;
            case 'thursday':
                document.getElementById(day).style.backgroundColor = 'white';
                document.getElementById('thursBtn').classList.remove('day-button-selected');
                break;
            case 'friday':
                document.getElementById(day).style.backgroundColor = 'white';
                document.getElementById('friBtn').classList.remove('day-button-selected');
                break;
        }
    }
}

async function resetBackgroundColor(mon, tues, wed, thur, fri) {
    let days = [mon, tues, wed, thur, fri];
    for (const day of days) {
        switch (day) {
            case 'monday':
                document.getElementById(day).style.backgroundColor = 'white';
                document.getElementById('monBtn').classList.remove('day-button-selected');
                break;
            case 'tuesday':
                document.getElementById(day).style.backgroundColor = 'white';
                document.getElementById('tuesBtn').classList.remove('day-button-selected');
                break;
            case 'wednesday':
                document.getElementById(day).style.backgroundColor = 'white';
                document.getElementById('wedBtn').classList.remove('day-button-selected');
                break;
            case 'thursday':
                document.getElementById(day).style.backgroundColor = 'white';
                document.getElementById('thursBtn').classList.remove('day-button-selected');
                break;
            case 'friday':
                document.getElementById(day).style.backgroundColor = 'white';
                document.getElementById('friBtn').classList.remove('day-button-selected');
                break;
        }
    }
}

//Modifying calendar based on active day
document.getElementById('monBtn').addEventListener("click", async function () { setActiveDay('M') });
document.getElementById('tuesBtn').addEventListener("click", async function () { setActiveDay('T') });
document.getElementById('wedBtn').addEventListener("click", async function () { setActiveDay('W') });
document.getElementById('thursBtn').addEventListener("click", async function () { setActiveDay('TH') });
document.getElementById('friBtn').addEventListener("click", async function () { setActiveDay('F') });


//*********Grade Day Container Slide Animations********/
document.getElementById('gradeDayBackButton').addEventListener('click', async function () {
    await animateBoxes();
})

document.getElementById('gradeDayButton').addEventListener('click', async function () {
    let activeDay = localStorage.getItem('ActiveDay');
    let parsed = JSON.parse(localStorage.getItem(activeDay));
    if (!parsed) {
        console.log("Parsed day is null: " + activeDay);
    }
    let day = await Weekday.fromJSON(parsed);

    animateBoxes();

    document.getElementById('gradeButtonID').innerHTML = activeDay;

    const gradeBreakfastItems = document.getElementById('gradeBreakfastItems');
    const gradeLunchItems = document.getElementById('gradeLunchItems');
    const gradeDinnerItems = document.getElementById('gradeDinnerItems');
    const gradeSnackItems = document.getElementById('gradeSnackItems');

    gradeBreakfastItems.innerHTML = '';
    gradeLunchItems.innerHTML = '';
    gradeDinnerItems.innerHTML = '';
    gradeSnackItems.innerHTML = '';

    day.breakfast.forEach(item => {
        const div = document.createElement('div');
        div.classList.add('breakfast-food-item')
        div.innerHTML = `
                    ${item.itemName}`;
        gradeBreakfastItems.append(div);
    });
    day.lunch.forEach(item => {
        const div = document.createElement('div');
        div.classList.add('lunch-food-item')
        div.innerHTML = `
                ${item.itemName}`;
        gradeLunchItems.append(div);
    });
    day.dinner.forEach(item => {
        const div = document.createElement('div');
        div.classList.add('dinner-food-item')
        div.innerHTML = `
                ${item.itemName}`;
        gradeDinnerItems.append(div);
    });
    day.snacks.forEach(item => {
        const div = document.createElement('div');
        div.classList.add('snacks-food-item')
        div.innerHTML = `
                ${item.itemName}`;
        gradeSnackItems.append(div);
    });

    let grade = new DayGrade(day);
    grade.fillHTML();
})

let animations = [];

async function animateBoxes() {
    let gradeBox = document.getElementById('dayToGrade');
    let calBox = document.getElementById('calendar');
    if (animations.length == 0) {
        animations.push(gradeBox.animate([
            { transform: "scaleX(0)", transformOrigin: "right" },
            { transform: "scaleX(1)", transformOrigin: "right" }
        ], {
            duration: 600,
            easing: "ease-in-out",
            fill: "forwards"
        }));
        animations.push(calBox.animate([
            { transform: "scaleX(1)", transformOrigin: "left" },
            { transform: "scaleX(0)", transformOrigin: "left" }
        ], {
            duration: 600,
            easing: "ease-in-out",
            fill: "forwards"
        }));
    } else {
        animations.forEach(animation => animation.reverse());
        animations = [];
    }
}