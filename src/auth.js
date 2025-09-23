import { ref, provide, inject, readonly } from "vue";
import { auth, googleProvider } from "./firebase";
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithPopup, updatePassword, updateEmail, deleteUser } from "firebase/auth";

// Crea uno stato reattivo per l'utente
export const user = ref(null);
// Crea uno stato reattivo per il caricamento e gli errori
const loading = ref(false);
const loadingGoogle = ref(false);
const error = ref(null);



// Funzione per registrare un nuovo utente
async function register (email, password) {
    loading.value = true;
    try {
        error.value = null
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        user.value = userCredential.user;
    } catch (err) {
        error.value = err.message;
        throw err; // Rilancia l'errore per la gestione locale
    } finally {
        loading.value = false;
    }
}

// Funzione per l'accesso dell'utente
async function login(email, password) {
    loading.value = true;
    try {
        error.value = null
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        user.value = userCredential.user;
    } catch (err) {
        error.value = err.message;
        throw err; // Rilancia l'errore per la gestione locale
    } finally {
        loading.value = false;
    }
}

// Aggiungi il login con provider esterni (es. Google)
async function loginWithGoogle() {
    loadingGoogle.value = true;
    try {
        error.value = null;
        const result = await signInWithPopup(auth, googleProvider);
        user.value = result.user;
    } catch (err) {
        error.value = err.message;
        throw err; // Rilancia l'errore per la gestione locale
    } finally {
        loadingGoogle.value = false;
    }
}

// Funzione per fare il logout dell'utente
async function logout() {
    loading.value = true;
    try {
        error.value = null;
        await signOut(auth);
        user.value = null;
    } catch (err) {
        error.value = err.message;
        throw err; // Rilancia l'errore per la gestione locale
    } finally {
        loading.value = false;
    }
}

// Funzione per aggiornare la password
async function changePassword(newPassword) {
    if (!user.value) throw new Error("Nessun utente autenticato");
    loading.value = true;
    try {
        error.value = null;
        await updatePassword(user.value, newPassword);
    } catch (err) {
        error.value = err.message;
        throw err;
    } finally {
        loading.value = false;
    }
}

// Funzione per eliminare l'account
async function deleteAccount() {
    if (!user.value) throw new Error("Nessun utente autenticato");
    loading.value = true;
    try {
        error.value = null;
        await deleteUser(user.value);
        user.value = null;
    } catch (err) {
        error.value = err.message;
        throw err;
    } finally {
        loading.value = false;
    }
}

// Funzione per resettare l'errore
function resetError(){
    error.value = null;
}

// Setup auth state listener
onAuthStateChanged(auth, (currentUser) => {
    user.value = currentUser
    loading.value = false
})

export function provideAuth() {
    const auth = {
        user: readonly(user),
        loading: readonly(loading),
        loadingGoogle: readonly(loadingGoogle),
        error: readonly(error),
        register,
        login,
        logout,
        resetError,
        loginWithGoogle,
        changePassword,   
        deleteAccount    
    };

    provide('auth', auth);
}


// Funzione per iniettare le variabili e le funzioni di autenticazione nei componenti
export function useAuth() {
    const auth = inject('auth');
    return auth;
}