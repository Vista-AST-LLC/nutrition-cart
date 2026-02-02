//Rendering Calendar Feature
document.addEventListener('DOMContentLoaded', function () {
    const calendarEl = document.getElementById('calendar')
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridWeek',
        headerToolbar: {
            start: '', // will normally be on the left. if RTL, will be on the right
            center: 'title',
            end: '' // will normally be on the right. if RTL, will be on the left
        },
        titleFormat: {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }
    })
    calendar.render()
})

function myFunction() {
    var x = document.getElementById("mainNav");
    if (x.className === "nav") {
        x.className += "responsive";
    } else {
        x.className = "nav";
    }
}


