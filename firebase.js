
import { initializeApp } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-app.js";

import { getDatabase } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-database.js";

import {
    getAuth,
    signInAnonymously
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyAcZWq24faFM-4SKL1_1PhbN4NuNPyrgBM",
    authDomain: "civic--pulse.firebaseapp.com",
    databaseURL: "https://civic--pulse-default-rtdb.asia-southeast1.firebasedatabase.app/",
    projectId: "civic--pulse",
    storageBucket: "civic--pulse.firebasestorage.app",
    messagingSenderId: "1084438424380",
    appId: "1:1084438424380:web:be9034ecf198edf8370c39"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);
const authReady = signInAnonymously(auth);

export { db, authReady };
