export class Constants {
    // The total amount of cards we have
    static MAX_CARDS = 80;
    // Convenience consts for meal types
    static BREAKFAST = 'B';
    static LUNCH = 'L';
    static DINNER = 'D';
    static SNACKS = 'S';
    // Used in grading
    static CALORIES = 0;
    static TOTALFAT = 1;
    static SATFAT = 2;
    static TRANSFAT = 3;
    static CHOLESTEROL = 4;
    static SODIUM = 5;
    static CARBS = 6;
    static FIBER = 7;
    static SUGAR = 8;
    static PROTEIN = 9;
    static SCOREAVG = 10;
}

// This function call should be wrapped in a try-catch
export async function createFoodItem(barcode) {
    // Fetch the csv and convert it to a string
    const itemData = await fetch("../Nutrition-Cart-Data(Updated).csv")
        .then(itemData => itemData.text())

    // Split the itemData string by row (delineated by \n), 
    // then remove the first line (the names of columns)
    const itemRows = itemData.split('\n').slice(1);

    // Get the first comma separated entry from each item row (barcode ref)
    const refNumArray = itemRows.map(refNum => {
        return refNum.split(',')[0];
    })

    refNumArray.push("END");
    // Using the refNumArray, match the item we are looking for
    let lineNumber = 0;
    for (; !barcode.match(refNumArray[lineNumber]); lineNumber++) {
        if (refNumArray[lineNumber] == "END") throw Error("Failed to find barcode match!")
    }

    return new FoodItem(itemRows[lineNumber]);
}

export class FoodItem {
    constructor(data) {
        const item = data.split(',');
        this.refNumber = item[0];
        this.itemName = item[1];
        this.portionSize = item[2];
        this.calories = parseFloat(item[3]);
        this.proteinG = parseFloat(item[4]);
        this.proteinDV = item[5];
        this.sodiumMG = parseFloat(item[6]);
        this.sodiumDV = item[7];
        this.totalFatG = parseFloat(item[8]);
        this.totalFatDV = item[9];
        this.carbsG = parseFloat(item[10]);
        this.carbsDV = item[11];
        this.fiberG = parseFloat(item[12]);
        this.fiberDV = item[13];
        this.cholesterolMG = parseFloat(item[14]);
        this.cholesterolDV = item[15];
        this.satFatG = parseFloat(item[16]);
        this.satFatDV = item[17];
        this.transFatG = parseFloat(item[18]);
        this.transFatDV = item[19];
        this.sugarsG = parseFloat(item[20]);
        this.sugarsDV = item[21];
    }

    getData() {
        return {
            itemName: this.itemName,
            calories: this.calories,
            totalFatG: this.totalFatG,
            satFatG: this.satFatG,
            transFatG: this.transFatG,
            cholesterolMG: this.cholesterolMG,
            sodiumMG: this.sodiumMG,
            carbsG: this.carbsG,
            fiberG: this.fiberG,
            sugarsG: this.sugarsG,
            proteinG: this.proteinG
        }
    }

    // These are in the same order they appear in the csv
    refNumber;
    itemName;
    portionSize;
    calories;
    proteinG;
    proteinDV;
    sodiumMG;
    sodiumDV;
    totalFatG;
    totalFatDV;
    carbsG;
    carbsDV;
    fiberG;
    fiberDV;
    cholesterolMG;
    cholesterolDV;
    satFatG;
    satFatDV;
    transFatG;
    transFatDV;
    sugarsG;
    sugarsDV;
}

export class Weekday {
    constructor() {
        // Initialize the arrays to be empty
        this.breakfast = [];
        this.lunch = [];
        this.dinner = [];
        this.snacks = [];
    }

    static async fromJSON(parsed) {
        const day = new Weekday();

        if (!parsed) return day;

        const meals = [
            ...(parsed.breakfast ?? []),
            ...(parsed.lunch ?? []),
            ...(parsed.dinner ?? []),
            ...(parsed.snacks ?? [])
        ];

        const items = await Promise.all(meals
            .filter(i => typeof i?.refNumber === "string" && i.refNumber.trim() !== "")
            .map(i => createFoodItem(i.refNumber))
        );

        items.forEach(item => day.addFoodItem(item));

        return day;
    }

    addFoodItem(item) {
        // Do a switch on the first char of the ref number (B, L, D, S)
        switch (item.refNumber.charAt(0)) {
            case Constants.BREAKFAST:
                // Add the item to the array
                this.breakfast.push(item);
                break;
            case Constants.LUNCH:
                this.lunch.push(item);
                break;
            case Constants.DINNER:
                this.dinner.push(item);
                break;
            case Constants.SNACKS:
                this.snacks.push(item);
                break;
        }
    }

    async removeFoodItem(meal, index) {
        switch (meal) {
            case Constants.BREAKFAST:
                this.breakfast.splice(index, 1);
                break;
            case Constants.LUNCH:
                this.lunch.splice(index, 1);
                break;
            case Constants.DINNER:
                this.dinner.splice(index, 1);
                break;
            case Constants.SNACKS:
                this.snacks.splice(index, 1);
                break;
        }
    }

    getMealItems(meal) {
        switch (meal) {
            case Constants.BREAKFAST:
                return this.breakfast;
            case Constants.LUNCH:
                return this.lunch;
            case Constants.DINNER:
                return this.dinner;
            case Constants.SNACKS:
                return this.snacks;
        }
    }

    breakfast;
    lunch;
    dinner;
    snacks;
}

export class DayGrade {
    // Constants used in class
    static MAX_SCORE = 100;

    score = [];

    // Indices for arrays
    static SCORE = 0;
    static AMOUNTS = 1;
    static COMMENTS = 2;

    constructor(day) {
        this.score = Array.from({ length: 3 }, () => new Array(10).fill(0));
        this.score[DayGrade.COMMENTS] = new Array(10).fill('Default Comment');

        this.accumulateTotals(day);
        for (let i = 0; i < 10; i++) {
            this.score[DayGrade.SCORE][i] = this.basicGradeRubric(i, this.score[DayGrade.AMOUNTS][i]);
        }

        let totalScore = 0;
        for (let i = 0; i < 10; i++) {
            totalScore += this.score[DayGrade.SCORE][i];
        }
        this.score[DayGrade.SCORE][Constants.SCOREAVG] = totalScore / 10;
    }

    fillHTML() {
        let active = localStorage.getItem("Active")
        let caloriesCom = document.getElementById('caloriesComments');
        let caloriesCard = document.getElementById('totalCalories');
        caloriesCom.innerHTML = this.score[DayGrade.COMMENTS][Constants.CALORIES];
        caloriesCard.innerHTML = Math.round(this.score[DayGrade.AMOUNTS][Constants.CALORIES]);
        let fatsCom = document.getElementById('fatsComments');
        let fatsCard = document.getElementById('totalFats');
        fatsCom.innerHTML = this.score[DayGrade.COMMENTS][Constants.TOTALFAT];
        fatsCard.innerHTML = Math.round(this.score[DayGrade.AMOUNTS][Constants.TOTALFAT]);
        let cholesterolCom = document.getElementById('cholesterolComments');
        let cholesterolCard = document.getElementById('totalCholesterol');
        cholesterolCom.innerHTML = this.score[DayGrade.COMMENTS][Constants.CHOLESTEROL];
        cholesterolCard.innerHTML = Math.round(this.score[DayGrade.AMOUNTS][Constants.CHOLESTEROL]);
        let sodiumCom = document.getElementById('sodiumComments');
        let sodiumCard = document.getElementById('totalSodium');
        sodiumCom.innerHTML = this.score[DayGrade.COMMENTS][Constants.SODIUM];
        sodiumCard.innerHTML = Math.round(this.score[DayGrade.AMOUNTS][Constants.SODIUM]);
        let carbsCom = document.getElementById('carbsComments');
        let carbsCard = document.getElementById('totalCarbs');
        carbsCom.innerHTML = this.score[DayGrade.COMMENTS][Constants.CARBS];
        carbsCard.innerHTML = Math.round(this.score[DayGrade.AMOUNTS][Constants.CARBS]);
        let fiberCom = document.getElementById('fiberComments');
        let fiberCard = document.getElementById('totalFiber');
        fiberCom.innerHTML = this.score[DayGrade.COMMENTS][Constants.FIBER];
        fiberCard.innerHTML = Math.round(this.score[DayGrade.AMOUNTS][Constants.FIBER]);
        let sugarsCom = document.getElementById('sugarsComments');
        let sugarsCard = document.getElementById('totalSugars');
        sugarsCom.innerHTML = this.score[DayGrade.COMMENTS][Constants.SUGAR];
        sugarsCard.innerHTML = Math.round(this.score[DayGrade.AMOUNTS][Constants.SUGAR]);
        let proteinCom = document.getElementById('proteinComments');
        let proteinCard = document.getElementById('totalProtein');
        proteinCom.innerHTML = this.score[DayGrade.COMMENTS][Constants.PROTEIN];
        proteinCard.innerHTML = Math.round(this.score[DayGrade.AMOUNTS][Constants.PROTEIN]);

        let grade;

        let totalGradeCircle = document.getElementById('pointsCircle');
        if (this.score[DayGrade.SCORE][Constants.SCOREAVG] > 90) {
            grade = 'A'
            totalGradeCircle.innerHTML = 'A';
        } else if (this.score[DayGrade.SCORE][Constants.SCOREAVG] > 80) {
            grade = 'B'
            totalGradeCircle.innerHTML = 'B';
        } else if (this.score[DayGrade.SCORE][Constants.SCOREAVG] > 70) {
            grade = 'C'
            totalGradeCircle.innerHTML = 'C';
        } else if (this.score[DayGrade.SCORE][Constants.SCOREAVG] > 60) {
            grade = 'D'
            totalGradeCircle.innerHTML = 'D';
        } else {
            grade = 'F'
            totalGradeCircle.innerHTML = 'F';
        }

        let underGradeCircle = document.getElementById('underPointCircle');
        underGradeCircle.innerHTML = "Your Grade: " + Math.round(this.score[DayGrade.SCORE][Constants.SCOREAVG]);

        let scoreData = {
            "Score": Math.round(this.score[DayGrade.SCORE][Constants.SCOREAVG]),
            "Grade": grade,
            "Calorie Comments": this.score[DayGrade.COMMENTS][Constants.CALORIES],
            "Total Fat Comments": this.score[DayGrade.COMMENTS][Constants.TOTALFAT],
            "Cholesterol Comments": this.score[DayGrade.COMMENTS][Constants.CHOLESTEROL],
            "Sodium Comments": this.score[DayGrade.COMMENTS][Constants.SODIUM],
            "Carbs Comments": this.score[DayGrade.COMMENTS][Constants.CARBS],
            "Fiber Comments": this.score[DayGrade.COMMENTS][Constants.FIBER],
            "Sugar Comments": this.score[DayGrade.COMMENTS][Constants.SUGAR],
            "Protein Comments": this.score[DayGrade.COMMENTS][Constants.PROTEIN]
        }

        localStorage.setItem(`${active}Score`, JSON.stringify(scoreData))
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
        this.score[DayGrade.AMOUNTS] = dayTotal
    }

    basicGradeRubric(type, value) {
        switch (type) {
            case Constants.CALORIES:
                if (value > 4000) {
                    this.score[DayGrade.COMMENTS][Constants.CALORIES] = "Way too many calories!";
                    return 0;
                }
                if (value > 2500) {
                    this.score[DayGrade.COMMENTS][Constants.CALORIES] = "Could use less calories.";
                    return this.normalize(4000, 2500, value);
                }
                if (value > 1500) {
                    this.score[DayGrade.COMMENTS][Constants.CALORIES] = "Good job! You are around the ideal calorie count.";
                    return DayGrade.MAX_SCORE;
                }
                if (value > 1000) {
                    this.score[DayGrade.COMMENTS][Constants.CALORIES] = "Not enough calories, you need a little more to stay healty.";
                    return this.normalize(1000, 1500, value);
                }
                this.score[DayGrade.COMMENTS][Constants.CALORIES] = "You don't have nearly enough calories, you will starve!";
                return 0;
            case Constants.TOTALFAT:
                if (value > 100) {
                    this.score[DayGrade.COMMENTS][Constants.TOTALFAT] = "Way too many fats!";
                    return 0;
                }
                if (value > 50) {
                    this.score[DayGrade.COMMENTS][Constants.TOTALFAT] = "Could use fewer fats.";
                    return this.normalize(100, 50, value);
                }
                if (value > 25) {
                    this.score[DayGrade.COMMENTS][Constants.TOTALFAT] = "Good amount of fats.";
                    return DayGrade.MAX_SCORE;
                }
                if (value > 0) {
                    this.score[DayGrade.COMMENTS][Constants.TOTALFAT] = "Could use a little more fats!";
                    return this.normalize(0, 25, value);
                }
                this.score[DayGrade.COMMENTS][Constants.TOTALFAT] = "You need more fats!";
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
                    this.score[DayGrade.COMMENTS][Constants.TOTALFAT] = this.score[DayGrade.COMMENTS][Constants.TOTALFAT] + " Also way too much transfat!";
                    return 0;
                }
                if (value > 1) {
                    this.score[DayGrade.COMMENTS][Constants.TOTALFAT] = this.score[DayGrade.COMMENTS][Constants.TOTALFAT] + " Also could use less transfat!";
                    return this.normalize(5, 1, value);
                }
                return DayGrade.MAX_SCORE;
            case Constants.CHOLESTEROL:
                if (value > 500) {
                    this.score[DayGrade.COMMENTS][Constants.CHOLESTEROL] = "Way too much cholesterol!";
                    return 0;
                }
                if (value > 200) {
                    this.score[DayGrade.COMMENTS][Constants.CHOLESTEROL] = "Could use less cholesterol.";
                    return 0.75 * this.normalize(500, 200, value);
                }
                if (value > 0) {
                    this.score[DayGrade.COMMENTS][Constants.CHOLESTEROL] = "Good amount of cholesterol.";
                    return 0.75 * DayGrade.MAX_SCORE + 0.25 * this.normalize(200, 0, value);
                }
                this.score[DayGrade.COMMENTS][Constants.CHOLESTEROL] = "Good job keeping cholesterol low!";
                return DayGrade.MAX_SCORE;
            case Constants.SODIUM:
                if (value > 4000) {
                    this.score[DayGrade.COMMENTS][Constants.SODIUM] = "Way too much sodium!";
                    return 0;
                }
                if (value > 2300) {
                    this.score[DayGrade.COMMENTS][Constants.SODIUM] = "Could use less sodium.";
                    return 0.9 * this.normalize(4000, 2300, value);
                }
                if (value > 1500) {
                    this.score[DayGrade.COMMENTS][Constants.SODIUM] = "Good amount of sodium.";
                    return 0.9 * DayGrade.MAX_SCORE + 0.1 * this.normalize(2300, 1500, value);
                }
                if (value > 500) {
                    this.score[DayGrade.COMMENTS][Constants.SODIUM] = "Great job keeping sodium amount low!";
                    return DayGrade.MAX_SCORE;
                }
                if (value > 0) {
                    this.score[DayGrade.COMMENTS][Constants.SODIUM] = "Could use a little more sodium.";
                    return this.normalize(0, 500, value);
                }
                this.score[DayGrade.COMMENTS][Constants.SODIUM] = "Way too little sodium! Sodium is required for your body to function.";
                return 0;
            case Constants.CARBS:
                if (value > 500) {
                    this.score[DayGrade.COMMENTS][Constants.CARBS] = "Way too many carbs!";
                    return 0;
                }
                if (value > 275) {
                    this.score[DayGrade.COMMENTS][Constants.CARBS] = "Could use less carbs.";
                    return this.normalize(500, 275, value);
                }
                if (value > 200) {
                    this.score[DayGrade.COMMENTS][Constants.CARBS] = "Good amount of carbs!";
                    return DayGrade.MAX_SCORE;
                }
                if (value > 150) {
                    this.score[DayGrade.COMMENTS][Constants.CARBS] = "Could use a few more carbs.";
                    return 0.5 * DayGrade.MAX_SCORE + 0.5 * this.normalize(150, 200, value);
                }
                if (value > 50) {
                    this.score[DayGrade.COMMENTS][Constants.CARBS] = "Need more carbs.";
                    return 0.5 * this.normalize(50, 150, value);
                }
                this.score[DayGrade.COMMENTS][Constants.CARBS] = "Need way more carbs, carbs are necessary for your diet!";
                return 0;
            case Constants.FIBER:
                if (value > 100) {
                    this.score[DayGrade.COMMENTS][Constants.FIBER] = "Way too much fiber!";
                    return 0;
                }
                if (value > 38) {
                    this.score[DayGrade.COMMENTS][Constants.FIBER] = "Too much fiber, get a little less.";
                    return this.normalize(100, 38, value);
                }
                if (value > 28) {
                    this.score[DayGrade.COMMENTS][Constants.FIBER] = "Perfect amount of fiber!";
                    return DayGrade.MAX_SCORE;
                }
                if (value > 0) {
                    this.score[DayGrade.COMMENTS][Constants.FIBER] = "Need some more fiber.";
                    return this.normalize(0, 28, value);
                }
                this.score[DayGrade.COMMENTS][Constants.FIBER] = "Not nearly enough fiber!";
                return 0;
            case Constants.SUGAR:
                if (value > 150) {
                    this.score[DayGrade.COMMENTS][Constants.SUGAR] = "Way too much sugar!";
                    return 0;
                }
                if (value > 80) {
                    this.score[DayGrade.COMMENTS][Constants.SUGAR] = "Too much sugar.";
                    return 0.5 * this.normalize(150, 80, value);
                }
                if (value > 50) {
                    this.score[DayGrade.COMMENTS][Constants.SUGAR] = "A little too much sugar!";
                    return 0.5 * DayGrade.MAX_SCORE + 0.5 * this.normalize(80, 50, value);
                }
                this.score[DayGrade.COMMENTS][Constants.SUGAR] = "Good job keeping sugar low!";
                return DayGrade.MAX_SCORE;
            case Constants.PROTEIN:
                if (value > 150) {
                    this.score[DayGrade.COMMENTS][Constants.PROTEIN] = "That is a ton of protein, are you a body builder?!";
                    return 0.5 * DayGrade.MAX_SCORE;
                }
                if (value > 75) {
                    this.score[DayGrade.COMMENTS][Constants.PROTEIN] = "That is a lot of protein, are you an athelete?";
                    return 0.5 * DayGrade.MAX_SCORE + 0.5 * this.normalize(150, 75, value);
                }
                if (value > 50) {
                    this.score[DayGrade.COMMENTS][Constants.PROTEIN] = "Perfect amount of protein!";
                    return DayGrade.MAX_SCORE;
                }
                if (value > 20) {
                    this.score[DayGrade.COMMENTS][Constants.PROTEIN] = "That is not enough protein, add some more.";
                    return this.normalize(20, 50, value);
                }
                this.score[DayGrade.COMMENTS][Constants.PROTEIN] = "That is not nearly enough protein, add some more!";
                return 0;
        }
    }

    // This is used to interpolate between values for scoring 
    // Bottom = 0, top = 1
    normalize(bottom, top, value) {
        return ((value - bottom) / (top - bottom)) * DayGrade.MAX_SCORE;
    }
}