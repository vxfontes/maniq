// INSTRUÇÕES PARA CONFIGURAÇÃO:
// 1. Vá para https://console.firebase.google.com/
// 2. Crie um novo projeto ou selecione um existente
// 3. Vá em "Project Settings" > "General" > "Your apps"
// 4. Clique em "</>" para adicionar um app web
// 5. Copie a configuração e substitua os valores abaixo
// 6. Renomeie este arquivo para firebase.ts
// 7. No Firebase Console, vá em "Authentication" > "Sign-in method"
// 8. Ative o provedor Google
// 9. No Firebase Console, vá em "Firestore Database" > "Create database"
// 10. Escolha "Start in test mode" por enquanto

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth and get a reference to the service
export const auth = getAuth(app);

// Initialize Firestore and get a reference to the service
export const db = getFirestore(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
    prompt: 'select_account'
});