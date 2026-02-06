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
}

// This function call should be wrapped in a try-catch
export async function createFoodItem(barcode) {
    // Fetch the csv and convert it to a string
    const itemData = await fetch("../../Nutrition-Cart-Data(Updated).csv")
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

    console.log(itemRows[lineNumber]);

    return new FoodItem(itemRows[lineNumber]);
}

export class FoodItem {
    constructor(data){
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

    static copyFoodItems(copyTo, copyFrom) {
        while (copyFrom.breakfast.length > 0) {
            copyTo.addFoodItem(copyFrom.breakfast[0]);
            copyFrom.breakfast.shift();
        }
        while (copyFrom.lunch.length > 0) {
            copyTo.addFoodItem(copyFrom.lunch[0]);
            copyFrom.lunch.shift();
        }
        while (copyFrom.dinner.length > 0) {
            copyTo.addFoodItem(copyFrom.dinner[0]);
            copyFrom.dinner.shift();
        }
        while (copyFrom.snacks.length > 0) {
            copyTo.addFoodItem(copyFrom.snacks[0]);
            copyFrom.snacks.shift();
        }
    }

    addFoodItem(item) {
        // Do a switch on the first char of the ref number (B, L, D, S)
        switch (item.refNumber.charAt(0)) {
        case Constants.BREAKFAST:
            // Add the item's record of its position
            item.arrayIndex = this.breakfast.length;
            // Add the item to the array
            this.breakfast.push(item);
            break;
        case Constants.LUNCH:
            item.arrayIndex = this.lunch.length;
            this.lunch.push(item);
            break;
        case Constants.DINNER:
            item.arrayIndex = this.dinner.length;
            this.dinner.push(item);
            break;
        case Constants.SNACKS:
            item.arrayIndex = this.snacks.length;
            this.snacks.push(item);
            break;
        }
    }

    // The idea behind this removeFoodItem method is as follows:
    // Preserve FoodItem order keep each FoodItem.arrayIndex correct.
    removeFoodItem(meal, index) {
        let countDown = index;
        let countUp = index+1;
        switch (meal) {
            case Constants.BREAKFAST:
                // This simultaneously counts up and down from the stating index and continues until 
                // both the countDown has reached 0 and the countUp has reached the length of the array
                while ((test1 = countDown > 0) || (test2 = countUp < this.breakfast.length)) {
                    // The countDown is for moving elements at and below the starting index
                    // one slot to the right, which overrides the to-be-removed item and
                    // moves every element below the starting index one to the right
                    if (test1) {
                        this.breakfast[countDown] = this.breakfast[countDown-1];
                        countDown--;
                    }
                    // The countUp is for updating all FoodItems.arrayIndex above the removed item index
                    if (test2) {
                        this.breakfast[index].arrayIndex -= 1;
                        index++;
                    }
                    // This shifts every element in the array one to the left, effectively undoing the 
                    // right-ward move in countDown (meaning they keep the same position in the array) and
                    // moving every element above the starting index to be one lower, to reflect the 
                    // update to arrayIndex that was done in countUp
                    this.breakfast.shift();
                }
                break;
            case Constants.LUNCH:
                while ((test1 = countDown > 0) || (test2 = countUp < this.lunch.length)) {
                    if (test1) {
                        this.lunch[countDown] = this.lunch[countDown-1];
                        countDown--;
                    }
                    if (test2) {
                        this.lunch[index].arrayIndex -= 1;
                        index++;
                    }
                    this.lunch.shift();
                }
                break;
            case Constants.DINNER:
                while ((test1 = countDown > 0) || (test2 = countUp < this.dinner.length)) {
                    if (test1) {
                        this.dinner[countDown] = this.dinner[countDown-1];
                        countDown--;
                    }
                    if (test2) {
                        this.dinner[index].arrayIndex -= 1;
                        index++;
                    }
                    this.dinner.shift();
                }
                break;
            case Constants.SNACKS:
                while ((test1 = countDown > 0) || (test2 = countUp < this.snacks.length)) {
                    if (test1) {
                        this.snacks[countDown] = this.snacks[countDown-1];
                        countDown--;
                    }
                    if (test2) {
                        this.snacks[index].arrayIndex -= 1;
                        index++;
                    }
                    this.snacks.shift();
                }
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