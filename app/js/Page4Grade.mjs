import { Constants, FoodItem, Weekday } from "./common.mjs";

class ReportCard {
    // Constants used in class
    static MAX_SCORE = 100;

    // Indices for internal arrays
    static SCORE = 0;
    static COMMENTS = 1;

    constructor() {
        // Initialize the score categories to 0
        this.#score[0] = [];
        for (let i = 0; i < 10; i++) {
            this.#score[0][i] = 0;
        }
        
        // Set the comments index to be an empty array
        this.#score[1] = [];

        this.#days = [];
    }

    // This is used to interpolate between values for scoring 
    // Bottom = 0, top = 1
    normalize(bottom, top, value) {
        return ( (value - bottom) / (top - bottom) ) * MAX_SCORE;
    }

    // Add days to the ReportCard, handles individual days and an array of days
    addDays(daysToAdd) {
        if (Array.isArray(daysToAdd)) {
            while (daysToAdd.length > 0) {
                this.#days.push(daysToAdd.pop());
            }
        } else {
            this.#days.push(daysToAdd);
        }
    }

    basicGradeAll() {
        while (this.#days.length > 0) {
            basicGradeDay(this.#days.pop());
        }
    }

    basicGradeDay(day) {
        let meals = day.getMealItems(Constants.BREAKFAST);
        // Meals are stored separately in the Weekday class, so we get all values
        // from each category and store it in the score array
        while (meals.length > 0) {
            let foodItem = meals.pop();
            this.#score[SCORE][Constants.CALORIES] += foodItem.calories;
            this.#score[SCORE][Constants.TOTALFAT] += foodItem.totalFatG;
            this.#score[SCORE][Constants.SATFAT] += foodItem.satFatG;
            this.#score[SCORE][Constants.TRANSFAT] += foodItem.transFatG;
            this.#score[SCORE][Constants.CHOLESTEROL] += foodItem.cholesterolMG;
            this.#score[SCORE][Constants.SODIUM] += foodItem.sodiumMG;
            this.#score[SCORE][Constants.CARBS] += foodItem.carbsG;
            this.#score[SCORE][Constants.FIBER] += foodItem.fiberG;
            this.#score[SCORE][Constants.SUGAR] += foodItem.sugarsG;
            this.#score[SCORE][Constants.PROTEIN] += foodItem.proteinG;
        }

        meals = day.getMealItems(Constants.LUNCH);
        while (meals.length > 0) {
            let foodItem = meals.pop();
            this.#score[SCORE][Constants.CALORIES] += foodItem.calories;
            this.#score[SCORE][Constants.TOTALFAT] += foodItem.totalFatG;
            this.#score[SCORE][Constants.SATFAT] += foodItem.satFatG;
            this.#score[SCORE][Constants.TRANSFAT] += foodItem.transFatG;
            this.#score[SCORE][Constants.CHOLESTEROL] += foodItem.cholesterolMG;
            this.#score[SCORE][Constants.SODIUM] += foodItem.sodiumMG;
            this.#score[SCORE][Constants.CARBS] += foodItem.carbsG;
            this.#score[SCORE][Constants.FIBER] += foodItem.fiberG;
            this.#score[SCORE][Constants.SUGAR] += foodItem.sugarsG;
            this.#score[SCORE][Constants.PROTEIN] += foodItem.proteinG;
        }

        meals = day.getMealItems(Constants.DINNER);
        while (meals.length > 0) {
            let foodItem = meals.pop();
            this.#score[SCORE][Constants.CALORIES] += foodItem.calories;
            this.#score[SCORE][Constants.TOTALFAT] += foodItem.totalFatG;
            this.#score[SCORE][Constants.SATFAT] += foodItem.satFatG;
            this.#score[SCORE][Constants.TRANSFAT] += foodItem.transFatG;
            this.#score[SCORE][Constants.CHOLESTEROL] += foodItem.cholesterolMG;
            this.#score[SCORE][Constants.SODIUM] += foodItem.sodiumMG;
            this.#score[SCORE][Constants.CARBS] += foodItem.carbsG;
            this.#score[SCORE][Constants.FIBER] += foodItem.fiberG;
            this.#score[SCORE][Constants.SUGAR] += foodItem.sugarsG;
            this.#score[SCORE][Constants.PROTEIN] += foodItem.proteinG;
        }

        meals = day.getMealItems(Constants.SNACKS);
        while (meals.length > 0) {
            let foodItem = meals.pop();
            this.#score[SCORE][Constants.CALORIES] += foodItem.calories;
            this.#score[SCORE][Constants.TOTALFAT] += foodItem.totalFatG;
            this.#score[SCORE][Constants.SATFAT] += foodItem.satFatG;
            this.#score[SCORE][Constants.TRANSFAT] += foodItem.transFatG;
            this.#score[SCORE][Constants.CHOLESTEROL] += foodItem.cholesterolMG;
            this.#score[SCORE][Constants.SODIUM] += foodItem.sodiumMG;
            this.#score[SCORE][Constants.CARBS] += foodItem.carbsG;
            this.#score[SCORE][Constants.FIBER] += foodItem.fiberG;
            this.#score[SCORE][Constants.SUGAR] += foodItem.sugarsG;
            this.#score[SCORE][Constants.PROTEIN] += foodItem.proteinG;
        }

        // At this point, each category of the score array has the total amount of that
        // field for the day, so we send the day's total through the grading rubric 
        this.#score[SCORE][Constants.CALORIES] = this.basicGradeRubric(Constants.CALORIES, this.#score[SCORE][Constants.CALORIES]);
        this.#score[SCORE][Constants.TOTALFAT] = this.basicGradeRubric(Constants.TOTALFAT, this.#score[SCORE][Constants.TOTALFAT]);
        this.#score[SCORE][Constants.SATFAT] = this.basicGradeRubric(Constants.SATFAT, this.#score[SCORE][Constants.SATFAT]);
        this.#score[SCORE][Constants.TRANSFAT] = this.basicGradeRubric(Constants.TRANSFAT, this.#score[SCORE][Constants.TRANSFAT]);
        this.#score[SCORE][Constants.CHOLESTEROL] = this.basicGradeRubric(Constants.CHOLESTEROL, this.#score[SCORE][Constants.CHOLESTEROL]);
        this.#score[SCORE][Constants.SODIUM] = this.basicGradeRubric(Constants.SODIUM, this.#score[SCORE][Constants.SODIUM]);
        this.#score[SCORE][Constants.CARBS] = this.basicGradeRubric(Constants.CARBS, this.#score[SCORE][Constants.CARBS]);
        this.#score[SCORE][Constants.FIBER] = this.basicGradeRubric(Constants.FIBER, this.#score[SCORE][Constants.FIBER]);
        this.#score[SCORE][Constants.SUGAR] = this.basicGradeRubric(Constants.SUGAR, this.#score[SCORE][Constants.SUGAR]);
        this.#score[SCORE][Constants.PROTEIN] = this.basicGradeRubric(Constants.PROTEIN, this.#score[SCORE][Constants.PROTEIN]);
    }

    basicGradeRubric(type, value) {
        switch (type) {
            case Constants.CALORIES:
                if (value > 4000) return 0;
                if (value > 2500) return this.normalize(4000, 2500, value);
                if (value > 1500) return MAX_SCORE;
                if (value > 1000) return this.normalize(1000, 1500, value);
                return 0;
            case Constants.TOTALFAT:
                if (value > 100) return 0;
                if (value > 50) return this.normalize(100, 50, value);
                if (value > 25) return MAX_SCORE;
                if (value > 0) return this.normalize(0, 25, value);
                return 0;
            case Constants.SATFAT:
                if (value > 40) return 0;
                if (value > 20) return 0.75 * this.normalize(40, 20, value);
                if (value > 10) return 0.75 + 0.25 * this.normalize(20, 10, value);
                return MAX_SCORE;
            case Constants.TRANSFAT:
                if (value > 5) return 0;
                if (value > 0) return this.normalize(5, 0, value);
                return MAX_SCORE;
            case Constants.CHOLESTEROL:
                if (value > 500) return 0;
                if (value > 200) return 0.75 * this.normalize(500, 200, value);
                if (value > 0) return 0.75 + 0.25 * this.normalize(200, 0, value);
                return MAX_SCORE;
            case Constants.SODIUM:
                if (value > 4000) return 0;
                if (value > 2300) return 0.9 * this.normalize(4000, 2300, value);
                if (value > 1500) return 0.9 + 0.1 * this.normalize(2300, 1500, value);
                if (value > 500) return MAX_SCORE;
                if (value > 0) return this.normalize(0, 500, value);
                return 0;
            case Constants.CARBS:
                if (value > 500) return 0;
                if (value > 275) return this.normalize(500, 275, value);
                if (value > 200) return MAX_SCORE;
                if (value > 150) return 0.5 + 0.5 * this.normalize(150, 200, value);
                if (value > 50) return 0.5 * this.normalize(50, 150, value);
                return 0;
            case Constants.FIBER:
                if (value > 100) return 0;
                if (value > 38) return this.normalize(100, 38, value);
                if (value > 28) return MAX_SCORE;
                if (value > 0) return this.normalize(0, 28, value);
                return 0;
            case Constants.SUGAR:
                if (value > 100) return 0;
                if (value > 50) return 0.5 * this.normalize(100, 50, value);
                if (value > 30) return 0.5 + 0.5 * this.normalize(50, 30, value);
                return MAX_SCORE;
            case Constants.PROTEIN:
                if (value > 150) return 0.5 * MAX_SCORE;
                if (value > 75) return 0.5 + 0.5 * this.normalize(150, 75, value);
                if (value > 50) return MAX_SCORE;
                if (value > 20) return this.normalize(20, 50, value);
                return 0;            
        }
    }

    #score; 
    #days;
}