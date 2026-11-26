import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAVrRy0gk30l1XjNWrbwqloyZOCz6XJKW8",
  authDomain: "ventalibrefire.firebaseapp.com",
  projectId: "ventalibrefire",
  storageBucket: "ventalibrefire.firebasestorage.app",
  messagingSenderId: "555450978967",
  appId: "1:555450978967:web:4a66239fae09f02c278fd2",
  measurementId: "G-QQ32M3BY5F"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});

export default app;