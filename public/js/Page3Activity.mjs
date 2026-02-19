import { createFoodItem, FoodItem, Weekday, Constants } from "./common.mjs";

let active;

window.addEventListener("load", function () {
    console.log("function worked")
})


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
            /*const tuesday = document.getElementById('tuesday')
            const tuesHead = document.getElementById('tuesHead')
            tuesday.style.backgroundColor = 'lightgoldenrodyellow'
            tuesday.style.transform = "translateX(-100%)"
            tuesHead.style.transform = "translateX(-100%)"*/
            updateBackgroundColor('monday', 'wednesday', 'thursday', 'friday')
            active = 'tues'
            break;
        case 'W':
            localStorage.setItem("ActiveDay", 'Wednesday')
            document.getElementById('wednesday').style.backgroundColor = 'lightgoldenrodyellow'
            /*const wednesday = document.getElementById('wednesday')
            const wedHead = document.getElementById('wedHead')
            wednesday.style.backgroundColor = 'lightgoldenrodyellow'
            wednesday.style.transform = "translateX(-200%)"
            wedHead.style.transform = "translateX(-200%)"*/
            updateBackgroundColor('monday', 'tuesday', 'thursday', 'friday')
            active = 'wed'
            break;
        case 'TH':
            localStorage.setItem("ActiveDay", 'Thursday')
            document.getElementById('thursday').style.backgroundColor = 'lightgoldenrodyellow'
            /*const thursday = document.getElementById('thursday')
            const thursHead = document.getElementById('thursHead')
            thursday.style.backgroundColor = 'lightgoldenrodyellow'
            thursday.style.transform = 'translateX(-300%)'
            thursHead.style.transform = 'translateX(-300%)'*/
            updateBackgroundColor('monday', 'tuesday', 'wednesday', 'friday')
            active = 'thurs'
            break;
        case 'F':
            localStorage.setItem("ActiveDay", 'Friday')
            document.getElementById('friday').style.backgroundColor = 'lightgoldenrodyellow'
            /*const friday = document.getElementById('friday')
            const friHead = document.getElementById('friHead')
            friday.style.backgroundColor = 'lightgoldenrodyellow'
            friday.style.transform = 'translateX(-400%)'
            friHead.style.transform = 'translateX(-400%)'*/
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


const button1 = document.getElementById('testButton1');
button1.addEventListener('click', async function () {
    testFunction1();
});

const button2 = document.getElementById('testButton2');
button2.addEventListener('click', async function () {
    testFunction2();
});

async function testFunction1() {
    document.getElementById('calendar').style.display = 'none';
    let activeDay = localStorage.getItem('ActiveDay');
    let parsed = JSON.parse(localStorage.getItem(activeDay));
    if (!parsed) {
        console.log("Parsed day is null: " + activeDay);
    }
    let day = await Weekday.fromJSON(parsed);

    const dayToGrade = document.getElementById('dayToGrade');
    dayToGrade.style.display = 'block';

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

    new DayGrade(day);
}

async function testFunction2() {
    document.getElementById('calendar').style.display = 'block';
    document.getElementById('dayToGrade').style.display = 'none';
}

class DayGrade {
    // Constants used in class
    static MAX_SCORE = 100;

    // Indices for arrays
    static SCORE = 0;
    static AMOUNTS = 1
    static COMMENTS = 2;

    constructor(day) {
        let score = Array.from({ length: 3 }, () => new Array(10).fill(0));
        score[DayGrade.COMMENTS] = new Array(10).fill('Default Comment');

        this.accumulateTotals(day, score);
        for (let i = 0; i < 10; i++) {
            score[DayGrade.SCORE][i] = this.basicGradeRubric(i, score[DayGrade.AMOUNTS][i], score);
        }

        let totalScore = 0;
        for (let i = 0; i < 10; i++) {
            totalScore += score[DayGrade.SCORE][i];
        }
        score[DayGrade.SCORE][Constants.SCOREAVG] = totalScore / 10;

        console.log("Caluclated category points:")
        console.log("Calories: " + score[DayGrade.SCORE][Constants.CALORIES]);
        console.log("Total Fats: " + score[DayGrade.SCORE][Constants.TOTALFAT]);
        console.log("TFat: " + score[DayGrade.SCORE][Constants.TRANSFAT]);
        console.log("SFat: " + score[DayGrade.SCORE][Constants.SATFAT]);
        console.log("Chol: " + score[DayGrade.SCORE][Constants.CHOLESTEROL]);
        console.log("Sod: " + score[DayGrade.SCORE][Constants.SODIUM]);
        console.log("Car: " + score[DayGrade.SCORE][Constants.CARBS]);
        console.log("Fib: " + score[DayGrade.SCORE][Constants.FIBER]);
        console.log("Sug: " + score[DayGrade.SCORE][Constants.SUGAR]);
        console.log("Pro: " + score[DayGrade.SCORE][Constants.PROTEIN]);

        let caloriesCom = document.getElementById('caloriesComments');
        let caloriesCard = document.getElementById('totalCalories');
        caloriesCom.innerHTML = score[DayGrade.COMMENTS][Constants.CALORIES];
        caloriesCard.innerHTML = Math.round(score[DayGrade.AMOUNTS][Constants.CALORIES]);
        let fatsCom = document.getElementById('fatsComments');
        let fatsCard = document.getElementById('totalFats');
        fatsCom.innerHTML = score[DayGrade.COMMENTS][Constants.TOTALFAT];
        fatsCard.innerHTML = Math.round(score[DayGrade.AMOUNTS][Constants.TOTALFAT]);
        let cholesterolCom = document.getElementById('cholesterolComments');
        let cholesterolCard = document.getElementById('totalCholesterol');
        cholesterolCom.innerHTML = score[DayGrade.COMMENTS][Constants.CHOLESTEROL];
        cholesterolCard.innerHTML = Math.round(score[DayGrade.AMOUNTS][Constants.CHOLESTEROL]);
        let sodiumCom = document.getElementById('sodiumComments');
        let sodiumCard = document.getElementById('totalSodium');
        sodiumCom.innerHTML = score[DayGrade.COMMENTS][Constants.SODIUM];
        sodiumCard.innerHTML = Math.round(score[DayGrade.AMOUNTS][Constants.SODIUM]);
        let carbsCom = document.getElementById('carbsComments');
        let carbsCard = document.getElementById('totalCarbs');
        carbsCom.innerHTML = score[DayGrade.COMMENTS][Constants.CARBS];
        carbsCard.innerHTML = Math.round(score[DayGrade.AMOUNTS][Constants.CARBS]);
        let fiberCom = document.getElementById('fiberComments');
        let fiberCard = document.getElementById('totalFiber');
        fiberCom.innerHTML = score[DayGrade.COMMENTS][Constants.FIBER];
        fiberCard.innerHTML = Math.round(score[DayGrade.AMOUNTS][Constants.FIBER]);
        let sugarsCom = document.getElementById('sugarsComments');
        let sugarsCard = document.getElementById('totalSugars');
        sugarsCom.innerHTML = score[DayGrade.COMMENTS][Constants.SUGAR];
        sugarsCard.innerHTML = Math.round(score[DayGrade.AMOUNTS][Constants.SUGAR]);
        let proteinCom = document.getElementById('proteinComments');
        let proteinCard = document.getElementById('totalProtein');
        proteinCom.innerHTML = score[DayGrade.COMMENTS][Constants.PROTEIN];
        proteinCard.innerHTML = Math.round(score[DayGrade.AMOUNTS][Constants.PROTEIN]);

        let totalGradeCircle = document.getElementById('pointsCircle');
        if (score[DayGrade.SCORE][Constants.SCOREAVG] > 90) {
            totalGradeCircle.innerHTML = 'A';
        } else if (score[DayGrade.SCORE][Constants.SCOREAVG] > 80) {
            totalGradeCircle.innerHTML = 'B';
        } else if (score[DayGrade.SCORE][Constants.SCOREAVG] > 70) {
            totalGradeCircle.innerHTML = 'C';
        } else if (score[DayGrade.SCORE][Constants.SCOREAVG] > 60) {
            totalGradeCircle.innerHTML = 'D';
        } else {
            totalGradeCircle.innerHTML = 'F';
        }

        let underGradeCircle = document.getElementById('underPointCircle');
        underGradeCircle.innerHTML = "Your Grade: " + Math.round(score[DayGrade.SCORE][Constants.SCOREAVG]);
    }

    accumulateTotals(day, score) {
        let dayTotal = new Array(10).fill(0);
        for (const mealType of [Constants.BREAKFAST, Constants.LUNCH, Constants.DINNER, Constants.SNACKS]) {
            for (const foodItem of day.getMealItems(mealType) ?? []) {
                dayTotal[Constants.CALORIES] += foodItem.calories;
                dayTotal[Constants.TOTALFAT] += foodItem.totalFatG;
                dayTotal[Constants.SATFAT] += foodItem.satFatG;
                dayTotal[Constants.TRANSFAT] += foodItem.transFatG;
                dayTotal[Constants.CHOLESTEROL] += foodItem.cholesterolMG;
                dayTotal[Constants.SODIUM] += foodItem.sodiumMG;
                dayTotal[Constants.CARBS] += foodItem.carbsG;
                dayTotal[Constants.FIBER] += foodItem.fiberG;
                dayTotal[Constants.SUGAR] += foodItem.sugarsG;
                dayTotal[Constants.PROTEIN] += foodItem.proteinG;
            }
        }
        score[DayGrade.AMOUNTS] = dayTotal
    }

    basicGradeRubric(type, value, score) {
        switch (type) {
            case Constants.CALORIES:
                if (value > 4000) {
                    score[DayGrade.COMMENTS][Constants.CALORIES] = "Way too many calories!";
                    return 0;
                }
                if (value > 2500) {
                    score[DayGrade.COMMENTS][Constants.CALORIES] = "Could use less calories.";
                    return this.normalize(4000, 2500, value);
                }
                if (value > 1500) {
                    score[DayGrade.COMMENTS][Constants.CALORIES] = "Good job! You are around the ideal calorie count.";
                    return DayGrade.MAX_SCORE;
                }
                if (value > 1000) {
                    score[DayGrade.COMMENTS][Constants.CALORIES] = "Not enough calories, you need a little more to stay healty.";
                    return this.normalize(1000, 1500, value);
                }
                score[DayGrade.COMMENTS][Constants.CALORIES] = "You don't have nearly enough calories, you will starve!";
                return 0;
            case Constants.TOTALFAT:
                if (value > 100) {
                    score[DayGrade.COMMENTS][Constants.TOTALFAT] = "Way too many fats!";
                    return 0;
                }
                if (value > 50) {
                    score[DayGrade.COMMENTS][Constants.TOTALFAT] = "Could use fewer fats.";
                    return this.normalize(100, 50, value);
                }
                if (value > 25) {
                    score[DayGrade.COMMENTS][Constants.TOTALFAT] = "Good amount of fats.";
                    return DayGrade.MAX_SCORE;
                }
                if (value > 0) {
                    score[DayGrade.COMMENTS][Constants.TOTALFAT] = "Could use a little more fats!";
                    return this.normalize(0, 25, value);
                }
                score[DayGrade.COMMENTS][Constants.TOTALFAT] = "You need more fats!";
                return 0;
            case Constants.SATFAT:
                if (value > 40) {
                    return 0;
                }
                if (value > 20) {
                    return 0.75 * this.normalize(40, 20, value);
                }
                if (value > 10) {
                    return 0.75 * DayGrade.MAX_SCORE + 0.25 * this.normalize(20, 10, value);
                }
                return DayGrade.MAX_SCORE;
            case Constants.TRANSFAT:
                if (value > 5) {
                    score[DayGrade.COMMENTS][Constants.TOTALFAT] = score[DayGrade.COMMENTS][Constants.TOTALFAT] + " Also way too much transfat!";
                    return 0;
                }
                if (value > 0) {
                    score[DayGrade.COMMENTS][Constants.TOTALFAT] = score[DayGrade.COMMENTS][Constants.TOTALFAT] + " Also could use less transfat!";
                    return this.normalize(5, 0, value);
                }
                return DayGrade.MAX_SCORE;
            case Constants.CHOLESTEROL:
                if (value > 500) {
                    score[DayGrade.COMMENTS][Constants.CHOLESTEROL] = "Way too much cholesterol!";
                    return 0;
                }
                if (value > 200) {
                    score[DayGrade.COMMENTS][Constants.CHOLESTEROL] = "Could use less cholesterol.";
                    return 0.75 * this.normalize(500, 200, value);
                }
                if (value > 0) {
                    score[DayGrade.COMMENTS][Constants.CHOLESTEROL] = "Good amount of cholesterol.";
                    return 0.75 * DayGrade.MAX_SCORE + 0.25 * this.normalize(200, 0, value);
                }
                score[DayGrade.COMMENTS][Constants.CHOLESTEROL] = "Good job keeping cholesterol low!";
                return DayGrade.MAX_SCORE;
            case Constants.SODIUM:
                if (value > 4000) {
                    score[DayGrade.COMMENTS][Constants.SODIUM] = "Way too much sodium!";
                    return 0;
                }
                if (value > 2300) {
                    score[DayGrade.COMMENTS][Constants.SODIUM] = "Could use less sodium.";
                    return 0.9 * this.normalize(4000, 2300, value);
                }
                if (value > 1500) {
                    score[DayGrade.COMMENTS][Constants.SODIUM] = "Good amount of sodium.";
                    return 0.9 * DayGrade.MAX_SCORE + 0.1 * this.normalize(2300, 1500, value);
                }
                if (value > 500) {
                    score[DayGrade.COMMENTS][Constants.SODIUM] = "Great job keeping sodium amount low!";
                    return DayGrade.MAX_SCORE;
                }
                if (value > 0) {
                    score[DayGrade.COMMENTS][Constants.SODIUM] = "Could use a little more sodium.";
                    return this.normalize(0, 500, value);
                }
                score[DayGrade.COMMENTS][Constants.SODIUM] = "Way too little sodium! Sodium is required for your body to function.";
                return 0;
            case Constants.CARBS:
                if (value > 500) {
                    score[DayGrade.COMMENTS][Constants.CARBS] = "Way too many carbs!";
                    return 0;
                }
                if (value > 275) {
                    score[DayGrade.COMMENTS][Constants.CARBS] = "Could use less carbs.";
                    return this.normalize(500, 275, value);
                }
                if (value > 200) {
                    score[DayGrade.COMMENTS][Constants.CARBS] = "Good amount of carbs!";
                    return DayGrade.MAX_SCORE;
                }
                if (value > 150) {
                    score[DayGrade.COMMENTS][Constants.CARBS] = "Could use a few more carbs.";
                    return 0.5 * DayGrade.MAX_SCORE + 0.5 * this.normalize(150, 200, value);
                }
                if (value > 50) {
                    score[DayGrade.COMMENTS][Constants.CARBS] = "Need more carbs.";
                    return 0.5 * this.normalize(50, 150, value);
                }
                score[DayGrade.COMMENTS][Constants.CARBS] = "Need way more carbs, carbs are necessary for your diet!";
                return 0;
            case Constants.FIBER:
                if (value > 100) {
                    score[DayGrade.COMMENTS][Constants.FIBER] = "Way too much fiber!";
                    return 0;
                }
                if (value > 38) {
                    score[DayGrade.COMMENTS][Constants.FIBER] = "Too much fiber, get a little less.";
                    return this.normalize(100, 38, value);
                }
                if (value > 28) {
                    score[DayGrade.COMMENTS][Constants.FIBER] = "Perfect amount of fiber!";
                    return DayGrade.MAX_SCORE;
                }
                if (value > 0) {
                    score[DayGrade.COMMENTS][Constants.FIBER] = "Need some more fiber.";
                    return this.normalize(0, 28, value);
                }
                score[DayGrade.COMMENTS][Constants.FIBER] = "Not nearly enough fiber!";
                return 0;
            case Constants.SUGAR:
                if (value > 100) {
                    score[DayGrade.COMMENTS][Constants.SUGAR] = "Way too much sugar!";
                    return 0;
                }
                if (value > 50) {
                    score[DayGrade.COMMENTS][Constants.SUGAR] = "Too much sugar.";
                    return 0.5 * this.normalize(100, 50, value);
                }
                if (value > 30) {
                    score[DayGrade.COMMENTS][Constants.SUGAR] = "A little too much sugar!";
                    return 0.5 * DayGrade.MAX_SCORE + 0.5 * this.normalize(50, 30, value);
                }
                score[DayGrade.COMMENTS][Constants.SUGAR] = "Good job keeping sugar low!";
                return DayGrade.MAX_SCORE;
            case Constants.PROTEIN:
                if (value > 150) {
                    score[DayGrade.COMMENTS][Constants.PROTEIN] = "That is a ton of protein, are you a body builder?!";
                    return 0.5 * DayGrade.MAX_SCORE;
                }
                if (value > 75) {
                    score[DayGrade.COMMENTS][Constants.PROTEIN] = "That is a lot of protein, are you an athelete?";
                    return 0.5 * DayGrade.MAX_SCORE + 0.5 * this.normalize(150, 75, value);
                }
                if (value > 50) {
                    score[DayGrade.COMMENTS][Constants.PROTEIN] = "Perfect amount of protein!";
                    return DayGrade.MAX_SCORE;
                }
                if (value > 20) {
                    score[DayGrade.COMMENTS][Constants.PROTEIN] = "That is not enough protein, add some more.";
                    return this.normalize(20, 50, value);
                }
                score[DayGrade.COMMENTS][Constants.PROTEIN] = "That is not nearly enough protein, add some more!";
                return 0;
        }
    }

    // This is used to interpolate between values for scoring 
    // Bottom = 0, top = 1
    normalize(bottom, top, value) {
        return ((value - bottom) / (top - bottom)) * DayGrade.MAX_SCORE;
    }
}