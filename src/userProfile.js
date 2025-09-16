import { reactive, ref, readonly } from "vue";
import { doc, getDoc, setDoc} from "firebase/firestore";
import { db } from "./firebase";

// Oggetto preferenze reattivo
const preferenze = reactive({
    nomeStudente: '',
    università: '',
    corso: '',
    matricola: '',
    tipoMedia: 'Aritmetica', // Valore di default
    valutazione: '0 - 30', // Valore di default
    creditiTotali: 180, // Valore di default
    valoreLode: 30, // Valore di default
    creditiEsclusi: 0, // Valore di default    
    setupCompleto: false // Indica se il setup del profilo è completo
});

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


// funzione personalizzata per usare le preferenze utente
export function useUserProfile() {
    return {
        preferenze: preferenze,
        loading: readonly(loading),
        error: readonly(error),
        fetchUserPreferences,
        saveUserPreferences
    };
}