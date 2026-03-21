import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDZdLxppl2HXTtw2cgdFFFcDIFH5yx9vDY",
    authDomain: "raquelpmu1.firebaseapp.com",
    projectId: "raquelpmu1",
    storageBucket: "raquelpmu1.firebasestorage.app",
    messagingSenderId: "81115737255",
    appId: "1:81115737255:web:8b71ecb791666d9a263f82"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log('🔥 Firebase conectado!');
window.db = db;
