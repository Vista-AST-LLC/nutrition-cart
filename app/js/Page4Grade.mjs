import { Constants, FoodItem, Weekday } from "./common.mjs";

const gradeButton = document.getElementById("getGradeButton");
gradeButton.addEventListener('click', async (e) => {
    gradeButton.style.visibility = 'hidden';
    let mon = new Weekday();
    //Weekday.copyFoodItems(mon, JSON.parse(localStorage.getItem('Monday')));
    let tues = new Weekday();
    //Weekday.copyFoodItems(tues, JSON.parse(localStorage.getItem('Tuesday')));
    let wed = new Weekday();
    //Weekday.copyFoodItems(wed, JSON.parse(localStorage.getItem('Wednesday')));
    let thur = new Weekday();
    //Weekday.copyFoodItems(thur, JSON.parse(localStorage.getItem('Thursday')));
    let fri = new Weekday();
    //Weekday.copyFoodItems(fri, JSON.parse(localStorage.getItem('Friday')));
    
    let report = new ReportCard();

    report.addDays([mon, tues, wed, thur, fri]);

    await report.basicGradeAll();

    let totalGradeCircle = document.getElementById('pointsCircle');
    let totalGrade = (report.score[ReportCard.SCORE][Constants.CALORIES] + report.score[ReportCard.SCORE][Constants.TOTALFAT] + report.score[ReportCard.SCORE][Constants.SATFAT] + report.score[ReportCard.SCORE][Constants.TRANSFAT] + report.score[ReportCard.SCORE][Constants.CHOLESTEROL] + report.score[ReportCard.SCORE][Constants.SODIUM] + report.score[ReportCard.SCORE][Constants.CARBS] + report.score[ReportCard.SCORE][Constants.FIBER] + report.score[ReportCard.SCORE][Constants.SUGAR] + report.score[ReportCard.SCORE][Constants.PROTEIN]) / 10;
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

    let caloriesCom = document.getElementById('caloriesComments');
    let caloriesCard = document.getElementById('totalCalories');
    caloriesCom.innerHTML = report.score[ReportCard.COMMENTS][Constants.CALORIES];
    caloriesCard.innerHTML = report.score[ReportCard.SCORE][Constants.CALORIES];
    let fatsCom = document.getElementById('fatsComments');
    let fatsCard = document.getElementById('totalFats');
    fatsCom.innerHTML = report.score[ReportCard.COMMENTS][Constants.CALORIES];
    fatsCard.innerHTML = report.score[ReportCard.SCORE][Constants.CALORIES];
    let cholesterolCom = document.getElementById('cholesterolComments');
    let cholesterolCard = document.getElementById('totalCholesterol');
    cholesterolCom.innerHTML = report.score[ReportCard.COMMENTS][Constants.CALORIES];
    cholesterolCard.innerHTML = report.score[ReportCard.SCORE][Constants.CALORIES];
    let sodiumCom = document.getElementById('sodiumComments');
    let sodiumCard = document.getElementById('totalSodium');
    sodiumCom.innerHTML = report.score[ReportCard.COMMENTS][Constants.CALORIES];
    sodiumCard.innerHTML = report.score[ReportCard.SCORE][Constants.CALORIES];
    let carbsCom = document.getElementById('carbsComments');
    let carbsCard = document.getElementById('totalCarbs');
    carbsCom.innerHTML = report.score[ReportCard.COMMENTS][Constants.CALORIES];
    carbsCard.innerHTML = report.score[ReportCard.SCORE][Constants.CALORIES];
    let fiberCom = document.getElementById('fiberComments');
    let fiberCard = document.getElementById('totalFiber');
    fiberCom.innerHTML = report.score[ReportCard.COMMENTS][Constants.CALORIES];
    fiberCard.innerHTML = report.score[ReportCard.SCORE][Constants.CALORIES];
    let sugarsCom = document.getElementById('sugarsComments');
    let sugarsCard = document.getElementById('totalSugars');
    sugarsCom.innerHTML = report.score[ReportCard.COMMENTS][Constants.CALORIES];
    sugarsCard.innerHTML = report.score[ReportCard.SCORE][Constants.CALORIES];
    let proteinCom = document.getElementById('proteinComments');
    let proteinCard = document.getElementById('totalProtein');
    proteinCom.innerHTML = report.score[ReportCard.COMMENTS][Constants.CALORIES];
    proteinCard.innerHTML = report.score[ReportCard.SCORE][Constants.CALORIES];
})

class ReportCard {
    // Constants used in class
    static MAX_SCORE = 100;

    // Indices for internal arrays
    static SCORE = 0;
    static AMOUNTS = 1;
    static COMMENTS = 2;

    constructor() {
        // Initialize the score and amounts categories to 0
        this.score = Array.from({ length: 2 }, () => new Array(10).fill(0));
        
        // Set each entry in the comments index to be 'Default Comment'
        this.score[this.COMMENTS] = Array(10).fill('Default Comment');

        this.days = [];
    }

    // This is used to interpolate between values for scoring 
    // Bottom = 0, top = 1
    normalize(bottom, top, value) {
        return ( (value - bottom) / (top - bottom) ) * this.MAX_SCORE;
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
        let daysAmount = this.days.length;
        while (this.days.length > 0) {
            this.accumulateTotals(this.days.pop());
        }
        // At this point, each category of the AMOUNTS array has the total amount of
        // that field for the day, so we send the day's total through the grading rubric 
        this.score[this.SCORE][Constants.CALORIES] = this.basicGradeRubric(Constants.CALORIES, (this.score[this.AMOUNTS][Constants.CALORIES] / daysAmount));
        this.score[this.SCORE][Constants.TOTALFAT] = this.basicGradeRubric(Constants.TOTALFAT, (this.score[this.AMOUNTS][Constants.TOTALFAT] / daysAmount));
        this.score[this.SCORE][Constants.SATFAT] = this.basicGradeRubric(Constants.SATFAT, (this.score[this.AMOUNTS][Constants.SATFAT] / daysAmount));
        this.score[this.SCORE][Constants.TRANSFAT] = this.basicGradeRubric(Constants.TRANSFAT, (this.score[this.AMOUNTS][Constants.TRANSFAT] / daysAmount));
        this.score[this.SCORE][Constants.CHOLESTEROL] = this.basicGradeRubric(Constants.CHOLESTEROL, (this.score[this.AMOUNTS][Constants.CHOLESTEROL] / daysAmount));
        this.score[this.SCORE][Constants.SODIUM] = this.basicGradeRubric(Constants.SODIUM, (this.score[this.AMOUNTS][Constants.SODIUM] / daysAmount));
        this.score[this.SCORE][Constants.CARBS] = this.basicGradeRubric(Constants.CARBS, (this.score[this.AMOUNTS][Constants.CARBS] / daysAmount));
        this.score[this.SCORE][Constants.FIBER] = this.basicGradeRubric(Constants.FIBER, (this.score[this.AMOUNTS][Constants.FIBER] / daysAmount));
        this.score[this.SCORE][Constants.SUGAR] = this.basicGradeRubric(Constants.SUGAR, (this.score[this.AMOUNTS][Constants.SUGAR] / daysAmount));
        this.score[this.SCORE][Constants.PROTEIN] = this.basicGradeRubric(Constants.PROTEIN, (this.score[this.AMOUNTS][Constants.PROTEIN] / daysAmount));
    }

    accumulateTotals(day) {
        let meals = day.getMealItems(Constants.BREAKFAST);
        // Meals are stored separately in the Weekday class, so we get all values
        // from each category and store it in the AMOUNTS array
        while (meals.length > 0) {
            let foodItem = meals.pop();
            this.score[this.AMOUNTS][Constants.CALORIES] += foodItem.calories;
            this.score[this.AMOUNTS][Constants.TOTALFAT] += foodItem.totalFatG;
            this.score[this.AMOUNTS][Constants.SATFAT] += foodItem.satFatG;
            this.score[this.AMOUNTS][Constants.TRANSFAT] += foodItem.transFatG;
            this.score[this.AMOUNTS][Constants.CHOLESTEROL] += foodItem.cholesterolMG;
            this.score[this.AMOUNTS][Constants.SODIUM] += foodItem.sodiumMG;
            this.score[this.AMOUNTS][Constants.CARBS] += foodItem.carbsG;
            this.score[this.AMOUNTS][Constants.FIBER] += foodItem.fiberG;
            this.score[this.AMOUNTS][Constants.SUGAR] += foodItem.sugarsG;
            this.score[this.AMOUNTS][Constants.PROTEIN] += foodItem.proteinG;
        }

        meals = day.getMealItems(Constants.LUNCH);
        while (meals.length > 0) {
            let foodItem = meals.pop();
            this.score[this.AMOUNTS][Constants.CALORIES] += foodItem.calories;
            this.score[this.AMOUNTS][Constants.TOTALFAT] += foodItem.totalFatG;
            this.score[this.AMOUNTS][Constants.SATFAT] += foodItem.satFatG;
            this.score[this.AMOUNTS][Constants.TRANSFAT] += foodItem.transFatG;
            this.score[this.AMOUNTS][Constants.CHOLESTEROL] += foodItem.cholesterolMG;
            this.score[this.AMOUNTS][Constants.SODIUM] += foodItem.sodiumMG;
            this.score[this.AMOUNTS][Constants.CARBS] += foodItem.carbsG;
            this.score[this.AMOUNTS][Constants.FIBER] += foodItem.fiberG;
            this.score[this.AMOUNTS][Constants.SUGAR] += foodItem.sugarsG;
            this.score[this.AMOUNTS][Constants.PROTEIN] += foodItem.proteinG;
        }

        meals = day.getMealItems(Constants.DINNER);
        while (meals.length > 0) {
            let foodItem = meals.pop();
            this.score[this.AMOUNTS][Constants.CALORIES] += foodItem.calories;
            this.score[this.AMOUNTS][Constants.TOTALFAT] += foodItem.totalFatG;
            this.score[this.AMOUNTS][Constants.SATFAT] += foodItem.satFatG;
            this.score[this.AMOUNTS][Constants.TRANSFAT] += foodItem.transFatG;
            this.score[this.AMOUNTS][Constants.CHOLESTEROL] += foodItem.cholesterolMG;
            this.score[this.AMOUNTS][Constants.SODIUM] += foodItem.sodiumMG;
            this.score[this.AMOUNTS][Constants.CARBS] += foodItem.carbsG;
            this.score[this.AMOUNTS][Constants.FIBER] += foodItem.fiberG;
            this.score[this.AMOUNTS][Constants.SUGAR] += foodItem.sugarsG;
            this.score[this.AMOUNTS][Constants.PROTEIN] += foodItem.proteinG;
        }

        meals = day.getMealItems(Constants.SNACKS);
        while (meals.length > 0) {
            let foodItem = meals.pop();
            this.score[this.AMOUNTS][Constants.CALORIES] += foodItem.calories;
            this.score[this.AMOUNTS][Constants.TOTALFAT] += foodItem.totalFatG;
            this.score[this.AMOUNTS][Constants.SATFAT] += foodItem.satFatG;
            this.score[this.AMOUNTS][Constants.TRANSFAT] += foodItem.transFatG;
            this.score[this.AMOUNTS][Constants.CHOLESTEROL] += foodItem.cholesterolMG;
            this.score[this.AMOUNTS][Constants.SODIUM] += foodItem.sodiumMG;
            this.score[this.AMOUNTS][Constants.CARBS] += foodItem.carbsG;
            this.score[this.AMOUNTS][Constants.FIBER] += foodItem.fiberG;
            this.score[this.AMOUNTS][Constants.SUGAR] += foodItem.sugarsG;
            this.score[this.AMOUNTS][Constants.PROTEIN] += foodItem.proteinG;
        }
    }

    basicGradeRubric(type, value) {
        switch (type) {
            case Constants.CALORIES:
                if (value > 4000) { 
                    this.score[this.COMMENTS][Constants.CALORIES] = "Way too many calories!";
                    return 0; }
                if (value > 2500) { 
                    this.score[this.COMMENTS][Constants.CALORIES] = "Could use less calories.";
                    return this.normalize(4000, 2500, value); }
                if (value > 1500) { 
                    this.score[this.COMMENTS][Constants.CALORIES] = "Good job! You are around the ideal calorie count.";
                    return this.MAX_SCORE; }
                if (value > 1000) { 
                    this.score[this.COMMENTS][Constants.CALORIES] = "Not enough calories, you need a little more to stay healty.";
                    return this.normalize(1000, 1500, value); }
                this.score[this.COMMENTS][Constants.CALORIES] = "You don't have nearly enough calories, you will starve!";
                return 0;
            case Constants.TOTALFAT:
                if (value > 100) { 
                    this.score[this.COMMENTS][Constants.TOTALFAT] = "Way too many fats!";
                    return 0; }
                if (value > 50) { 
                    this.score[this.COMMENTS][Constants.TOTALFAT] = "Could use fewer fats.";
                    return this.normalize(100, 50, value); }
                if (value > 25) { 
                    this.score[this.COMMENTS][Constants.TOTALFAT] = "Good amount of fats.";
                    return this.MAX_SCORE; }
                if (value > 0) { 
                    this.score[this.COMMENTS][Constants.TOTALFAT] = "Could use a little more fats!";
                    return this.normalize(0, 25, value); }
                this.score[this.COMMENTS][Constants.TOTALFAT] = "You need more fats!";
                return 0;
            case Constants.SATFAT:
                if (value > 40) {
                    return 0; }
                if (value > 20) { 
                    return 0.75 * this.normalize(40, 20, value); }
                if (value > 10) { 
                    return 0.75 + 0.25 * this.normalize(20, 10, value); }
                return this.MAX_SCORE;
            case Constants.TRANSFAT:
                if (value > 5) { 
                    this.score[this.COMMENTS][Constants.TOTALFAT] = this.score[this.COMMENTS][Constants.TOTALFAT] + " Also way too much transfat!";
                    return 0; }
                if (value > 0) { 
                    this.score[this.COMMENTS][Constants.TOTALFAT] = this.score[this.COMMENTS][Constants.TOTALFAT] + " Also could use less transfat!";
                    return this.normalize(5, 0, value); }
                return this.MAX_SCORE;
            case Constants.CHOLESTEROL:
                if (value > 500) { 
                    this.score[this.COMMENTS][Constants.CHOLESTEROL] = "Way too much cholesterol!";
                    return 0; }
                if (value > 200) { 
                    this.score[this.COMMENTS][Constants.CHOLESTEROL] = "Could use less cholesterol.";
                    return 0.75 * this.normalize(500, 200, value); }
                if (value > 0) { 
                    this.score[this.COMMENTS][Constants.CHOLESTEROL] = "Good amount of cholesterol.";
                    return 0.75 + 0.25 * this.normalize(200, 0, value); }
                this.score[this.COMMENTS][Constants.CHOLESTEROL] = "Good job keeping cholesterol low!";
                return this.MAX_SCORE;
            case Constants.SODIUM:
                if (value > 4000) { 
                    this.score[this.COMMENTS][Constants.SODIUM] = "Way too much sodium!";
                    return 0; }
                if (value > 2300) { 
                    this.score[this.COMMENTS][Constants.SODIUM] = "Could use less sodium.";
                    return 0.9 * this.normalize(4000, 2300, value); }
                if (value > 1500) { 
                    this.score[this.COMMENTS][Constants.SODIUM] = "Good amount of sodium.";
                    return 0.9 + 0.1 * this.normalize(2300, 1500, value); }
                if (value > 500) { 
                    this.score[this.COMMENTS][Constants.SODIUM] = "Great job keeping sodium amount low!";
                    return this.MAX_SCORE; }
                if (value > 0) { 
                    this.score[this.COMMENTS][Constants.SODIUM] = "Way too little sodium! Sodium is required for your body to function.";
                    return this.normalize(0, 500, value); }
                return 0;
            case Constants.CARBS:
                if (value > 500) { 
                    this.score[this.COMMENTS][Constants.CARBS] = "Way too many carbs!";
                    return 0; }
                if (value > 275) { 
                    this.score[this.COMMENTS][Constants.CARBS] = "Could use less carbs.";
                    return this.normalize(500, 275, value); }
                if (value > 200) { 
                    this.score[this.COMMENTS][Constants.CARBS] = "Good amount of carbs!";
                    return this.MAX_SCORE; }
                if (value > 150) { 
                    this.score[this.COMMENTS][Constants.CARBS] = "Could use a few more carbs.";
                    return 0.5 + 0.5 * this.normalize(150, 200, value); }
                if (value > 50) { 
                    this.score[this.COMMENTS][Constants.CARBS] = "Need more carbs.";
                    return 0.5 * this.normalize(50, 150, value); }
                this.score[this.COMMENTS][Constants.CARBS] = "Need way more carbs, carbs are necessary for your diet!";
                return 0;
            case Constants.FIBER:
                if (value > 100) { 
                    this.score[this.COMMENTS][Constants.FIBER] = "Way too much fiber!";
                    return 0; }
                if (value > 38) { 
                    this.score[this.COMMENTS][Constants.FIBER] = "Too much fiber, get a little less.";
                    return this.normalize(100, 38, value); }
                if (value > 28) { 
                    this.score[this.COMMENTS][Constants.FIBER] = "Perfect amount of fiber!";
                    return this.MAX_SCORE; }
                if (value > 0) { 
                    this.score[this.COMMENTS][Constants.FIBER] = "Need some more fiber.";
                    return this.normalize(0, 28, value); }
                this.score[this.COMMENTS][Constants.FIBER] = "Not nearly enough fiber!";
                return 0;
            case Constants.SUGAR:
                if (value > 100) { 
                    this.score[this.COMMENTS][Constants.SUGAR] = "Way too much sugar!";
                    return 0; }
                if (value > 50) { 
                    this.score[this.COMMENTS][Constants.SUGAR] = "Too much sugar.";
                    return 0.5 * this.normalize(100, 50, value); }
                if (value > 30) { 
                    this.score[this.COMMENTS][Constants.SUGAR] = "A little too much sugar!";
                    return 0.5 + 0.5 * this.normalize(50, 30, value); }
                this.score[this.COMMENTS][Constants.SUGAR] = "Good job keeping sugar low!";
                return this.MAX_SCORE;
            case Constants.PROTEIN:
                if (value > 150) { 
                    this.score[this.COMMENTS][Constants.SUGAR] = "That is a ton of protein, are you a body builder?!";
                    return 0.5 * this.MAX_SCORE; }
                if (value > 75) { 
                    this.score[this.COMMENTS][Constants.SUGAR] = "That is a lot of protein, are you an athelete?";
                    return 0.5 + 0.5 * this.normalize(150, 75, value); }
                if (value > 50) { 
                    this.score[this.COMMENTS][Constants.SUGAR] = "Perfect amount of protein!";
                    return this.MAX_SCORE; }
                if (value > 20) { 
                    this.score[this.COMMENTS][Constants.SUGAR] = "That is not enough protein, add some more.";
                    return this.normalize(20, 50, value); }
                return 0;            
        }
    }

    score; 
    days;
}