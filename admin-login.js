import { auth } from "./firebase.js";

import {
    signInWithEmailAndPassword,
    signOut
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-auth.js";

const adminUID = "7GxQDQPZuHV5PnO7RTjCX3pwkk62";
let form = document.getElementById("admin-login-form");

let message = document.getElementById("login-message");

message.textContent = "";

form.addEventListener("submit", async function(event) {
        event.preventDefault();

    let email = document.getElementById("admin-email").value;
    let password = document.getElementById("admin-password").value;
    try{
    let userCredential = await signInWithEmailAndPassword(auth, email, password);
    let user = userCredential.user;

    if (user.uid === adminUID) {
        message.textContent = "Admin login successful!";
        window.location.href = "admin.html";
    } else {
        message.textContent = "Access denied. You are not an administrator.";
        await signOut(auth);
    }

    console.log(user.uid);
    } catch(error) {
        if (error.code === "auth/invalid-credential") {
            message.textContent = "Incorrect email or password.";
        } else {
            message.textContent = "Login failed. Please try again.";
        }    }
});