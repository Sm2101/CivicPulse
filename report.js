
import { db, ensureAnonymousAuth } from "./firebase.js";

import {
    ref,
    push,
    update
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-database.js";

let projectName = "Civic Pulse";
console.log(projectName);

let form = document.getElementById("report-form");

form.addEventListener("submit", async function(event) {

    event.preventDefault();

    let title = document.getElementById("issue-title").value.trim();
    let type = document.getElementById("issue-type").value;
    let description = document.getElementById("description").value.trim();
    let location = document.getElementById("location").value.trim();

    let reportID = generateReportID();

    let message = document.getElementById("success-message");

    try {
        await ensureAnonymousAuth();

        // Generate one Firebase key for both records
        let newReportRef = push(ref(db, "reports"));
        let reportKey = newReportRef.key;

        let updates = {};

        // Store private report details
        updates["reports/" + reportKey] = {
            id: reportID,
            title: title,
            type: type,
            description: description,
            location: location
        };

        // Store public tracking information
        updates["tracking/" + reportKey] = {
            id: reportID,
            status: "Pending"
        };

        // Save both records atomically
        await update(ref(db), updates);

        message.textContent =
            "Reported! Your report ID is: " + reportID;

        console.log("Report saved:", reportID);

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
