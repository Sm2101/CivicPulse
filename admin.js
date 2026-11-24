
import { db, auth, authReady } from "./firebase.js";

import {
    ref,
    get,
    update
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-database.js";

const adminUID = "7GxQDQPZuHV5PnO7RTjCX3pwkk62";

async function checkAdmin() {

    await authReady;

    let user = auth.currentUser;

    if (!user || user.uid !== adminUID) {
        window.location.href = "admin-login.html";
        return false;
    }

    return true;
}

async function loadReports() {

    let isAdmin = await checkAdmin();

    if (!isAdmin) {
        return;
    }

    let reportsSnapshot = await get(ref(db, "reports"));
    let trackingSnapshot = await get(ref(db, "tracking"));

    let reports = reportsSnapshot.val() || {};
    let tracking = trackingSnapshot.val() || {};

    // Prepare tracking records for older reports
    let migrationUpdates = {};

    for (let key in reports) {

        if (!tracking[key]) {

            migrationUpdates["tracking/" + key] = {
                id: reports[key].id,
                status: reports[key].status || "Pending"
            };

        }

    }

    // Save missing tracking records
    if (Object.keys(migrationUpdates).length > 0) {

        await update(ref(db), migrationUpdates);

        // Add migrated records to local data
        for (let key in reports) {

            if (!tracking[key]) {
                tracking[key] = {
                    id: reports[key].id,
                    status: reports[key].status || "Pending"
                };
            }

        }

    }

    let adminPanel = document.getElementById("admin-reports");

    adminPanel.innerHTML = "";

    let reportKeys = Object.keys(reports);

    let total = document.getElementById("total");
    let pending = document.getElementById("pending");
    let resolved = document.getElementById("resolved");

    let pendingCount = 0;
    let resolvedCount = 0;

    reportKeys.forEach(function(key) {

        let report = reports[key];
        let status = tracking[key]?.status || "Pending";

        if (status === "Pending") {
            pendingCount++;
        }

        if (status === "Resolved") {
            resolvedCount++;
        }

        let card = document.createElement("div");
        card.className = "card";

        function addText(label, value) {

            let p = document.createElement("p");
            p.textContent = label + ": " + value;
            card.appendChild(p);

        }

        addText("Report ID", report.id);
        addText("Title", report.title);
        addText("Type", report.type);
        addText("Description", report.description);
        addText("Location", report.location);
        addText("Status", status);

        let statusSelect = document.createElement("select");

        ["Pending", "In Progress", "Resolved"].forEach(function(optionValue) {

            let option = document.createElement("option");
            option.value = optionValue;
            option.textContent = optionValue;

            if (optionValue === status) {
                option.selected = true;
            }

            statusSelect.appendChild(option);

        });

        let updateButton = document.createElement("button");
        updateButton.textContent = "Update Status";

        updateButton.addEventListener("click", async function() {

            try {

                await update(
                    ref(db, "tracking/" + key),
                    { status: statusSelect.value }
                );

                alert("Report status updated!");

                loadReports();

            } catch (error) {

                console.error("Status update failed:", error);
                alert("Could not update status.");

            }

        });

        card.appendChild(statusSelect);
        card.appendChild(updateButton);

        adminPanel.appendChild(card);

    });

    total.textContent = reportKeys.length;
    pending.textContent = pendingCount;
    resolved.textContent = resolvedCount;

}

loadReports().catch(function(error) {
    console.error("Error loading reports:", error);
});
