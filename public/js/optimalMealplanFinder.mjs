import { createFoodItem, Weekday, DayGrade, Constants } from "./common.mjs";

export class OptimalMealplanFinder {
    constructor() {}

    static upperErr = 1.15;
    static lowerErr = 0.85;

    // From light testing, this appears to increase the average calerie amount, which was consistently too low before
    static potentialsMult = [
        0.3, // CALORIES = 0;
        1.0, // TOTALFAT = 1;
        1.0, // SATFAT = 2;
        1.0, // TRANSFAT = 3;
        1.0, // CHOLESTEROL = 4;
        1.0, // SODIUM = 5;
        1.0, // CARBS = 6;
        1.0, // FIBER = 7;
        1.0, // SUGAR = 8;
        1.0, // PROTEIN = 9;
    ];

    static upperThreshold = [
        2499.9, // CALORIES = 0;
        49.9,   // TOTALFAT = 1;
        9.9,    // SATFAT = 2;
        0.9,    // TRANSFAT = 3;
        199.9,  // CHOLESTEROL = 4;
        1499.9, // SODIUM = 5;
        274.9,  // CARBS = 6;
        37.9,   // FIBER = 7;
        49.9,   // SUGAR = 8;
        74.9    // PROTEIN = 9;
    ];

    static lowerThreshold = [
        1500, // CALORIES = 0;
        25,   // TOTALFAT = 1;
        0,    // SATFAT = 2;
        0,    // TRANSFAT = 3;
        0,    // CHOLESTEROL = 4;
        500,  // SODIUM = 5;
        200,  // CARBS = 6;
        28,   // FIBER = 7;
        0,    // SUGAR = 8;
        50    // PROTEIN = 9;
    ];

    static allFoodItems = [
        'BD01', 'BD02', 'BD03', 'BD05', 'BM01', 'BM02', 'BM03', 'BM04', 'BM05', 'BM06', 'BM07', 'BM08', 'BS01', 'BS02', 'BS03', 'BS04', 'BS05', 'BS06', 'BS07', 
        'DD01', 'DD02', 'DD04', 'DD05', /*'DM01', */'DM02', 'DM03', 'DM04', 'DM05', 'DM06', 'DM07', 'DS01', 'DS02', 'DS03', 'DS04', 'DS05', 'DS06', 'DS07', 'DS08', 
        'LD01', 'LD02', 'LD04', 'LD05', 'LM01', 'LM02', 'LM03', 'LM04', 'LM05', 'LM06', 'LM07', 'LM08', 'LS01', 'LS02', 'LS03', 'LS04', 'LS05', 'LS06', 'LS07', 
        'SD01', 'SD02', 'SD03', 'SD04', 'SD05', 'SD06', 'SD07', 'SD08', 'SD09', 'SD10', 'SS01', 'SS02', 'SS03', 'SS04', 'SS05', 'SS06', 'SS07', 'SS08', 'SS09', 'SS10'
    ];

    avgUpperLower(index) {
        return (OptimalMealplanFinder.lowerThreshold[index] + OptimalMealplanFinder.upperThreshold[index]) / 2;
    }

    random(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }

    async findMealplan() {
        let attemptsInWhileLoop = 0;
        const usedItems = new Set();
        const useableItems = [];

        const mealplan = new Weekday();

        const currentCatScore = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        let averageScore = 0;

        function rateFoodItem(item) {
            if (item.calories > OptimalMealplanFinder.upperThreshold[Constants.CALORIES]) return false;
            if (item.totalFatG > OptimalMealplanFinder.upperThreshold[Constants.TOTALFAT]) return false;
            if (item.satFatG > OptimalMealplanFinder.upperThreshold[Constants.SATFAT]) return false;
            if (item.transFatG > OptimalMealplanFinder.upperThreshold[Constants.TRANSFAT]) return false;
            if (item.cholesterolMG > OptimalMealplanFinder.upperThreshold[Constants.CHOLESTEROL]) return false;
            if (item.sodiumMG > OptimalMealplanFinder.upperThreshold[Constants.SODIUM]) return false;
            if (item.carbsG > OptimalMealplanFinder.upperThreshold[Constants.CARBS]) return false;
            if (item.fiberG > OptimalMealplanFinder.upperThreshold[Constants.FIBER]) return false;
            if (item.sugarsG > OptimalMealplanFinder.upperThreshold[Constants.SUGAR]) return false;
            if (item.proteinG > OptimalMealplanFinder.upperThreshold[Constants.PROTEIN]) return false;
            return true;
        }

        for (const item of OptimalMealplanFinder.allFoodItems) {
            const foodItem = await createFoodItem(item); 
            const pass = rateFoodItem(foodItem);
            if (pass) useableItems.push(foodItem);
        }

        const itemPotential = (item) => {
            let potential = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            potential[Constants.CALORIES] = item.calories / this.avgUpperLower(Constants.CALORIES) * OptimalMealplanFinder.potentialsMult[0];
            potential[Constants.TOTALFAT] = item.totalFatG / this.avgUpperLower(Constants.TOTALFAT) * OptimalMealplanFinder.potentialsMult[1];
            potential[Constants.SATFAT] = item.satFatG / this.avgUpperLower(Constants.SATFAT) * OptimalMealplanFinder.potentialsMult[2];
            potential[Constants.TRANSFAT] = item.transFatG / this.avgUpperLower(Constants.TRANSFAT) * OptimalMealplanFinder.potentialsMult[3];
            potential[Constants.CHOLESTEROL] = item.cholesterolMG / this.avgUpperLower(Constants.CHOLESTEROL) * OptimalMealplanFinder.potentialsMult[4];
            potential[Constants.SODIUM] = item.sodiumMG / this.avgUpperLower(Constants.SODIUM) * OptimalMealplanFinder.potentialsMult[5];
            potential[Constants.CARBS] = item.carbsG / this.avgUpperLower(Constants.CARBS) * OptimalMealplanFinder.potentialsMult[6];
            potential[Constants.FIBER] = item.fiberG / this.avgUpperLower(Constants.FIBER) * OptimalMealplanFinder.potentialsMult[7];
            potential[Constants.SUGAR] = item.sugarsG / this.avgUpperLower(Constants.SUGAR) * OptimalMealplanFinder.potentialsMult[8];
            potential[Constants.PROTEIN] = item.proteinG / this.avgUpperLower(Constants.PROTEIN) * OptimalMealplanFinder.potentialsMult[9];

            return potential;
        }

        const addItem = (item) => {
            usedItems.add(item.refNumber);
            mealplan.addFoodItem(item);
            let potential = itemPotential(item);
            for (let i = 0; i < 10; i++) {
                currentCatScore[i] += potential[i];
            }
        }

        const removeItem = (item) => {
            let itemIsRemoved = false;
            let counter = 0;
            usedItems.delete(item.refNumber)
            switch (item.refNumber[0]) {
                case 'B':
                    while (!itemIsRemoved) {
                        if (mealplan.breakfast[counter].refNumber == item.refNumber) {
                            mealplan.removeFoodItem('B', counter);
                            let potential = itemPotential(item);
                            for (let i = 0; i < 10; i ++) {
                                currentCatScore[i] -= potential[i];
                            }
                            itemIsRemoved = true;
                        }
                        counter++;
                    }
                    break;
                case 'L':
                    while (!itemIsRemoved) {
                        if (mealplan.lunch[counter].refNumber == item.refNumber) {
                            mealplan.removeFoodItem('L', counter);
                            let potential = itemPotential(item);
                            for (let i = 0; i < 10; i ++) {
                                currentCatScore[i] -= potential[i];
                            }
                            itemIsRemoved = true;
                        }
                        counter++;
                    }
                    break;
                case 'D':
                    while (!itemIsRemoved) {
                        if (mealplan.dinner[counter].refNumber == item.refNumber) {
                            mealplan.removeFoodItem('D', counter);
                            let potential = itemPotential(item);
                            for (let i = 0; i < 10; i ++) {
                                currentCatScore[i] -= potential[i];
                            }
                            itemIsRemoved = true;
                        }
                        counter++;
                    }
                    break;
                case 'S':
                    while (!itemIsRemoved) {
                        if (mealplan.snacks[counter].refNumber == item.refNumber) {
                            mealplan.removeFoodItem('S', counter);
                            let potential = itemPotential(item);
                            for (let i = 0; i < 10; i ++) {
                                currentCatScore[i] -= potential[i];
                            }
                            itemIsRemoved = true;
                        }
                        counter++;
                    }
                    break;
            }
        }

        while (averageScore < OptimalMealplanFinder.lowerErr || averageScore > OptimalMealplanFinder.upperErr) {
            attemptsInWhileLoop++;

            if (attemptsInWhileLoop % 10000 == 0) {
                console.log("0000");
            }
            // Ensure at the beginning of the loop, each meal has at least 1 item
            if (mealplan.breakfast.length < 1) {
                let selectedItem = useableItems[this.random(0, useableItems.length)];
                while (selectedItem.refNumber[0] != 'B' || usedItems.has(selectedItem.refNumber)) {
                    selectedItem = useableItems[this.random(0, useableItems.length)];
                }
                addItem(selectedItem);
            }
            if (mealplan.lunch.length < 1) {
                let selectedItem = useableItems[this.random(0, useableItems.length)];
                while (selectedItem.refNumber[0] != 'L' || usedItems.has(selectedItem.refNumber)) {
                    selectedItem = useableItems[this.random(0, useableItems.length)];
                }
                addItem(selectedItem);           
            }
            if (mealplan.dinner.length < 1) {
                let selectedItem = useableItems[this.random(0, useableItems.length)];
                while (selectedItem.refNumber[0] != 'D' || usedItems.has(selectedItem.refNumber)) {
                    selectedItem = useableItems[this.random(0, useableItems.length)];
                }
                addItem(selectedItem);             
            }
            if (mealplan.snacks.length < 1) {
                let selectedItem = useableItems[this.random(0, useableItems.length)];
                while (selectedItem.refNumber[0] != 'S' || usedItems.has(selectedItem.refNumber)) {
                    selectedItem = useableItems[this.random(0, useableItems.length)];
                }
                addItem(selectedItem);            
            }

            function checkIfAboveMax() {
                for (let i = 0; i < 10; i++) {
                    if (currentCatScore[i] > OptimalMealplanFinder.upperErr) return true;
                }
                return false;
            }

            while (checkIfAboveMax()) {
                let index = this.random(0, useableItems.length);
                if (usedItems.has(useableItems[index].refNumber)) {
                    removeItem(useableItems[index]);
                }
            }
            
            useableItems.sort(() => Math.random() - 0.5);

            let attempts = 0;
            let hasFound = false;
            while (attempts < 50 && !hasFound) {
                attempts++;
                let index = this.random(0, useableItems.length);
                if (usedItems.has(useableItems[index].refNumber)) continue;
                const item = useableItems[index];

                const potential = itemPotential(item);
                let pointsCounter = 0;
                for (let i = 0; i < 10; i++) {
                    if (currentCatScore[i] + potential[i] < OptimalMealplanFinder.upperErr) pointsCounter++;
                }
                if (pointsCounter > 8) {
                    hasFound = true;
                    addItem(item);
                }
            }
            if (attempts >= 50) {
                let addedRandItem = false;
                while (!addedRandItem) {
                    let index = this.random(0, useableItems.length);
                    if (!usedItems.has(useableItems[index].refNumber)) {
                        addItem(useableItems[index]);
                        addedRandItem = true;
                    }
                }
            }

            let theScore = 0;
            for (let i = 0; i < 10; i++) {
                theScore += currentCatScore[i];
            }
            averageScore = theScore / 10;
        }
        return mealplan;
    }
}