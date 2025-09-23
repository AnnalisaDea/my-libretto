import { reactive, ref, readonly } from "vue";
import { collection, getDocs, doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "./firebase";

// Oggetto preferenze reattivo
const preferenze = reactive({
    nomeStudente: '',
    università: '',
    corso: '',
    matricola: '',
    tipoMedia: 'Aritmetica', // Valore di default
    creditiTotali: 180, // Valore di default
    valoreLode: 30, // Valore di default
    EsamiEsclusi: 0, // Valore di default    
    setupCompleto: false // Indica se il setup del profilo è completo
});

// Oggetto che contiene i valori predefiniti
const defaultPreferences = {
    nomeStudente: '',
    università: '',
    corso: '',
    matricola: '',
    tipoMedia: 'Aritmetica',
    creditiTotali: 180,
    valoreLode: 30,
    EsamiEsclusi: 0,
    setupCompleto: false
};

const loading = ref(false);
const error = ref(null);

// Funzione per recuperare le preferenze dell'utente dal database
async function fetchUserPreferences(user) {
    loading.value = true;
    try {
        error.value = null;
        // Recupera le preferenze dell'utente dal database
        const docRef = doc(db, "users", user.value.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            // Copia le proprietà del documento nel nostro oggetto preferenze
            Object.assign(preferenze, data);
        }
        // Se il documento non esiste, preferenze rimane con i valori di default
    } catch (err) {
        error.value = err.message;
        throw err; // Rilancia l'errore per la gestione locale
    }
    finally {
        loading.value = false;
    }
};


// Funzione per salvare le preferenze dell'utente nel database
// Salva/aggiorna preferenze nel DB
async function saveUserPreferences(user) {
    loading.value = true;
    try {
        error.value = null;

        const docRef = doc(db, "users", user.value.uid);

        await setDoc(docRef, {
            ...preferenze,
            setupCompleto: true, // una volta salvato consideriamo setup fatto
        });

    } catch (err) {
        error.value = err.message;
        throw err;
    } finally {
        loading.value = false;
    }
}

async function deleteUserProfile(user) {
    if (!user.value) throw new Error("Nessun utente autenticato");

    loading.value = true;
    try {
        error.value = null;

        const userDocRef = doc(db, "users", user.value.uid);

        // elimina sottocollezione exams
        const examsColRef = collection(userDocRef, "exams");
        const snapshot = await getDocs(examsColRef);
        for (const exam of snapshot.docs) {
            await deleteDoc(exam.ref);
        }

        // elimina documento utente
        await deleteDoc(userDocRef);

        resetUserPreferences();
    } catch (err) {
        error.value = err.message;
        throw err;
    } finally {
        loading.value = false;
    }
}

//funzione per resettare le preferenze
function resetUserPreferences() {
    // Reimposta l'oggetto preferenze ai suoi valori predefiniti
    Object.assign(preferenze, defaultPreferences);
    // Resetta anche le variabili di stato
    loading.value = false;
    error.value = null;
}

// funzione personalizzata per usare le preferenze utente
export function useUserPreferences() {
    return {
        preferenze: preferenze,
        loading: readonly(loading),
        error: readonly(error),
        fetchUserPreferences,
        saveUserPreferences,
        resetUserPreferences,
        deleteUserProfile
    };
}