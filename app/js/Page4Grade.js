import { Constants, FoodItem, Weekday } from "./common.js";

class ReportCard {
    // Constants used in class
    static MAX_SCORE = 100;

    // Indices for internal arrays
    static BREAKFASTSCORE = 0;
    static LUNCHSCORE = 1;
    static DINNERSCORE = 2;
    static SNACKSSCORE = 3;
    static COMMENTS = 4;

    constructor() {
        for (let i = 0; i < 4; i++) {
            this.#score[i] = [];
            for (let j = 0; j < 10; j++) {
                this.#score[i][j] = 0;
            }
        }

        this.#days = [];
    }

    normalize(bottom, top, value) {
        return ( (value - bottom) / (top - bottom) ) * MAX_SCORE;
    }

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
        let mealsAmount = meals.length;
        while (meals.length > 0) {
            let foodItem = meals.pop();
            this.#score[BREAKFASTSCORE][Constants.CALORIES] += this.basicGradeRubric(Constants.CALORIES, foodItem.calories());
            this.#score[BREAKFASTSCORE][Constants.TOTALFAT] += this.basicGradeRubric(Constants.TOTALFAT, foodItem.totalFatG());
            this.#score[BREAKFASTSCORE][Constants.SATFAT] += this.basicGradeRubric(Constants.SATFAT, foodItem.satFatG());
            this.#score[BREAKFASTSCORE][Constants.TRANSFAT] += this.basicGradeRubric(Constants.TRANSFAT, foodItem.transFatG());
            this.#score[BREAKFASTSCORE][Constants.CHOLESTEROL] += this.basicGradeRubric(Constants.CHOLESTEROL, foodItem.cholesterolMG());
            this.#score[BREAKFASTSCORE][Constants.SODIUM] += this.basicGradeRubric(Constants.SODIUM, foodItem.sodiumMG());
            this.#score[BREAKFASTSCORE][Constants.CARBS] += this.basicGradeRubric(Constants.CARBS, foodItem.carbsG());
            this.#score[BREAKFASTSCORE][Constants.FIBER] += this.basicGradeRubric(Constants.FIBER, foodItem.fiberG());
            this.#score[BREAKFASTSCORE][Constants.SUGAR] += this.basicGradeRubric(Constants.SUGAR, foodItem.sugarsG());
            this.#score[BREAKFASTSCORE][Constants.PROTEIN] += this.basicGradeRubric(Constants.PROTEIN, foodItem.proteinG());
        }
        this.#score[BREAKFASTSCORE][Constants.CALORIES] /= mealsAmount;
        this.#score[BREAKFASTSCORE][Constants.TOTALFAT] /= mealsAmount;
        this.#score[BREAKFASTSCORE][Constants.SATFAT] /= mealsAmount;
        this.#score[BREAKFASTSCORE][Constants.TRANSFAT] /= mealsAmount;
        this.#score[BREAKFASTSCORE][Constants.CHOLESTEROL] /= mealsAmount;
        this.#score[BREAKFASTSCORE][Constants.SODIUM] /= mealsAmount;
        this.#score[BREAKFASTSCORE][Constants.CARBS] /= mealsAmount;
        this.#score[BREAKFASTSCORE][Constants.FIBER] /= mealsAmount;
        this.#score[BREAKFASTSCORE][Constants.SUGAR] /= mealsAmount;
        this.#score[BREAKFASTSCORE][Constants.PROTEIN] /= mealsAmount;

        // Do the same for other 3 meals

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