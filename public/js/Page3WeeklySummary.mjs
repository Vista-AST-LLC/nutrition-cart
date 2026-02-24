import { Constants, DayGrade, Weekday } from "./common.mjs"

let reload = true;
if (reload) {
    reload = false;
    await fillGrades();
}

async function getDays() {
    let monday = new DayGrade(await Weekday.fromJSON(JSON.parse(localStorage.getItem('Monday'))));
    monday.id = 'monPointsCircle';
    monday.id2 = 'monUnderPointCircle';
    let tuesday = new DayGrade(await Weekday.fromJSON(JSON.parse(localStorage.getItem('Tuesday'))));
    tuesday.id = 'tuesPointsCircle';
    tuesday.id2 = 'tuesUnderPointCircle';
    let wednesday = new DayGrade(await Weekday.fromJSON(JSON.parse(localStorage.getItem('Wednesday'))));
    wednesday.id = 'wedPointsCircle';
    wednesday.id2 = 'wedUnderPointCircle';
    let thursday = new DayGrade(await Weekday.fromJSON(JSON.parse(localStorage.getItem('Thursday'))));
    thursday.id = 'thursPointsCircle';
    thursday.id2 = 'thursUnderPointCircle';
    let friday = new DayGrade(await Weekday.fromJSON(JSON.parse(localStorage.getItem('Friday'))));
    friday.id = 'friPointsCircle';
    friday.id2 = 'friUnderPointCircle';

    return [monday, tuesday, wednesday, thursday, friday];
}

async function fillGrades() {
    let days = await getDays();
    days.forEach(day => {
        let grade = day.score[DayGrade.SCORE][Constants.SCOREAVG];
        if (grade > 90) document.getElementById(day.id).innerHTML = 'A';
        else if (grade > 80) document.getElementById(day.id).innerHTML = 'B';
        else if (grade > 70) document.getElementById(day.id).innerHTML = 'C';
        else if (grade > 60) document.getElementById(day.id).innerHTML = 'D';
        else document.getElementById(day.id).innerHTML = 'F';

        document.getElementById(day.id2).innerHTML = Math.round(grade);
    });
}