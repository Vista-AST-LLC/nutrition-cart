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

    let report = new ReportCard();

    report.addDays([mon, tues, wed, thur, fri]);

    await report.basicGradeAll();

    let totalGradeCircle = document.getElementById('pointsCircle');
    let totalGrade = (
        report.score[ReportCard.SCORE][Constants.CALORIES]
        + report.score[ReportCard.SCORE][Constants.TOTALFAT]
        + report.score[ReportCard.SCORE][Constants.SATFAT]
        + report.score[ReportCard.SCORE][Constants.TRANSFAT]
        + report.score[ReportCard.SCORE][Constants.CHOLESTEROL]
        + report.score[ReportCard.SCORE][Constants.SODIUM]
        + report.score[ReportCard.SCORE][Constants.CARBS]
        + report.score[ReportCard.SCORE][Constants.FIBER]
        + report.score[ReportCard.SCORE][Constants.SUGAR]
        + report.score[ReportCard.SCORE][Constants.PROTEIN])
        / 10;
    if (totalGrade > 90) {
        totalGradeCircle.innerHTML = 'A';
    } else if (totalGrade > 80) {
        totalGradeCircle.innerHTML = 'B';
    } else if (totalGrade > 70) {
        totalGradeCircle.innerHTML = 'C';
    } else if (totalGrade > 60) {
        totalGradeCircle.innerHTML = 'D';
    } else {
        totalGradeCircle.innerHTML = 'F';
    }

    let underGradeCircle = document.getElementById('underPointCircle');
    underGradeCircle.innerHTML = "Your Grade: " + Math.round(totalGrade);

    let caloriesCom = document.getElementById('caloriesComments');
    let caloriesCard = document.getElementById('totalCalories');
    caloriesCom.innerHTML = report.score[ReportCard.COMMENTS][Constants.CALORIES];
    caloriesCard.innerHTML = Math.round(report.score[ReportCard.AMOUNTS][Constants.CALORIES]);
    let fatsCom = document.getElementById('fatsComments');
    let fatsCard = document.getElementById('totalFats');
    fatsCom.innerHTML = report.score[ReportCard.COMMENTS][Constants.TOTALFAT];
    fatsCard.innerHTML = Math.round(report.score[ReportCard.AMOUNTS][Constants.TOTALFAT]);
    let cholesterolCom = document.getElementById('cholesterolComments');
    let cholesterolCard = document.getElementById('totalCholesterol');
    cholesterolCom.innerHTML = report.score[ReportCard.COMMENTS][Constants.CHOLESTEROL];
    cholesterolCard.innerHTML = Math.round(report.score[ReportCard.AMOUNTS][Constants.CHOLESTEROL]);
    let sodiumCom = document.getElementById('sodiumComments');
    let sodiumCard = document.getElementById('totalSodium');
    sodiumCom.innerHTML = report.score[ReportCard.COMMENTS][Constants.SODIUM];
    sodiumCard.innerHTML = Math.round(report.score[ReportCard.AMOUNTS][Constants.SODIUM]);
    let carbsCom = document.getElementById('carbsComments');
    let carbsCard = document.getElementById('totalCarbs');
    carbsCom.innerHTML = report.score[ReportCard.COMMENTS][Constants.CARBS];
    carbsCard.innerHTML = Math.round(report.score[ReportCard.AMOUNTS][Constants.CARBS]);
    let fiberCom = document.getElementById('fiberComments');
    let fiberCard = document.getElementById('totalFiber');
    fiberCom.innerHTML = report.score[ReportCard.COMMENTS][Constants.FIBER];
    fiberCard.innerHTML = Math.round(report.score[ReportCard.AMOUNTS][Constants.FIBER]);
    let sugarsCom = document.getElementById('sugarsComments');
    let sugarsCard = document.getElementById('totalSugars');
    sugarsCom.innerHTML = report.score[ReportCard.COMMENTS][Constants.SUGAR];
    sugarsCard.innerHTML = Math.round(report.score[ReportCard.AMOUNTS][Constants.SUGAR]);
    let proteinCom = document.getElementById('proteinComments');
    let proteinCard = document.getElementById('totalProtein');
    proteinCom.innerHTML = report.score[ReportCard.COMMENTS][Constants.PROTEIN];
    proteinCard.innerHTML = Math.round(report.score[ReportCard.AMOUNTS][Constants.PROTEIN]);
})

class ReportCard {
    // Constants used in class
    static MAX_SCORE = 100;

    // Indices for internal arrays
    static SCORE = 0;
    static AMOUNTS = 1;
    static COMMENTS = 2;

    constructor() {
        this.resetScore();
        this.days = [];
    }

    resetScore() {
        this.score = Array.from({ length: 3 }, () => new Array(10).fill(0));
        this.score[ReportCard.COMMENTS] = new Array(10).fill('Default Comment');
    }

    // This is used to interpolate between values for scoring 
    // Bottom = 0, top = 1
    normalize(bottom, top, value) {
        return ((value - bottom) / (top - bottom)) * ReportCard.MAX_SCORE;
    }

    // Add days to the ReportCard, handles individual days and an array of days
    addDays(daysToAdd) {
        if (Array.isArray(daysToAdd)) {
            while (daysToAdd.length > 0) {
                this.days.push(daysToAdd.pop());
            }
        } else {
            this.days.push(daysToAdd);
        }
    }

    async basicGradeAll() {
        this.resetScore();
        let daysAmount = this.days.length;
        while (this.days.length > 0) {
            let dayTotal = this.accumulateTotals(this.days.pop());
            this.score[ReportCard.SCORE][Constants.CALORIES] += this.basicGradeRubric(Constants.CALORIES, dayTotal[Constants.CALORIES]);
            this.score[ReportCard.AMOUNTS][Constants.CALORIES] += dayTotal[Constants.CALORIES];
            this.score[ReportCard.SCORE][Constants.TOTALFAT] += this.basicGradeRubric(Constants.TOTALFAT, dayTotal[Constants.TOTALFAT]);
            this.score[ReportCard.AMOUNTS][Constants.TOTALFAT] += dayTotal[Constants.TOTALFAT];
            this.score[ReportCard.SCORE][Constants.SATFAT] += this.basicGradeRubric(Constants.SATFAT, dayTotal[Constants.SATFAT]);
            this.score[ReportCard.AMOUNTS][Constants.SATFAT] += dayTotal[Constants.SATFAT];
            this.score[ReportCard.SCORE][Constants.TRANSFAT] += this.basicGradeRubric(Constants.TRANSFAT, dayTotal[Constants.TRANSFAT]);
            this.score[ReportCard.AMOUNTS][Constants.TRANSFAT] += dayTotal[Constants.TRANSFAT];
            this.score[ReportCard.SCORE][Constants.CHOLESTEROL] += this.basicGradeRubric(Constants.CHOLESTEROL, dayTotal[Constants.CHOLESTEROL]);
            this.score[ReportCard.AMOUNTS][Constants.CHOLESTEROL] += dayTotal[Constants.CHOLESTEROL];
            this.score[ReportCard.SCORE][Constants.SODIUM] += this.basicGradeRubric(Constants.SODIUM, dayTotal[Constants.SODIUM]);
            this.score[ReportCard.AMOUNTS][Constants.SODIUM] += dayTotal[Constants.SODIUM];
            this.score[ReportCard.SCORE][Constants.CARBS] += this.basicGradeRubric(Constants.CARBS, dayTotal[Constants.CARBS]);
            this.score[ReportCard.AMOUNTS][Constants.CARBS] += dayTotal[Constants.CARBS];
            this.score[ReportCard.SCORE][Constants.FIBER] += this.basicGradeRubric(Constants.FIBER, dayTotal[Constants.FIBER]);
            this.score[ReportCard.AMOUNTS][Constants.FIBER] += dayTotal[Constants.FIBER];
            this.score[ReportCard.SCORE][Constants.SUGAR] += this.basicGradeRubric(Constants.SUGAR, dayTotal[Constants.SUGAR]);
            this.score[ReportCard.AMOUNTS][Constants.SUGAR] += dayTotal[Constants.SUGAR];
            this.score[ReportCard.SCORE][Constants.PROTEIN] += this.basicGradeRubric(Constants.PROTEIN, dayTotal[Constants.PROTEIN]);
            this.score[ReportCard.AMOUNTS][Constants.PROTEIN] += dayTotal[Constants.PROTEIN];
        }
        this.score[ReportCard.SCORE][Constants.CALORIES] /= daysAmount;
        this.basicGradeRubricComments(Constants.CALORIES, (this.score[ReportCard.AMOUNTS][Constants.CALORIES] /= daysAmount));
        this.score[ReportCard.SCORE][Constants.TOTALFAT] /= daysAmount;
        this.basicGradeRubricComments(Constants.TOTALFAT, (this.score[ReportCard.AMOUNTS][Constants.TOTALFAT] /= daysAmount));
        this.score[ReportCard.SCORE][Constants.SATFAT] /= daysAmount;
        this.basicGradeRubricComments(Constants.SATFAT, (this.score[ReportCard.AMOUNTS][Constants.SATFAT] /= daysAmount));
        this.score[ReportCard.SCORE][Constants.TRANSFAT] /= daysAmount;
        this.basicGradeRubricComments(Constants.TRANSFAT, (this.score[ReportCard.AMOUNTS][Constants.TRANSFAT] /= daysAmount));
        this.score[ReportCard.SCORE][Constants.CHOLESTEROL] /= daysAmount;
        this.basicGradeRubricComments(Constants.CHOLESTEROL, (this.score[ReportCard.AMOUNTS][Constants.CHOLESTEROL] /= daysAmount));
        this.score[ReportCard.SCORE][Constants.SODIUM] /= daysAmount;
        this.basicGradeRubricComments(Constants.SODIUM, (this.score[ReportCard.AMOUNTS][Constants.SODIUM] /= daysAmount));
        this.score[ReportCard.SCORE][Constants.CARBS] /= daysAmount;
        this.basicGradeRubricComments(Constants.CARBS, (this.score[ReportCard.AMOUNTS][Constants.CARBS] /= daysAmount));
        this.score[ReportCard.SCORE][Constants.FIBER] /= daysAmount;
        this.basicGradeRubricComments(Constants.FIBER, (this.score[ReportCard.AMOUNTS][Constants.FIBER] /= daysAmount));
        this.score[ReportCard.SCORE][Constants.SUGAR] /= daysAmount;
        this.basicGradeRubricComments(Constants.SUGAR, (this.score[ReportCard.AMOUNTS][Constants.SUGAR] /= daysAmount));
        this.score[ReportCard.SCORE][Constants.PROTEIN] /= daysAmount;
        this.basicGradeRubricComments(Constants.PROTEIN, (this.score[ReportCard.AMOUNTS][Constants.PROTEIN] /= daysAmount));
    }

    accumulateTotals(day) {
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
        return dayTotal;
    }

    basicGradeRubric(type, value) {
        switch (type) {
            case Constants.CALORIES:
                if (value > 4000) {
                    return 0;
                }
                if (value > 2500) {
                    return this.normalize(4000, 2500, value);
                }
                if (value > 1500) {
                    return ReportCard.MAX_SCORE;
                }
                if (value > 1000) {
                    return this.normalize(1000, 1500, value);
                }
                return 0;
            case Constants.TOTALFAT:
                if (value > 100) {
                    return 0;
                }
                if (value > 50) {
                    return this.normalize(100, 50, value);
                }
                if (value > 25) {
                    return ReportCard.MAX_SCORE;
                }
                if (value > 0) {
                    return this.normalize(0, 25, value);
                }
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
                return ReportCard.MAX_SCORE;
            case Constants.TRANSFAT:
                if (value > 5) {
                    return 0;
                }
                if (value > 0) {
                    return this.normalize(5, 0, value);
                }
                return ReportCard.MAX_SCORE;
            case Constants.CHOLESTEROL:
                if (value > 500) {
                    return 0;
                }
                if (value > 200) {
                    return 0.75 * this.normalize(500, 200, value);
                }
                if (value > 0) {
                    return 0.75 + 0.25 * this.normalize(200, 0, value);
                }
                return ReportCard.MAX_SCORE;
            case Constants.SODIUM:
                if (value > 4000) {
                    return 0;
                }
                if (value > 2300) {
                    return 0.9 * this.normalize(4000, 2300, value);
                }
                if (value > 1500) {
                    return 0.9 + 0.1 * this.normalize(2300, 1500, value);
                }
                if (value > 500) {
                    return ReportCard.MAX_SCORE;
                }
                if (value > 0) {
                    return this.normalize(0, 500, value);
                }
                return 0;
            case Constants.CARBS:
                if (value > 500) {
                    return 0;
                }
                if (value > 275) {
                    return this.normalize(500, 275, value);
                }
                if (value > 200) {
                    return ReportCard.MAX_SCORE;
                }
                if (value > 150) {
                    return 0.5 + 0.5 * this.normalize(150, 200, value);
                }
                if (value > 50) {
                    return 0.5 * this.normalize(50, 150, value);
                }
                return 0;
            case Constants.FIBER:
                if (value > 100) {
                    return 0;
                }
                if (value > 38) {
                    return this.normalize(100, 38, value);
                }
                if (value > 28) {
                    return ReportCard.MAX_SCORE;
                }
                if (value > 0) {
                    return this.normalize(0, 28, value);
                }
                return 0;
            case Constants.SUGAR:
                if (value > 100) {
                    return 0;
                }
                if (value > 50) {
                    return 0.5 * this.normalize(100, 50, value);
                }
                if (value > 30) {
                    return 0.5 + 0.5 * this.normalize(50, 30, value);
                }
                return ReportCard.MAX_SCORE;
            case Constants.PROTEIN:
                if (value > 150) {
                    return 0.5 * ReportCard.MAX_SCORE;
                }
                if (value > 75) {
                    return 0.5 + 0.5 * this.normalize(150, 75, value);
                }
                if (value > 50) {
                    return ReportCard.MAX_SCORE;
                }
                if (value > 20) {
                    return this.normalize(20, 50, value);
                }
                return 0;
        }
    }

    basicGradeRubricComments(type, value) {
        switch (type) {
            case Constants.CALORIES:
                if (value > 4000) {
                    this.score[ReportCard.COMMENTS][Constants.CALORIES] = "Way too many calories!";
                    break;
                }
                if (value > 2500) {
                    this.score[ReportCard.COMMENTS][Constants.CALORIES] = "Could use less calories.";
                    break;
                }
                if (value > 1500) {
                    this.score[ReportCard.COMMENTS][Constants.CALORIES] = "Good job! You are around the ideal calorie count.";
                    break;
                }
                if (value > 1000) {
                    this.score[ReportCard.COMMENTS][Constants.CALORIES] = "Not enough calories, you need a little more to stay healty.";
                    break;
                }
                this.score[ReportCard.COMMENTS][Constants.CALORIES] = "You don't have nearly enough calories, you will starve!";
                break;
            case Constants.TOTALFAT:
                if (value > 100) {
                    this.score[ReportCard.COMMENTS][Constants.TOTALFAT] = "Way too many fats!";
                    break;
                }
                if (value > 50) {
                    this.score[ReportCard.COMMENTS][Constants.TOTALFAT] = "Could use fewer fats.";
                    break;
                }
                if (value > 25) {
                    this.score[ReportCard.COMMENTS][Constants.TOTALFAT] = "Good amount of fats.";
                    break;
                }
                if (value > 0) {
                    this.score[ReportCard.COMMENTS][Constants.TOTALFAT] = "Could use a little more fats!";
                    break;
                }
                this.score[ReportCard.COMMENTS][Constants.TOTALFAT] = "You need more fats!";
                break;
            case Constants.SATFAT:
                if (value > 40) {
                    break;
                }
                if (value > 20) {
                    break;
                }
                if (value > 10) {
                    break;
                }
                break;
            case Constants.TRANSFAT:
                if (value > 5) {
                    this.score[ReportCard.COMMENTS][Constants.TOTALFAT] = this.score[ReportCard.COMMENTS][Constants.TOTALFAT] + " Also way too much transfat!";
                    break;
                }
                if (value > 0) {
                    this.score[ReportCard.COMMENTS][Constants.TOTALFAT] = this.score[ReportCard.COMMENTS][Constants.TOTALFAT] + " Also could use less transfat!";
                    break;
                }
                break;
            case Constants.CHOLESTEROL:
                if (value > 500) {
                    this.score[ReportCard.COMMENTS][Constants.CHOLESTEROL] = "Way too much cholesterol!";
                    break;
                }
                if (value > 200) {
                    this.score[ReportCard.COMMENTS][Constants.CHOLESTEROL] = "Could use less cholesterol.";
                    break;
                }
                if (value > 0) {
                    this.score[ReportCard.COMMENTS][Constants.CHOLESTEROL] = "Good amount of cholesterol.";
                    break;
                }
                this.score[ReportCard.COMMENTS][Constants.CHOLESTEROL] = "Good job keeping cholesterol low!";
                break;
            case Constants.SODIUM:
                if (value > 4000) {
                    this.score[ReportCard.COMMENTS][Constants.SODIUM] = "Way too much sodium!";
                    break;
                }
                if (value > 2300) {
                    this.score[ReportCard.COMMENTS][Constants.SODIUM] = "Could use less sodium.";
                    break;
                }
                if (value > 1500) {
                    this.score[ReportCard.COMMENTS][Constants.SODIUM] = "Good amount of sodium.";
                    break;
                }
                if (value > 500) {
                    this.score[ReportCard.COMMENTS][Constants.SODIUM] = "Great job keeping sodium amount low!";
                    break;
                }
                if (value > 0) {
                    this.score[ReportCard.COMMENTS][Constants.SODIUM] = "Could use a little more sodium.";
                    break;
                }
                this.score[ReportCard.COMMENTS][Constants.SODIUM] = "Way too little sodium! Sodium is required for your body to function.";
                break;
            case Constants.CARBS:
                if (value > 500) {
                    this.score[ReportCard.COMMENTS][Constants.CARBS] = "Way too many carbs!";
                    break;
                }
                if (value > 275) {
                    this.score[ReportCard.COMMENTS][Constants.CARBS] = "Could use less carbs.";
                    break;
                }
                if (value > 200) {
                    this.score[ReportCard.COMMENTS][Constants.CARBS] = "Good amount of carbs!";
                    break;
                }
                if (value > 150) {
                    this.score[ReportCard.COMMENTS][Constants.CARBS] = "Could use a few more carbs.";
                    break;
                }
                if (value > 50) {
                    this.score[ReportCard.COMMENTS][Constants.CARBS] = "Need more carbs.";
                    break;
                }
                this.score[ReportCard.COMMENTS][Constants.CARBS] = "Need way more carbs, carbs are necessary for your diet!";
                break;
            case Constants.FIBER:
                if (value > 100) {
                    this.score[ReportCard.COMMENTS][Constants.FIBER] = "Way too much fiber!";
                    break;
                }
                if (value > 38) {
                    this.score[ReportCard.COMMENTS][Constants.FIBER] = "Too much fiber, get a little less.";
                    break;
                }
                if (value > 28) {
                    this.score[ReportCard.COMMENTS][Constants.FIBER] = "Perfect amount of fiber!";
                    break;
                }
                if (value > 0) {
                    this.score[ReportCard.COMMENTS][Constants.FIBER] = "Need some more fiber.";
                    break;
                }
                this.score[ReportCard.COMMENTS][Constants.FIBER] = "Not nearly enough fiber!";
                break;
            case Constants.SUGAR:
                if (value > 100) {
                    this.score[ReportCard.COMMENTS][Constants.SUGAR] = "Way too much sugar!";
                    break;
                }
                if (value > 50) {
                    this.score[ReportCard.COMMENTS][Constants.SUGAR] = "Too much sugar.";
                    break;
                }
                if (value > 30) {
                    this.score[ReportCard.COMMENTS][Constants.SUGAR] = "A little too much sugar!";
                    break;
                }
                this.score[ReportCard.COMMENTS][Constants.SUGAR] = "Good job keeping sugar low!";
                break;
            case Constants.PROTEIN:
                if (value > 150) {
                    this.score[ReportCard.COMMENTS][Constants.PROTEIN] = "That is a ton of protein, are you a body builder?!";
                    break;
                }
                if (value > 75) {
                    this.score[ReportCard.COMMENTS][Constants.PROTEIN] = "That is a lot of protein, are you an athelete?";
                    break;
                }
                if (value > 50) {
                    this.score[ReportCard.COMMENTS][Constants.PROTEIN] = "Perfect amount of protein!";
                    break;
                }
                if (value > 20) {
                    this.score[ReportCard.COMMENTS][Constants.PROTEIN] = "That is not enough protein, add some more.";
                    break;
                }
                this.score[ReportCard.COMMENTS][Constants.PROTEIN] = "That is not nearly enough protein, add some more!";
                break;
        }
    }

    score;
    days;
}