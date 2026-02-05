// Function to update the table calendar
function updateTable(e) {
    e.preventDefault();

    text = document.getElementById("foodInput").value;
    meal = document.getElementById("mealSelect").value
    day = document.getElementById("daySelect").value

    test = [text, meal, day]
    localStorage.setItem('testArray', test)

    switch (day) {
        case "sunday":
            switch (meal) {
                case "breakfast":
                    sunBfast = document.getElementById("sunBfast")
                    updateHTML(sunBfast, text)
                    break
                case "lunch":
                    sunLunch = document.getElementById('sunLunch')
                    updateHTML(sunLunch, text)
                    break
                case "dinner":
                    sunDinner = document.getElementById('sunDinner')
                    updateHTML(sunDinner, text)
                    break
                case "snack":
                    sunSnack = document.getElementById('sunSnack')
                    updateHTML(sunSnack, text)
                    break
                default:
                    alert("No meal was selected!")
            }
            break
        case "monday":
            switch (meal) {
                case "breakfast":
                    monBfast = document.getElementById("monBfast")
                    updateHTML(monBfast, text)
                    break
                case "lunch":
                    monLunch = document.getElementById('monLunch')
                    updateHTML(monLunch, text)
                    break
                case "dinner":
                    monDinner = document.getElementById('monDinner')
                    updateHTML(monDinner, text)
                    break
                case "snack":
                    monSnack = document.getElementById('monSnack')
                    updateHTML(monSnack, text)
                    break
                default:
                    alert("No meal was selected!")
            }
            break
        case "tuesday":
            switch (meal) {
                case "breakfast":
                    tuesBfast = document.getElementById("tuesBfast")
                    updateHTML(tuesBfast, text)
                    break
                case "lunch":
                    tuesLunch = document.getElementById('tuesLunch')
                    updateHTML(tuesLunch, text)
                    break
                case "dinner":
                    tuesDinner = document.getElementById('tuesDinner')
                    updateHTML(tuesDinner, text)
                    break
                case "snack":
                    tuesSnack = document.getElementById('tuesSnack')
                    updateHTML(tuesSnack, text)
                    break
                default:
                    alert("No meal was selected!")
            }
            break
        case "wednesday":
            switch (meal) {
                case "breakfast":
                    wedBfast = document.getElementById("wedBfast")
                    updateHTML(wedBfast, text)
                    break
                case "lunch":
                    wedLunch = document.getElementById('wedLunch')
                    updateHTML(wedLunch, text)
                    break
                case "dinner":
                    wedDinner = document.getElementById('wedDinner')
                    updateHTML(wedDinner, text)
                    break
                case "snack":
                    wedSnack = document.getElementById('wedSnack')
                    updateHTML(wedSnack, text)
                    break
                default:
                    alert("No meal was selected!")
            }
            break
        case "thursday":
            switch (meal) {
                case "breakfast":
                    thursBfast = document.getElementById("thursBfast")
                    updateHTML(thursBfast, text)
                    break
                case "lunch":
                    thursLunch = document.getElementById('thursLunch')
                    updateHTML(thursLunch, text)
                    break
                case "dinner":
                    thursDinner = document.getElementById('thursDinner')
                    updateHTML(thursDinner, text)
                    break
                case "snack":
                    thursSnack = document.getElementById('thursSnack')
                    updateHTML(thursSnack, text)
                    break
                default:
                    alert("No meal was selected!")
            }
            break
        case "friday":
            switch (meal) {
                case "breakfast":
                    friBfast = document.getElementById("friBfast")
                    updateHTML(friBfast, text)
                    break
                case "lunch":
                    friLunch = document.getElementById('friLunch')
                    updateHTML(friLunch, text)
                    break
                case "dinner":
                    friDinner = document.getElementById('friDinner')
                    updateHTML(friDinner, text)
                    break
                case "snack":
                    friSnack = document.getElementById('friSnack')
                    updateHTML(friSnack, text)
                    break
                default:
                    alert("No meal was selected!")
            }
            break
        case "saturday":
            switch (meal) {
                case "breakfast":
                    satBfast = document.getElementById("satBfast")
                    updateHTML(satBfast, text)
                    break
                case "lunch":
                    satLunch = document.getElementById('satLunch')
                    updateHTML(satLunch, text)
                    break
                case "dinner":
                    satDinner = document.getElementById('satDinner')
                    updateHTML(satDinner, text)
                    break
                case "snack":
                    satSnack = document.getElementById('satSnack')
                    updateHTML(satSnack, text)
                    break
                default:
                    alert("No meal was selected!")
            }
            break
        default:
            alert("No day was selected!")
    }

    document.getElementById("daySelect").value = 'sunday'
    document.getElementById('mealSelect').value = 'breakfast'
    document.getElementById('foodInput').value = ''
}

function updateHTML(tag, food) {

    const listItem = document.createElement('li')

    listItem.innerHTML = `
        <h4>${food}</h4>
    `

    tag.appendChild(listItem)
}

function clearTable(e) {
    e.preventDefault()
    //Clearing all lists

    localStorage.removeItem('testArray')
    //Getting day ul by ID
    sunBfast = document.getElementById('sunBfast');
    sunLunch = document.getElementById('sunLunch');
    sunDinner = document.getElementById('sunDinner');
    sunSnack = document.getElementById('sunSnack');

    monBfast = document.getElementById('monBfast');
    monLunch = document.getElementById('monLunch');
    monDinner = document.getElementById('monDinner');
    monSnack = document.getElementById('monSnack');

    tuesBfast = document.getElementById('tuesBfast');
    tuesLunch = document.getElementById('tuesLunch');
    tuesDinner = document.getElementById('tuesDinner');
    tuesSnack = document.getElementById('tuesSnack');

    wedBfast = document.getElementById('wedBfast');
    wedLunch = document.getElementById('wedLunch');
    wedDinner = document.getElementById('wedDinner');
    wedSnack = document.getElementById('wedSnack');

    thursBfast = document.getElementById('thursBfast');
    thursLunch = document.getElementById('thursLunch');
    thursDinner = document.getElementById('thursDinner');
    thursSnack = document.getElementById('thursSnack');

    friBfast = document.getElementById('friBfast');
    friLunch = document.getElementById('friLunch');
    friDinner = document.getElementById('friDinner');
    friSnack = document.getElementById('friSnack');

    satBfast = document.getElementById('satBfast');
    satLunch = document.getElementById('satLunch');
    satDinner = document.getElementById('satDinner');
    satSnack = document.getElementById('satSnack');

    //Setting ul element to empty
    sunBfast.innerHTML = ''
    sunLunch.innerHTML = ''
    sunDinner.innerHTML = ''
    sunSnack.innerHTML = ''

    monBfast.innerHTML = ''
    monLunch.innerHTML = ''
    monDinner.innerHTML = ''
    monSnack.innerHTML = ''

    tuesBfast.innerHTML = ''
    tuesLunch.innerHTML = ''
    tuesDinner.innerHTML = ''
    tuesSnack.innerHTML = ''

    wedBfast.innerHTML = ''
    wedLunch.innerHTML = ''
    wedDinner.innerHTML = ''
    wedSnack.innerHTML = ''

    thursBfast.innerHTML = ''
    thursLunch.innerHTML = ''
    thursDinner.innerHTML = ''
    thursSnack.innerHTML = ''

    friBfast.innerHTML = ''
    friLunch.innerHTML = ''
    friDinner.innerHTML = ''
    friSnack.innerHTML = ''

    satBfast.innerHTML = ''
    satLunch.innerHTML = ''
    satDinner.innerHTML = ''
    satSnack.innerHTML = ''
}