import {
    GoogleAuthProvider,
    signInWithPopup,
    signOut as firebaseSignOut,
    User
} from "firebase/auth";
import {
    doc,
    getDoc,
    setDoc,
    collection,
    query,
    where,
    getDocs
} from "firebase/firestore";
import { auth, db } from "./firebase";
import { UserRole } from "../types";

export interface UserProfile {
    uid: string;
    email: string;
    displayName: string;
    photoURL: string;
    role: UserRole;
}

export const signInWithGoogle = async (): Promise<UserProfile> => {
    console.log("Starting Google Sign-In...");
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log("Google Sign-In successful, checking user profile for:", user.email);

    // 1. Check if user exists in 'users' collection
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
        return userDoc.data() as UserProfile;
    }

    // 2. If not, check if email exists in 'farmers' or 'auditors' (and is approved/active)
    // Check Farmers
    const farmersRef = collection(db, "farmers");
    const qFarmer = query(farmersRef, where("email", "==", user.email));
    const farmerSnap = await getDocs(qFarmer);

    if (!farmerSnap.empty) {
        const farmerData = farmerSnap.docs[0].data();

        // Strict Check: Must be Approved by Admin
        if (farmerData.status !== "Aprovado") {
            await firebaseSignOut(auth);
            throw new Error("Seu cadastro ainda está em análise. Aguarde a aprovação.");
        }

        const newProfile: UserProfile = {
            uid: user.uid,
            email: user.email || "",
            displayName: user.displayName || farmerData.nome || "Agricultor",
            photoURL: user.photoURL || "",
            role: "agricultor"
        };

        // Create user doc
        await setDoc(userDocRef, newProfile);
        return newProfile;
    }

    // Check Auditors
    const auditorsRef = collection(db, "auditors");
    const qAuditor = query(auditorsRef, where("email", "==", user.email));
    const auditorSnap = await getDocs(qAuditor);

    if (!auditorSnap.empty) {
        const auditorData = auditorSnap.docs[0].data();

        if (auditorData.status !== "Aprovado") {
            await firebaseSignOut(auth);
            throw new Error("Seu cadastro de auditor ainda está em análise ou foi rejeitado.");
        }

        const newProfile: UserProfile = {
            uid: user.uid,
            email: user.email || "",
            displayName: user.displayName || auditorData.nome || "Auditor",
            photoURL: user.photoURL || "",
            role: "auditor"
        };

        await setDoc(userDocRef, newProfile);
        return newProfile;
    }

    // Check if Admin (Hardcoded for safety/bootstrap)
    // In a real app, this should be in a secure 'admins' collection or set via Firebase Console Claims
    const ADMIN_EMAILS = ["ruangomes@example.com", "admin@certifica.com"]; // Add your admin email here
    if (ADMIN_EMAILS.includes(user.email || "")) {
        const newProfile: UserProfile = {
            uid: user.uid,
            email: user.email || "",
            displayName: user.displayName || "Administrador",
            photoURL: user.photoURL || "",
            role: "admin"
        };
        await setDoc(userDocRef, newProfile);
        return newProfile;
    }

    // FAIL
    await firebaseSignOut(auth);
    throw new Error("E-mail não encontrado no sistema. Por favor, realize o cadastro primeiro.");
};

export const logout = async () => {
    await firebaseSignOut(auth);
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
        return userDoc.data() as UserProfile;
    }
    return null;
};
