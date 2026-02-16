import { createFoodItem, Constants, FoodItem, Weekday } from "./common.mjs";

const gradeButton = document.getElementById("getGradeButton");
gradeButton.addEventListener('click', async (e) => {
    gradeButton.style.visibility = 'hidden';

    let parsedMon = JSON.parse(localStorage.getItem('Monday'));
    if (!parsedMon) console.log("Parsed day is null: Monday");
    let mon = await Weekday.fromJSON(parsedMon);
    let parsedTues = JSON.parse(localStorage.getItem('Tuesday'));
    if (!parsedTues) console.log("Parsed day is null: Tuesday");
    let tues = await Weekday.fromJSON(parsedTues);
    let parsedWed = JSON.parse(localStorage.getItem('Wednesday'));
    if (!parsedWed) console.log("Parsed day is null: Wednesday");
    let wed = await Weekday.fromJSON(parsedWed);
    let parsedThur = JSON.parse(localStorage.getItem('Thursday'));
    if (!parsedThur) console.log("Parsed day is null: Thursday");
    let thur = await Weekday.fromJSON(parsedThur);
    let parsedFri = JSON.parse(localStorage.getItem('Friday'));
    if (!parsedFri) console.log("Parsed day is null: Friday");
    let fri = await Weekday.fromJSON(parsedFri);
})

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

        totalAmounts = 0;
        for (let i = 0; i < 10; i++) {
            totalAmounts += score[DayGrade.SCORE][i];
        }
        score[DayGrade.SCORE][Constants.SCOREAVG] = totalAmounts / 10;

        let activeDay = localStorage.getItem('ActiveDay');
        let dayPrefix = '';
        switch(activeDay) {
            case 'Monday':
                dayPrefix = '';
                break;
            case 'Tuesday':
                dayPrefix = '';
                break;
            case 'Wednesday':
                dayPrefix = '';
                break;
            case 'Thursday':
                dayPrefix = '';
                break;
            case 'Friday':
                dayPrefix = '';
                break;
            default: 
                throw console.error("Day prefix not able to be determined!");
        }

        let caloriesCom = document.getElementById(dayPrefix + 'CaloriesComments');
        let caloriesCard = document.getElementById(dayPrefix + 'TotalCalories');
        caloriesCom.innerHTML = score[DayGrade.COMMENTS][Constants.CALORIES];
        caloriesCard.innerHTML = Math.round(score[DayGrade.AMOUNTS][Constants.CALORIES]);
        let fatsCom = document.getElementById(dayPrefix + 'FatsComments');
        let fatsCard = document.getElementById(dayPrefix + 'TotalFats');
        fatsCom.innerHTML = score[DayGrade.COMMENTS][Constants.TOTALFAT];
        fatsCard.innerHTML = Math.round(score[DayGrade.AMOUNTS][Constants.TOTALFAT]);
        let cholesterolCom = document.getElementById(dayPrefix + 'CholesterolComments');
        let cholesterolCard = document.getElementById(dayPrefix + 'TotalCholesterol');
        cholesterolCom.innerHTML = score[DayGrade.COMMENTS][Constants.CHOLESTEROL];
        cholesterolCard.innerHTML = Math.round(score[DayGrade.AMOUNTS][Constants.CHOLESTEROL]);
        let sodiumCom = document.getElementById(dayPrefix + 'SodiumComments');
        let sodiumCard = document.getElementById(dayPrefix + 'TotalSodium');
        sodiumCom.innerHTML = score[DayGrade.COMMENTS][Constants.SODIUM];
        sodiumCard.innerHTML = Math.round(score[DayGrade.AMOUNTS][Constants.SODIUM]);
        let carbsCom = document.getElementById(dayPrefix + 'CarbsComments');
        let carbsCard = document.getElementById(dayPrefix + 'TotalCarbs');
        carbsCom.innerHTML = score[DayGrade.COMMENTS][Constants.CARBS];
        carbsCard.innerHTML = Math.round(score[DayGrade.AMOUNTS][Constants.CARBS]);
        let fiberCom = document.getElementById(dayPrefix + 'FiberComments');
        let fiberCard = document.getElementById(dayPrefix + 'TotalFiber');
        fiberCom.innerHTML = score[DayGrade.COMMENTS][Constants.FIBER];
        fiberCard.innerHTML = Math.round(score[DayGrade.AMOUNTS][Constants.FIBER]);
        let sugarsCom = document.getElementById(dayPrefix + 'SugarsComments');
        let sugarsCard = document.getElementById(dayPrefix + 'TotalSugars');
        sugarsCom.innerHTML = score[DayGrade.COMMENTS][Constants.SUGAR];
        sugarsCard.innerHTML = Math.round(score[DayGrade.AMOUNTS][Constants.SUGAR]);
        let proteinCom = document.getElementById(dayPrefix + 'ProteinComments');
        let proteinCard = document.getElementById(dayPrefix + 'TotalProtein');
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
                    return 0.75 + 0.25 * this.normalize(20, 10, value);
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
                    return 0.75 + 0.25 * this.normalize(200, 0, value);
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
                    return 0.9 + 0.1 * this.normalize(2300, 1500, value);
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
                    return 0.5 + 0.5 * this.normalize(150, 200, value);
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
                    return 0.5 + 0.5 * this.normalize(50, 30, value);
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
                    return 0.5 + 0.5 * this.normalize(150, 75, value);
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