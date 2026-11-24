
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
        await ensureAnonymousAuth();

        let trackingQuery = query(
            ref(db, "tracking"),
            orderByChild("id"),
            equalTo(searchID)
        );

        let snapshot = await get(trackingQuery);

        if (snapshot.exists()) {

            let trackingData = snapshot.val();
            let foundReport = Object.values(trackingData)[0];

            result.textContent =
                "Report ID: " + foundReport.id + "\n" +
                "Status: " + foundReport.status;

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
