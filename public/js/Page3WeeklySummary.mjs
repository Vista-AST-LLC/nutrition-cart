import { Constants, DayGrade, Weekday } from "./common.mjs"

let reload = true;
if (reload) {
    reload = false;
    await fillGrades();
}

async function getDays() {
    let monday = new DayGrade(await Weekday.fromJSON(JSON.parse(localStorage.getItem('Monday'))));
    monday.circ = 'monPointsCircle';
    monday.underCirc = 'monUnderPointCircle';
    monday.comments = 'monComments';
    let tuesday = new DayGrade(await Weekday.fromJSON(JSON.parse(localStorage.getItem('Tuesday'))));
    tuesday.circ = 'tuesPointsCircle';
    tuesday.underCirc = 'tuesUnderPointCircle';
    tuesday.comments = 'tuesComments';
    let wednesday = new DayGrade(await Weekday.fromJSON(JSON.parse(localStorage.getItem('Wednesday'))));
    wednesday.circ = 'wedPointsCircle';
    wednesday.underCirc = 'wedUnderPointCircle';
    wednesday.comments = 'wedComments'
    let thursday = new DayGrade(await Weekday.fromJSON(JSON.parse(localStorage.getItem('Thursday'))));
    thursday.circ = 'thursPointsCircle';
    thursday.underCirc = 'thursUnderPointCircle';
    thursday.comments = 'thursComments';
    let friday = new DayGrade(await Weekday.fromJSON(JSON.parse(localStorage.getItem('Friday'))));
    friday.circ = 'friPointsCircle';
    friday.underCirc = 'friUnderPointCircle';
    friday.comments = 'friComments';

    return [monday, tuesday, wednesday, thursday, friday];
}

async function fillGrades() {
    let days = await getDays();
    days.forEach(day => {
        let grade = day.score[DayGrade.SCORE][Constants.SCOREAVG];
        if (grade > 90) {
            document.getElementById(day.circ).innerHTML = 'A';
            document.getElementById(day.comments).innerHTML = 'Great job with this day! No more work needed here!';
        } else if (grade > 80) {
            document.getElementById(day.circ).innerHTML = 'B';
            document.getElementById(day.comments).innerHTML = 'Pretty good work!';
        } else if (grade > 70) {
            document.getElementById(day.circ).innerHTML = 'C';
            document.getElementById(day.comments).innerHTML = 'Not too bad, but could you do better?';
        } else if (grade > 60) {
            document.getElementById(day.circ).innerHTML = 'D';
            document.getElementById(day.comments).innerHTML = 'This day needs some more work, go back to the Activity page click on this day, then click on Grade Day. It will tell you what needs fixing.';
        } else {
            document.getElementById(day.circ).innerHTML = 'F';
            document.getElementById(day.comments).innerHTML = 'This day needs some more work, go back to the Activity page click on this day, then click on Grade Day. It will tell you what needs fixing.';
        }

        document.getElementById(day.underCirc).innerHTML = Math.round(grade);
    });
}