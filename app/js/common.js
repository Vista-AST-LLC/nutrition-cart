// The total amount of cards we have
const MAX_CARDS = 80;

async function createFoodItem(barcode) {
    // Fetch the csv and convert it to a string
    const rawcsv = fetch("../Nutrition-Cart-Data(Updated).csv");
    const itemData = rawcsv.text();

    // Split the itemData string by row (delineated by \n), 
    // then remove the first line (the names of columns)
    const itemRows = itemData.split('\n').slice(1);

    // Get the first comma separated entry from each item row (barcode ref)
    const refNumArray = itemRows.map(refNum => {
        return refNum.split(',')[0];
    })

    // Using the refNumArray, match the item we are looking for
    let lineNumber = 0;
    let foundCard = true;
    for (; !barcode.match(refNumArray[lineNumber]); lineNumber++) {
        // If the line number is greater than the amount of cards we have, break
        if (lineNumber > MAX_CARDS) {
            foundCard = false;
            break;
        }
    }

    // Throw error for no barcode match
    if (!foundCard) throw Error("Failed to find barcode match!");

    return foodItem(itemRows[lineNumber]);
}

class foodItem {
    constructor(data){
        const item = data.split(',');
        this.#refNumber = item[0];
        this.#itemName = item[1];
        this.#portionSize = item[2];
        this.#calories = parseFloat(item[3]);
        this.#proteinG = parseFloat(item[4]);
        this.#proteinDV = item[5];
        this.#sodiumMG = parseFloat(item[6]);
        this.#sodiumDV = item[7];
        this.#totalFatG = parseFloat(item[8]);
        this.#totalFatDV = item[9];
        this.#carbsG = parseFloat(item[10]);
        this.#carbsDV = item[11];
        this.#fiberG = parseFloat(item[12]);
        this.#fiberDV = item[13];
        this.#cholesterolMG = parseFloat(item[14]);
        this.#cholesterolDV = item[15];
        this.#satFatG = parseFloat(item[16]);
        this.#satFatDV = item[17];
        this.#transFatG = parseFloat(item[18]);
        this.#transFatDV = item[19];
        this.#sugarsG = parseFloat(item[20]);
        this.#sugarsDV = item[21];
    }

    // These are in the same order they appear in the csv
    #refNumber;
    get refNumber() { return this.#refNumber; }
    #itemName;
    get itemName() { return this.#itemName; }
    #portionSize;
    get portionSize() { return this.#portionSize; }
    #calories;
    get calories() { return this.#calories; }
    #proteinG;
    get proteinG() { return this.#proteinG; }
    #proteinDV;
    get proteinDV() { return this.#proteinDV; }
    #sodiumMG;
    get sodiumMG() { return this.#sodiumMG; }
    #sodiumDV;
    get sodiumDV() { return this.#sodiumDV; }
    #totalFatG;
    get totalFatG() { return this.#totalFatG; }
    #totalFatDV;
    get totalFatDV() { return this.#totalFatDV; }
    #carbsG;
    get carbsG() { return this.#carbsG; }
    #carbsDV;
    get carbsDV() { return this.#carbsDV; }
    #fiberG;
    get fiberG() { return this.#fiberG; }
    #fiberDV;
    get fiberDV() { return this.#fiberDV; }
    #cholesterolMG;
    get cholesterolMG() { return this.#cholesterolMG; }
    #cholesterolDV;
    get cholesterolDV() { return this.#cholesterolDV; }
    #satFatG;
    get satFatG() { return this.#satFatG; }
    #satFatDV;
    get satFatDV() { return this.#satFatDV; }
    #transFatG;
    get transFatG() { return this.#transFatG; }
    #transFatDV;
    get transFatDV() { return this.#transFatDV; }
    #sugarsG;
    get sugarsG() { return this.#sugarsG; }
    #sugarsDV;
    get sugarsDV() { return this.#sugarsDV; }
}