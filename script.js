import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";

import {
    getDatabase,
    ref,
    onValue
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-database.js";


// ================= FIREBASE =================

const firebaseConfig = {
    apiKey:"AIzaSyAqMANJ3hfwhwUsXBcA1plgudmLk16SGnA", 
    authDomain: "kisanqueue-3f950.firebaseapp.com",
    databaseURL: "https://kisanqueue-3f950-default-rtdb.firebaseio.com",
    projectId: "kisanqueue-3f950",
    storageBucket: "kisanqueue-3f950.firebasestorage.app",
    messagingSenderId: "227967434572",
    appId: "1:227967434572:web:1e6775e3cb61e994c6d9e9"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);


// ================= TOKEN =================

let tokenNumber = 27;
let notified = false;

function generateToken() {

    let name = document.getElementById("name").value;
    let crop = document.getElementById("crop").value;
    let quantity = document.getElementById("quantity").value;
    let centre = document.getElementById("centre").value;
    let slot = document.getElementById("slot").value;
    let language = document.getElementById("language").value;

    if (name === "" || quantity === "") {

        alert(
            language === "ta"
            ? "பெயர் மற்றும் அளவை நிரப்பவும்"
            : "Please fill Name and Quantity"
        );

        return;
    }

    document.getElementById("yourToken").innerText = tokenNumber;

    if (language === "ta") {

        document.getElementById("result").innerHTML =
            "<h2>🎫 டோக்கன் உருவாக்கப்பட்டது!</h2>" +
            "<h1>டோக்கன் எண்: " + tokenNumber + "</h1>" +
            "<p><b>விவசாயி:</b> " + name + "</p>" +
            "<p><b>பயிர்:</b> " + crop + "</p>" +
            "<p><b>அளவு:</b> " + quantity + " கிலோ</p>" +
            "<p><b>கொள்முதல் மையம்:</b> " + centre + "</p>" +
            "<p><b>நேர இடைவெளி:</b> " + slot + "</p>" +
            "<hr>" +
            "<p>🟡 <b>நிலை:</b> காத்திருக்கிறது</p>";

    } else {

        document.getElementById("result").innerHTML =
            "<h2>🎫 Token Generated!</h2>" +
            "<h1>Token No: " + tokenNumber + "</h1>" +
            "<p><b>Farmer:</b> " + name + "</p>" +
            "<p><b>Crop:</b> " + crop + "</p>" +
            "<p><b>Quantity:</b> " + quantity + " kg</p>" +
            "<p><b>Centre:</b> " + centre + "</p>" +
            "<p><b>Time Slot:</b> " + slot + "</p>" +
            "<hr>" +
            "<p>🟡 <b>Status:</b> Waiting</p>";
    }
}


// ================= SLOT BOOKING =================

function bookSlot(slotName) {

    let language = document.getElementById("language").value;

    if (language === "ta") {

        document.getElementById("bookingResult").innerHTML =
            "<h3>✅ நேரம் முன்பதிவு வெற்றிகரமாக செய்யப்பட்டது!</h3>" +
            "<p><b>தேர்ந்தெடுத்த நேரம்:</b> " + slotName + "</p>" +
            "<p>உங்கள் டோக்கன்: <b>" + tokenNumber + "</b></p>" +
            "<p>தயவுசெய்து நேரத்திற்கு கொள்முதல் மையத்திற்கு செல்லவும்.</p>";

    } else {

        document.getElementById("bookingResult").innerHTML =
            "<h3>✅ Slot Booked Successfully!</h3>" +
            "<p><b>Selected Slot:</b> " + slotName + "</p>" +
            "<p>Your Token is <b>" + tokenNumber + "</b></p>" +
            "<p>Please reach the procurement centre on time.</p>";
    }
}


// ================= LIVE FIREBASE QUEUE =================

function updateQueueFromFirebase(currentToken) {

    let yourToken =
        Number(document.getElementById("yourToken").innerText);

    let peopleAhead = yourToken - currentToken;

    if (peopleAhead < 0) {
        peopleAhead = 0;
    }

    let waitingTime = peopleAhead * 20;

    document.getElementById("currentToken").innerText =
        currentToken;

    document.getElementById("peopleAhead").innerText =
        peopleAhead;

    document.getElementById("waitingTime").innerText =
        waitingTime;

    let language =
        document.getElementById("language").value;
if (currentToken >= yourToken) {
  
if (currentToken >= yourToken && !notified && yourToken > 0) {

    notified = true;

    if (Notification.permission === "granted") {
        new Notification("KisanQueue", {
            body: language === "ta"
                ? "🟢 உங்கள் முறை! கொள்முதல் மையத்திற்கு செல்லவும்."
                : "🟢 Your Turn! Please proceed to the procurement centre."
        });
    }
}
        if (language === "ta") {
            document.getElementById("queueStatus").innerHTML =
                "🟢 உங்கள் முறை";
        } else {
            document.getElementById("queueStatus").innerHTML =
                "🟢 Your Turn";
        }

    } else {

        if (language === "ta") {
            document.getElementById("queueStatus").innerHTML =
                "🟡 காத்திருக்கிறது";
        } else {
            document.getElementById("queueStatus").innerHTML =
                "🟡 Waiting";
        }

        notified = false;
    }
}


// Firebase currentToken listener

const currentTokenRef = ref(database, "queue/currentToken");

onValue(currentTokenRef, (snapshot) => {

    let currentToken = snapshot.val();

    if (currentToken === null) {
        currentToken = 0;
    }

    updateQueueFromFirebase(Number(currentToken));

});


// ================= LANGUAGE =================

function changeLanguage() {

    let language =
        document.getElementById("language").value;

    if (language === "ta") {

        document.querySelector("header p").innerText =
            "விவசாயி கொள்முதல் வரிசை மற்றும் நிலை கண்காணிப்பு";

        document.querySelector(".container h2").innerHTML =
            "👨‍🌾 விவசாயி பதிவு";

        let labels =
            document.querySelectorAll(".container label");

        labels[0].innerText = "விவசாயி பெயர்";
        labels[1].innerText = "மொபைல் எண்";
        labels[2].innerText = "கிராமம்";
        labels[3].innerText = "பயிர்";
        labels[4].innerText = "அளவு (கிலோ)";
        labels[5].innerText = "கொள்முதல் மையம்";
        labels[6].innerText = "நேரத்தை தேர்வு செய்யவும்";

        document.querySelector(".container button").innerHTML =
            "🎫 டோக்கன் பெறும்";

        document.querySelector(".schedule h2").innerHTML =
            "📅 கொள்முதல் அட்டவணை";

        document.querySelector(".queue h2").innerHTML =
            "📊 நேரடி வரிசை நிலை";

    } else {

        location.reload();
    }
}


// ================= TOKEN SEARCH =================

function searchToken() {

    let token =
        Number(document.getElementById("searchToken").value);

    let currentToken =
        Number(document.getElementById("currentToken").innerText);

    let result =
        document.getElementById("searchResult");

    if (token === 0) {

        result.innerHTML =
            "<p>⚠️ Please enter a token number.</p>";

        return;
    }

    if (token < currentToken) {

        result.innerHTML =
            "<h3>✅ Token Served</h3>" +
            "<p>Your token <b>" + token +
            "</b> has already been served.</p>";

    } else if (token === currentToken) {

        result.innerHTML =
            "<h3>🟢 Your Turn!</h3>" +
            "<p>Please proceed to the procurement centre.</p>";

    } else {

        let peopleAhead =
            token - currentToken;

        let waitingTime =
            peopleAhead * 20;

        result.innerHTML =
            "<h3>🟡 Token Waiting</h3>" +
            "<p>Token Number: <b>" + token + "</b></p>" +
            "<p>People Ahead: <b>" + peopleAhead + "</b></p>" +
            "<p>Estimated Waiting Time: <b>" +
            waitingTime + " minutes</b></p>";
    }
}


// ================= MAKE FUNCTIONS AVAILABLE TO HTML =================

window.generateToken = generateToken;
window.bookSlot = bookSlot;
window.changeLanguage = changeLanguage;
window.searchToken = searchToken;