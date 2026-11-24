
import { db, ensureAnonymousAuth } from "./firebase.js";
import {
    ref,
    push,
    set
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-database.js";

let projectName = "Civic Pulse";
console.log(projectName);

let form = document.getElementById("report-form");

form.addEventListener("submit", async function(event) {

    event.preventDefault();

    let title = document.getElementById("issue-title").value;
    let type = document.getElementById("issue-type").value;
    let description = document.getElementById("description").value;
    let location = document.getElementById("location").value;

    let reportID = generateReportID();

    let report = {
        id: reportID,
        title: title,
        type: type,
        description: description,
        location: location,
        status: "Pending"
    };

    let message = document.getElementById("success-message");

    try {

        await ensureAnonymousAuth();
        let newReportRef = push(ref(db, "reports"));

        await set(newReportRef, report);

        message.textContent =
            "Reported! Your report ID is: " + reportID;

        console.log("Report saved:", report);

        form.reset();

    } catch (error) {
        console.error("Firebase error:", error);
        message.textContent =
            "Report could not be submitted. Please try again.";
    }
});

function generateReportID() {
    let year = new Date().getFullYear();
    let month = new Date().getMonth() + 1;
    let randomNum = Math.floor(Math.random() * 10000);

    return "CP-" + year + month + "-" + randomNum;
}
