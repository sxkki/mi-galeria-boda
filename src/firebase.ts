import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDZhYai747LR21Vla2_JSkzp15YnUw4RQM",
  authDomain: "miboda-888a3.firebaseapp.com",
  projectId: "miboda-888a3",
  storageBucket: "miboda-888a3.appspot.com",
  messagingSenderId: "802409922716",
  appId: "1:802409922716:web:689cc8e6b129b381066d59",
  measurementId: "G-9PQ0SRB4H3"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);
export const auth = getAuth(app);