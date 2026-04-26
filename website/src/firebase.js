import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "ВАШ_API_KEY",
  authDomain: "ВАШ_AUTH_DOMAIN",
  projectId: "ВАШ_PROJECT_ID",
  storageBucket: "ВАШ_STORAGE_BUCKET",
  messagingSenderId: "ВАШ_MESSAGING_SENDER_ID",
  appId: "ВАШ_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);