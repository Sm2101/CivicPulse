import { db, auth, authReady } from "./firebase.js";

import {
    ref, get
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

    let reportsRef = ref(db, "reports");
    let snapshot = await get(reportsRef);
    let reportsData = snapshot.val();
    let reports = reportsData ? Object.values(reportsData) : [];

    let adminPanel = document.getElementById("admin-reports");

    let total = document.getElementById("total");
    total.textContent = reports.length;

    let pendingReports = reports.filter(function(report) {
        return report.status === "Pending";
    });

    let pending = document.getElementById("pending")
    pending.textContent = pendingReports.length

    let resolvedReports = reports.filter(function(report) {
        return report.status === "Resolved";
    });
    resolved.textContent = resolvedReports.length;

    reports.forEach(function(report) {
        console.log(report.title);

        let card = document.createElement("div");
        card.className = "card";
        let p1 = document.createElement("p");
        p1.textContent = "ReportID:"+ report.id;
        card.appendChild(p1);
        let p2 = document.createElement("p")
        p2.textContent = "Title:" + report.title;
        card.appendChild(p2);
        let p3 = document.createElement("p")
        p3.textContent = "Type:" + report.type;
        card.appendChild(p3);
        let p4 = document.createElement("p")
        p4.textContent = "Description:" + report.description;
        card.appendChild(p4);
        let p5 = document.createElement("p")
        p5.textContent = "Location:" + report.location;
        card.appendChild(p5);
        let p6 = document.createElement("p")
        p6.textContent = "Status:" + report.status;
        card.appendChild(p6);

        adminPanel.appendChild(card);
    })

}
loadReports().catch(function(error) {
    console.error("Error loading reports:", error);
});