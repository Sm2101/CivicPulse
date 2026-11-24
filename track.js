
import { db, ensureAnonymousAuth } from "./firebase.js";

import {
    ref,
    get,
    query,
    orderByChild,
    equalTo
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-database.js";

let form = document.getElementById("track-report");

form.addEventListener("submit", async function(event) {

    event.preventDefault();

    let searchID = document.getElementById("tracking-id").value.trim();

    let result = document.getElementById("tracking-result");

    result.textContent = "Searching...";

    try {
        // Wait for authentication
        await ensureAnonymousAuth;

        // Create Firebase search query
        let reportQuery = query(
            ref(db, "reports"),
            orderByChild("id"),
            equalTo(searchID)
        );

        // Get matching reports
        let snapshot = await get(reportQuery);

        if (snapshot.exists()) {

            let reports = snapshot.val();

            // Get the first matching report
            let foundReport = Object.values(reports)[0];

            result.textContent =
                "Report ID: " + foundReport.id + "\n" +
                "Title: " + foundReport.title + "\n" +
                "Type: " + foundReport.type + "\n" +
                "Description: " + foundReport.description + "\n" +
                "Location: " + foundReport.location + "\n" +
                "Status: " + foundReport.status;

            console.log(foundReport);

        } else {

            result.textContent =
                "Report not found. Please check your Report ID.";

        }

    } catch (error) {

        console.error("Firebase error:", error);

        result.textContent =
            "Unable to retrieve report. Please try again.";

    }

});
