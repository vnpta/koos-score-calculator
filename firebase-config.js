import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// Firebase config của bạn
const firebaseConfig = {
  apiKey: "AIzaSyCtfuF9GJMpPkcUGgqH539lbKQoiaVbOx8",
  authDomain: "koosvn-79214.firebaseapp.com",
  projectId: "koosvn-79214",
  storageBucket: "koosvn-79214.firebasestorage.app",
  messagingSenderId: "616747698087",
  appId: "1:616747698087:web:8740c4372a11ea82631882",
  measurementId: "G-6K09T94P9X"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// Export để các file khác dùng
export { db };
