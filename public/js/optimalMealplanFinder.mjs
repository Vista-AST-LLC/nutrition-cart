import { createFoodItem, Weekday, DayGrade, Constants } from "./common.mjs";

class OptimalMealplanFinder {
    constructor() {}

    mealplan;
    matchesToSkip;
    currentMatch;
    grade;
    currentAmounts = [];

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
    ]
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
    ]

    static allFoodItems = [
        BD01, BD02, BD03, BD04, BD05, BM01, BM02, BM03, BM04, BM05, BM06, BM07, BM08, BS01, BS02, BS03, BS04, BS05, BS06, BS07, 
        DD01, DD02, DD03, DD04, DD05, DM01, DM02, DM03, DM04, DM05, DM06, DM07, DS01, DS02, DS03, DS04, DS05, DS06, DS07, DS08, 
        LD01, LD02, LD03, LD04, LD05, LM01, LM02, LM03, LM04, LM05, LM06, LM07, LM08, LS01, LS02, LS03, LS04, LS05, LS06, LS07, 
        SD01, SD02, SD03, SD04, SD05, SD06, SD07, SD08, SD09, SD10, SS01, SS02, SS03, SS04, SS05, SS06, SS07, SS08, SS09, SS10
    ]

    findOptimalMealplan(skipFirstNMatches = 0) {
        this.matchesToSkip = skipFirstNMatches;
        this.currentMatch = 0;
        useableFoodItems = [];
        day = new Weekday();
        for (item in allFoodItems) {
            objItem = createFoodItem(item);
            pass = this.rateFoodItem(objItem);
            if (pass) useableFoodItems.push(objItem);
        }

        return doTheThing(useableFoodItems, day);
    }

    rateFoodItem(item) {
        if (item.caloriesG > this.upperThreshold[Constants.CALORIES]) return false;
        if (item.totalFatG > this.upperThreshold[Constants.TOTALFAT]) return false;
        if (item.satFatG > this.upperThreshold[Constants.SATFAT]) return false;
        if (item.transFatG > this.upperThreshold[Constants.TRANSFAT]) return false;
        if (item.cholesterolMG > this.upperThreshold[Constants.CHOLESTEROL]) return false;
        if (item.sodiumMG > this.upperThreshold[Constants.SODIUM]) return false;
        if (item.carbsG > this.upperThreshold[Constants.CARBS]) return false;
        if (item.fiberG > this.upperThreshold[Constants.FIBER]) return false;
        if (item.sugarsG > this.upperThreshold[Constants.SUGAR]) return false;
        if (item.proteinG > this.upperThreshold[Constants.PROTEIN]) return false;
        return true;
    }

    doTheThing(useableFoodItems, day) {
        if (day.breakfast.length = 0) {
            // add next breakfast item from useableFoodItems
            // If there is no next breakfast item, that should mean we have reached the end
            // of all useable item combinations and should end the recursion.
            // doTheThing()
        } 
        if (day.lunch.length = 0) {
            // add next lunch item from useableFoodItems
            // If there is no next lunch item, then we should pop the last breakfast item added
            // and continue
            // doTheThing()
        }
        if (day.dinner.length = 0) {
            // add next dinner item from useableFoodItems
            // If there is no next dinner item, pop the last lunch item
            // doTheThing()
        }
        if (day.snacks.length = 0) {
            // add next snack item from useableFoodItems
            // If there is no next snack item, pop the last dinner item
            // doTheThing()
        }

        // This can be used to get the amounts in each category,
        // accessable by this.currentAmounts[Constants.{CALORIES,SUGAR,etc.}]
        DayGrade.accumulateTotals(day, this.currentAmounts)


    }
}