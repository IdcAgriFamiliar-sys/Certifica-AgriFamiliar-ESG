import { initializeApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAr40oMQxI05Wa2SDnW0GkPG6PeYmsrdic",
  authDomain: "sigaf-certifica-agrifamiliar.firebaseapp.com",
  projectId: "sigaf-certifica-agrifamiliar",
  // Correção: usar domínio 'appspot.com' para o bucket de storage.
  // O valor anterior (`firebasestorage.app`) estava incorreto e impedia uploads.
  storageBucket: "sigaf-certifica-agrifamiliar.appspot.com",
  messagingSenderId: "301453179892",
  appId: "1:301453179892:web:9c693b8bfe0d94707297a1",
  measurementId: "G-MSXECYYMKF",
};

const app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  getFirestore,
  Firestore
} from "firebase/firestore";

let db: Firestore;
try {
  db = initializeFirestore(app, {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager()
    })
  });
} catch (e) {
  // If already initialized (common in hot reload), use existing instance
  db = getFirestore(app);
}
const storage = getStorage(app);

export { app, analytics, auth, db, storage };
