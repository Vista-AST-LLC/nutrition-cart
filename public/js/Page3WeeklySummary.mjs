document.addEventListener('DOMContentLoaded', async function () {
    console.log("Page Loaded!")

    let monData = await populateData('mon');
    let tuesData = await populateData('tues');
    let wedData = await populateData('wed');
    let thursData = await populateData('thurs');
    let friData = await populateData('fri');

    updateHTML("mondayScore", "mondayComments", "mondayGrade", monData);
    updateHTML("tuesdayScore", "tuesdayComments", "tuesdayGrade", tuesData);
    updateHTML("wednesdayScore", "wednesdayComments", "wednesdayGrade", wedData);
    updateHTML("thursdayScore", "thursdayComments", "thursdayGrade", thursData);
    updateHTML("fridayScore", "fridayComments", "fridayGrade", friData);

})

async function populateData(dayString) {
    let data;

    try {
        data = JSON.parse(localStorage.getItem(`${dayString}Score`));
    } catch (error) {
        data = null
        console.error(error)
    }

    return data
}

async function updateHTML(score, comments, grade, data) {

    if (!data) {
        console.log("Data is null")
        return;
    }
    else {
        console.log("Data is not null: " + data)
        document.getElementById(score).innerHTML = `${Math.round(data["Score"])}`
        document.getElementById(grade).innerHTML = `Grade: ${data["Grade"]}`
        document.getElementById(comments).innerHTML = `                   
    <ul>
        <li>${data["Calorie Comments"]}</li>
        <li>${data["Carbs Comments"]}</li>
        <li>${data["Cholesterol Comments"]}</li>
        <li>${data["Fiber Comments"]}</li>
        <li>${data["Protein Comments"]}</li>
        <li>${data["Sodium Comments"]}</li>
        <li>${data["Sugar Comments"]}</li>
        <li>${data["Total Fat Comments"]}</li>
    </ul>`
    }
}