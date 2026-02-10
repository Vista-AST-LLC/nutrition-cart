//********THINGS TO CONSIDER********
//1) How to access correct meal index from localStorage and add it 
//2) Parameters to add into updateTable() (Day, meal, etc)?
//3) How to remove values from calendar

// Function to update the table calendar
export function updateTable(day, meal) {
    let breakfast = meals["breakfast"]
    let lunch = meals["lunch"]
    let dinner = meals["dinner"]
    let snacks = meals["snacks"]

    switch (day) {
        case "Monday":
            switch (meal) {
                case "breakfast":
                    let monBfast = document.getElementById("monBfast")
                    updateHTML(monBfast, meal[0])
                    break
                case "lunch":
                    let monLunch = document.getElementById('monLunch')
                    updateHTML(monLunch, text)
                    break
                case "dinner":
                    let monDinner = document.getElementById('monDinner')
                    updateHTML(monDinner, text)
                    break
                case "snack":
                    let monSnack = document.getElementById('monSnack')
                    updateHTML(monSnack, text)
                    break
                default:
                    alert("No meal was selected!")
            }
            break
        case "Tuesday":
            switch (meal) {
                case "breakfast":
                    let tuesBfast = document.getElementById("tuesBfast")
                    updateHTML(tuesBfast, text)
                    break
                case "lunch":
                    let tuesLunch = document.getElementById('tuesLunch')
                    updateHTML(tuesLunch, text)
                    break
                case "dinner":
                    let tuesDinner = document.getElementById('tuesDinner')
                    updateHTML(tuesDinner, text)
                    break
                case "snack":
                    let tuesSnack = document.getElementById('tuesSnack')
                    updateHTML(tuesSnack, text)
                    break
                default:
                    alert("No meal was selected!")
            }
            break
        case "Wednesday":
            switch (meal) {
                case "breakfast":
                    let wedBfast = document.getElementById("wedBfast")
                    updateHTML(wedBfast, text)
                    break
                case "lunch":
                    let wedLunch = document.getElementById('wedLunch')
                    updateHTML(wedLunch, text)
                    break
                case "dinner":
                    let wedDinner = document.getElementById('wedDinner')
                    updateHTML(wedDinner, text)
                    break
                case "snack":
                    let wedSnack = document.getElementById('wedSnack')
                    updateHTML(wedSnack, text)
                    break
                default:
                    alert("No meal was selected!")
            }
            break
        case "Thursday":
            switch (meal) {
                case "breakfast":
                    let thursBfast = document.getElementById("thursBfast")
                    updateHTML(thursBfast, text)
                    break
                case "lunch":
                    let thursLunch = document.getElementById('thursLunch')
                    updateHTML(thursLunch, text)
                    break
                case "dinner":
                    let thursDinner = document.getElementById('thursDinner')
                    updateHTML(thursDinner, text)
                    break
                case "snack":
                    let thursSnack = document.getElementById('thursSnack')
                    updateHTML(thursSnack, text)
                    break
                default:
                    alert("No meal was selected!")
            }
            break
        case "Friday":
            switch (meal) {
                case "breakfast":
                    let friBfast = document.getElementById("friBfast")
                    updateHTML(friBfast, text)
                    break
                case "lunch":
                    let friLunch = document.getElementById('friLunch')
                    updateHTML(friLunch, text)
                    break
                case "dinner":
                    let friDinner = document.getElementById('friDinner')
                    updateHTML(friDinner, text)
                    break
                case "snack":
                    let friSnack = document.getElementById('friSnack')
                    updateHTML(friSnack, text)
                    break
                default:
                    alert("No meal was selected!")
            }
            break
        default:
            alert("No day was selected!")
    }
}

async function updateHTML(tag, food) {

    let listItem = document.createElement('li')

    listItem.innerHTML = `
        <h4>${food}</h4>
    `

    tag.appendChild(listItem)
}


export function clearTable() {
    //Clearing all lists

    localStorage.removeItem('testArray')
    //Getting day ul by ID
    let monBfast = document.getElementById('monBfast');
    let monLunch = document.getElementById('monLunch');
    let monDinner = document.getElementById('monDinner');
    let monSnack = document.getElementById('monSnack');

    let tuesBfast = document.getElementById('tuesBfast');
    let tuesLunch = document.getElementById('tuesLunch');
    let tuesDinner = document.getElementById('tuesDinner');
    let tuesSnack = document.getElementById('tuesSnack');

    let wedBfast = document.getElementById('wedBfast');
    let wedLunch = document.getElementById('wedLunch');
    let wedDinner = document.getElementById('wedDinner');
    let wedSnack = document.getElementById('wedSnack');

    let thursBfast = document.getElementById('thursBfast');
    let thursLunch = document.getElementById('thursLunch');
    let thursDinner = document.getElementById('thursDinner');
    let thursSnack = document.getElementById('thursSnack');

    let friBfast = document.getElementById('friBfast');
    let friLunch = document.getElementById('friLunch');
    let friDinner = document.getElementById('friDinner');
    let friSnack = document.getElementById('friSnack');

    //Setting ul element to empty
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
}

async function updateBackgroundColor(day, dayTwo, dayThree, dayFour) {

    document.getElementById(day).style.backgroundColor = 'lightgray';
    document.getElementById(dayTwo).style.backgroundColor = 'lightgray';
    document.getElementById(dayThree).style.backgroundColor = 'lightgray';
    document.getElementById(dayFour).style.backgroundColor = 'lightgray';
}

async function resetBackgroundColor(mon, tues, wed, thur, fri) {
    document.getElementById(mon).style.backgroundColor = 'lightgray';
    document.getElementById(tues).style.backgroundColor = 'lightgray';
    document.getElementById(wed).style.backgroundColor = 'lightgray';
    document.getElementById(thur).style.backgroundColor = 'lightgray';
    document.getElementById(fri).style.backgroundColor = 'lightgray';
}

//Function to Select the Active Day
async function setActiveDay(day) {
    switch (day) {
        case 'M':
            localStorage.setItem("ActiveDay", 'Monday')
            document.getElementById('monday').style.backgroundColor = 'lightgoldenrodyellow'
            updateBackgroundColor('tuesday', 'wednesday', 'thursday', 'friday')
            window.location.href = '../html/Page3Activity.html'
            break;
        case 'T':
            localStorage.setItem("ActiveDay", 'Tuesday')
            document.getElementById('tuesday').style.backgroundColor = 'lightgoldenrodyellow'
            updateBackgroundColor('monday', 'wednesday', 'thursday', 'friday')
            window.location.href = '../html/Page3Activity.html'
            break;
        case 'W':
            localStorage.setItem("ActiveDay", 'Wednesday')
            document.getElementById('wednesday').style.backgroundColor = 'lightgoldenrodyellow'
            updateBackgroundColor('monday', 'tuesday', 'thursday', 'friday')
            window.location.href = '../html/Page3Activity.html'
            break;
        case 'TH':
            localStorage.setItem("ActiveDay", 'Thursday')
            document.getElementById('thursday').style.backgroundColor = 'lightgoldenrodyellow'
            updateBackgroundColor('monday', 'tuesday', 'wednesday', 'friday')
            window.location.href = '../html/Page3Activity.html'
            break;
        case 'F':
            localStorage.setItem("ActiveDay", 'Friday')
            document.getElementById('friday').style.backgroundColor = 'lightgoldenrodyellow'
            updateBackgroundColor('monday', 'tuesday', 'wednesday', 'thursday')
            window.location.href = '../html/Page3Activity.html'
            break;
        default:
            resetBackgroundColor('monday', 'tuesday', 'wednesday', 'thursday', 'friday')
            break;
    }
}

window.setActiveDay = setActiveDay