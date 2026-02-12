//********THINGS TO CONSIDER********
//1) Updating HTML on Page2Calendar using JavaScript from Page3Activity
//2) How to access correct meal index from localStorage and add it 
//3) How to remove values from calendar

// Function to update the table calendar
export function updateTable(day, meal, data) {
    let breakfast = data["breakfast"]
    let lunch = data["lunch"]
    let dinner = data["dinner"]
    let snacks = data["snacks"]

    switch (day) {
        case "Monday":
            switch (meal) {
                case "B":
                    console.log(breakfast[0]["itemName"])
                    /*let monBfast = document.getElementById("monBfast")
                    updateHTML(monBfast, breakfast[0]["itemName"])*/
                    break
                case "L":
                    console.log(lunch[0]["itemName"])
                    let monLunch = document.getElementById('monLunch')
                    updateHTML(monLunch, lunch[0]["itemName"])
                    break
                case "D":
                    console.log(dinner[0]["itemName"])
                    let monDinner = document.getElementById('monDinner')
                    updateHTML(monDinner, dinner[0]["itemName"])
                    break
                case "S":
                    console.lot(snacks[0]["itemName"])
                    let monSnack = document.getElementById('monSnack')
                    updateHTML(monSnack, snacks[0]["itemName"])
                    break
                default:
                    alert("No meal was selected!")
            }
            break
        case "Tuesday":
            switch (meal) {
                case "B":
                    let tuesBfast = document.getElementById("tuesBfast")
                    updateHTML(tuesBfast, breakfast[0]["itemName"])
                    break
                case "L":
                    let tuesLunch = document.getElementById('tuesLunch')
                    updateHTML(tuesLunch, lunch[0]["itemName"])
                    break
                case "D":
                    let tuesDinner = document.getElementById('tuesDinner')
                    updateHTML(tuesDinner, dinner[0]["itemName"])
                    break
                case "S":
                    let tuesSnack = document.getElementById('tuesSnack')
                    updateHTML(tuesSnack, snacks[0]["itemName"])
                    break
                default:
                    alert("No meal was selected!")
            }
            break
        case "Wednesday":
            switch (meal) {
                case "B":
                    let wedBfast = document.getElementById("wedBfast")
                    updateHTML(wedBfast, breakfast[0]["itemName"])
                    break
                case "L":
                    let wedLunch = document.getElementById('wedLunch')
                    updateHTML(wedLunch, lunch[0]["itemName"])
                    break
                case "D":
                    let wedDinner = document.getElementById('wedDinner')
                    updateHTML(wedDinner, dinner[0]["itemName"])
                    break
                case "S":
                    let wedSnack = document.getElementById('wedSnack')
                    updateHTML(wedSnack, snacks[0]["itemName"])
                    break
                default:
                    alert("No meal was selected!")
            }
            break
        case "Thursday":
            switch (meal) {
                case "B":
                    let thursBfast = document.getElementById("thursBfast")
                    updateHTML(thursBfast, breakfast[0]["itemName"])
                    break
                case "L":
                    let thursLunch = document.getElementById('thursLunch')
                    updateHTML(thursLunch, lunch[0]["itemName"])
                    break
                case "D":
                    let thursDinner = document.getElementById('thursDinner')
                    updateHTML(thursDinner, dinner[0]["itemName"])
                    break
                case "S":
                    let thursSnack = document.getElementById('thursSnack')
                    updateHTML(thursSnack, snacks[0]["itemName"])
                    break
                default:
                    alert("No meal was selected!")
            }
            break
        case "Friday":
            switch (meal) {
                case "B":
                    let friBfast = document.getElementById("friBfast")
                    updateHTML(friBfast, breakfast[0]["itemName"])
                    break
                case "L":
                    let friLunch = document.getElementById('friLunch')
                    updateHTML(friLunch, lunch[0]["itemName"])
                    break
                case "D":
                    let friDinner = document.getElementById('friDinner')
                    updateHTML(friDinner, dinner[0]["itemName"])
                    break
                case "S":
                    let friSnack = document.getElementById('friSnack')
                    updateHTML(friSnack, snacks[0]["itemName"])
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