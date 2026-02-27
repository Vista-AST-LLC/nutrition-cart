import { Constants, DayGrade, Weekday } from "./common.mjs"
import { clean } from '/vendor/profanity-cleaner/src/index.js'; 

let grade;
let reload = true;
if (reload) {
    reload = false;
    await fillGrades();
}

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

    let totalScore = 0;
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
        totalScore += grade
    });

    grade = Math.round((totalScore / 5) * 100) / 100;
    let avgGrade;

    if (grade > 90) {
        avgGrade = 'A'
    } else if (grade > 80) {
        avgGrade = 'B'
    } else if (grade > 70) {
        avgGrade = 'C'
    } else if (grade > 60) {
        avgGrade = 'D'
    } else {
        avgGrade = 'F'
    }

    document.getElementById("weeklyAvg").innerHTML = `
    <div class="day-container">
        <h2>Weekly Average</h2>
        <div class="points-display">
            <div class="points-circle rainbow">${avgGrade}</div>
            <div class="points-label">Your score for the week: ${grade}</div>
        </div>
        <div></div>                                    
    </div>
    `
}

const userName = document.getElementById('userName');

document.getElementById('submitGrade').addEventListener('click', () => {
    let user = userName.value.trim();
    if (user == '') return;
    user = clean(user);
    let leaderboardEntries = JSON.parse(localStorage.getItem('WeekLeaderboard'));
    let entries = new Map(Object.entries(leaderboardEntries));

    entries.set(user, {score: grade});
    
    let objVersion = JSON.stringify(Object.fromEntries(entries));
    localStorage.setItem('WeekLeaderboard', objVersion);

    document.getElementById('submitGrade').style.visibility = 'hidden';
});