import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDzq2_gXRmJ02AXYkGIyvRs_KemIhySpQ0",
    authDomain: "tkm-registration-form-fef5d.firebaseapp.com",
    projectId: "tkm-registration-form-fef5d",
    storageBucket: "tkm-registration-form-fef5d.firebasestorage.app",
    messagingSenderId: "13404172024",
    appId: "1:13404172024:web:d719c136a7bab55d53d50d",
    measurementId: "G-LLVDVV9VN8"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
