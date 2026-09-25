import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { getFirestore, doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAnYq7zNqvp3g_tZjz6C_o6scQqFZoBndM",
  authDomain: "tic-tac-toe-aura-2acca.firebaseapp.com",
  databaseURL: "https://tic-tac-toe-aura-2acca-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "tic-tac-toe-aura-2acca",
  storageBucket: "tic-tac-toe-aura-2acca.firebasestorage.app",
  messagingSenderId: "817242775194",
  appId: "1:817242775194:web:53f03ffc85803f2d820923",
  measurementId: "G-FMTNE68HR1"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, onAuthStateChanged, createUserWithEmailAndPassword,
         signInWithEmailAndPassword, signOut, doc, setDoc, serverTimestamp };
