//Rendering Calendar Feature
document.addEventListener('DOMContentLoaded', function () {
    const calendarEl = document.getElementById('calendar')
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridWeek',
        headerToolbar: {
            start: '',
            center: 'title',
            end: ''
        },
        titleFormat: {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }
    })
    calendar.render()

    document.getElementById('submitBtn').addEventListener('click', function () {
        day = document.getElementById("daySelect").value
        meal = document.getElementById("mealSelect").value

        if (typeof meal == "string") {
            color = determineColor(meal)

            var newEvent = {
                title: meal,
                start: '2026-02-02',
                description: meal,
                color: color,
                textColor: "black"
            }
            console.log(newEvent)
            calendar.addEvent(newEvent)
        }
        else {
            alert("Cannot enter a number! Please enter a text value!")
        }

    })
})

//Determines the color used as the background of calendar event based on meal type  
function determineColor(meal) {

    if (meal == "breakfast") {
        return "yellow"
    }
    else if (meal == "lunch") {
        return "green"
    }
    else if (meal == "dinner") {
        return "orange"
    }
    else if (meal == "snack") {
        return "lavender"
    }
    else {
        return ""
    }
}

function handleSubmit(e) {
    e.preventDefault();

    text = document.getElementById("foodInput");

}


