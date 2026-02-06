import { createFoodItem, FoodItem, Weekday, Constants} from "./common.mjs";

const foodCodeInput = document.getElementById('foodCode');
const addFoodButton = document.getElementById('addFoodButton');
addFoodButton.addEventListener('click', addFoodItem);

foodCodeInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        addFoodItem();
    }
});

document.addEventListener("keydown", (e) => {
    // Always focus the input
    if (document.activeElement !== foodCodeInput) {
        foodCodeInput.focus();
    }

    if (e.key === "Shift") return;

    const now = performance.now();
    const isScannerInput = (now - keyLastTime) < 60;
    keyLastTime = now;

    if (!isScannerInput) {
        keyEntry = e.key;
        return;
    }

    if (e.key === "Enter" || e.key === "Tab") {
        if (keyEntry.length > 0) {
            foodCodeInput.value = keyEntry;
            keyEntry = "";
            foodCodeInput.dispatchEvent(
                new KeyboardEvent("keydown", { key: "Enter" })
            );
        }
        return;
    }

    keyEntry += e.key;
});

async function addFoodItem(day) {

    // Hardcoding Monday for testing
    //if (localStorage.getItem("Monday") == null) {
        let monday = new Weekday();
        localStorage.setItem("Monday", JSON.stringify(monday));
        console.log(JSON.stringify(monday));
    //}
    let item;

    const code = foodCodeInput.value.trim().toUpperCase();
    const codeHelp = document.getElementById('codeHelp');

    // Reset visual state
    foodCodeInput.classList.remove('error', 'success');
    codeHelp.classList.add('hidden');

    if (!code) {
        foodCodeInput.classList.add('error');
        codeHelp.textContent = 'Please enter a food code.';
        codeHelp.classList.remove('hidden');
        showMessage('Please enter a food code.', 'error');
        return;
    }

    try {
        item = await createFoodItem(code);
    } catch (e) {
        codeHelp.textContent = 'Error: ' + e.message;
        codeHelp.classList.remove('hidden');
        showMessage('Food with code "${code}" not found.', 'error');
        foodCodeInput.value = '';
        return; 
    }

    // If all checks pass, add the item
    day = new Weekday();
    Weekday.copyFoodItems(day, JSON.parse(localStorage.getItem("Monday")));
    day.addFoodItem(item);

    // Clear the input field after successful addition
    foodCodeInput.value = '';
    foodCodeInput.classList.remove('error', 'success');
    codeHelp.classList.add('hidden');

    showMessage("Added: ${foodItem['Item Name']}", 'success');
}

const messageDiv = document.getElementById('message');

export function showMessage(message, type) {
    messageDiv.textContent = message;
    messageDiv.className = type;
    messageDiv.classList.remove('hidden');

    // Announce to screen readers
    messageDiv.setAttribute('aria-live', 'polite');

    setTimeout(() => {
        messageDiv.classList.add('hidden');
    }, 3000);
}