import { auth } from "./firebase.js";

import {
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-auth.js";

let form = document.getElementById("admin-login-form");

let message = document.getElementById("login-message");

form.addEventListener("submit", async function(event) {
        event.preventDefault();

    let email = document.getElementById("admin-email").value;
    let password = document.getElementById("admin-password").value;
    try{
    let userCredential = await signInWithEmailAndPassword(auth, email, password);
    let user = userCredential.user;

    console.log(user.uid);
    } catch(error) {
        message.textContent = "Something went Wrong."+ error.message;
    }
});