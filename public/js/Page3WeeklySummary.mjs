import { Constants, DayGrade, Weekday } from "./common.mjs"

document.addEventListener('DOMContentLoaded', async function () {
    console.log("Page Loaded!")

    await fillGrades();

})

async function getDays() {
    let monday = new DayGrade(await Weekday.fromJSON(JSON.parse(localStorage.getItem('Monday'))));
    monday.grade = 'mondayGrade';
    monday.rating = 'mondayScore';
    monday.comments = 'mondayComments';
    let tuesday = new DayGrade(await Weekday.fromJSON(JSON.parse(localStorage.getItem('Tuesday'))));
    tuesday.grade = 'tuesdayGrade';
    tuesday.rating = 'tuesdayScore';
    tuesday.comments = 'tuesdayComments';
    let wednesday = new DayGrade(await Weekday.fromJSON(JSON.parse(localStorage.getItem('Wednesday'))));
    wednesday.grade = 'wednesdayGrade';
    wednesday.rating = 'wednesdayScore';
    wednesday.comments = 'wednesdayComments'
    let thursday = new DayGrade(await Weekday.fromJSON(JSON.parse(localStorage.getItem('Thursday'))));
    thursday.grade = 'thursdayGrade';
    thursday.rating = 'thursdayScore';
    thursday.comments = 'thursdayComments';
    let friday = new DayGrade(await Weekday.fromJSON(JSON.parse(localStorage.getItem('Friday'))));
    friday.grade = 'fridayGrade';
    friday.rating = 'fridayScore';
    friday.comments = 'fridayComments';

    return [monday, tuesday, wednesday, thursday, friday];
}

async function fillGrades() {
    let days = await getDays();
    days.forEach(day => {
        let grade = day.score[DayGrade.SCORE][Constants.SCOREAVG];
        if (grade > 90) {
            document.getElementById(day.grade).innerHTML = 'A';
        } else if (grade > 80) {
            document.getElementById(day.grade).innerHTML = 'B';
        } else if (grade > 70) {
            document.getElementById(day.grade).innerHTML = 'C';
        } else if (grade > 60) {
            document.getElementById(day.grade).innerHTML = 'D';
        } else {
            document.getElementById(day.grade).innerHTML = 'F';
        }

        document.getElementById(day.comments).innerHTML = `                   
    <ul>
        <li>${day.score[DayGrade.COMMENTS][Constants.CALORIES]}</li>
        <li>${day.score[DayGrade.COMMENTS][Constants.TOTALFAT]}</li>
        <li>${day.score[DayGrade.COMMENTS][Constants.CHOLESTEROL]}</li>
        <li>${day.score[DayGrade.COMMENTS][Constants.SODIUM]}</li>
        <li>${day.score[DayGrade.COMMENTS][Constants.CARBS]}</li>
        <li>${day.score[DayGrade.COMMENTS][Constants.FIBER]}</li>
        <li>${day.score[DayGrade.COMMENTS][Constants.SUGAR]}</li>
        <li>${day.score[DayGrade.COMMENTS][Constants.PROTEIN]}</li>
    </ul>`

        document.getElementById(day.rating).innerHTML = `Your score is: ${Math.round(grade)}`;
    });
}