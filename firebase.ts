// @ts-nocheck
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// 已经帮你修正了 apiKey 的大小写错误
const firebaseConfig = {
  apiKey: "AIzaSyDHMiuuCpJxu2h-Hu0NOYyJPOfGJNhGbtQ",
  authDomain: "robot-competition.firebaseapp.com",
  projectId: "robot-competition",
  storageBucket: "robot-competition.firebasestorage.app",
  messagingSenderId: "630160244884",
  appId: "1:630160244884:web:f94b575245f8e848d8b481",
  measurementId: "G-NN4M24D5K4"
};

// 初始化 Firebase
const app = initializeApp(firebaseConfig);

// 导出功能
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);