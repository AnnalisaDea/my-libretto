import { ref, reactive,readonly } from "vue";
import { useUserProfile } from "./userProfile";
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "./firebase";
import { user } from './auth';


const { preferenze } = useUserProfile();

const exams = reactive([]); // Array reattivo per gli esami
const exam = reactive({
    nome: '',
    sostenuto: true,
    crediti: 0, 
    voto: 18,
    lode: false,
    data: ''
});

const loadingExams = ref(false);
const errorExams = ref(null);

// Funzione per aggiungere un esame
async function addExam() {
    loadingExams.value = true;
    try {
        errorExams.value = null;

        // Salva l'esame nel database
        const collectionRef = collection(db, "users", user.value.uid, "exams");
        const docRef = await addDoc(collectionRef, { ...exam });

        // Aggiungi l'esame all'array reattivo solo dopo il salvataggio
        // È importante creare una copia per evitare problemi di reattività
        exams.push({ id: docRef.id, ...exam });
        // Pulisci l'oggetto `exam` per il prossimo inserimento
        resetExam();

    } catch (err) {
        errorExams.value = err.message;
        throw err; // Rilancia l'errorExamse per la gestione locale
    } finally {
        loadingExams.value = false;
    }
}

//funzione per modificare un esame
async function updateExam(examId) {
    if (!examId) throw new Error("Nessun esame selezionato per la modifica.");
    loadingExams.value = true;
    try {
        errorExams.value = null;

        const docRef = doc(db, "users", user.value.uid, "exams", examId);

        // exam NON contiene id, quindi lo puoi usare diretto
        await updateDoc(docRef, { ...exam });

        // aggiorna anche l'array exams locale
        const index = exams.findIndex(e => e.id === examId);
        if (index !== -1) {
            exams[index] = { ...exam, id: examId }; // 👈 id lo rimetto SOLO nell'array locale
        }

        resetExam(); // pulisce i campi del form
    } catch (err) {
        errorExams.value = err.message;
        throw err;
    } finally {
        loadingExams.value = false;
    }
}


// Funzione per recuperare gli esami dal database
async function fetchExams() {
    loadingExams.value = true;
    try {
        errorExams.value = null;

        const collectionRef = collection(db, "users", user.value.uid, "exams");
        const querySnapshot = await getDocs(collectionRef);
        // include id: doc.id
        const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        exams.splice(0, exams.length, ...docs); // Aggiorna l'array reattivo con i nuovi dati

    } catch (err) {
        errorExams.value = err.message;
        throw err; // Rilancia l'errorExamse per la gestione locale
    } finally {
        loadingExams.value = false;
    }
}

// Funzione per eliminare un esame
async function deleteExam(id) {
    if (!id) throw new Error("Nessun id fornito per l'eliminazione.");
    loadingExams.value = true;
    try {
        errorExams.value = null;

        const docRef = doc(db, "users", user.value.uid, "exams", id);
        await deleteDoc(docRef);

        // rimuovi anche dall’array locale
        const index = exams.findIndex(e => e.id === id);
        if (index !== -1) {
            exams.splice(index, 1);
        }

        resetExam();
    } catch (err) {
        errorExams.value = err.message;
        throw err;
    } finally {
        loadingExams.value = false;
    }
}


// Reset exam (per nuovo inserimento)
function resetExam() {
    Object.assign(exam, {
        nome: '',
        sostenuto: true,
        crediti: 0,
        voto: 18,
        lode: false,
        data: ''
    });
}

//FUNZIONI STATISTICHE

//funzione per calcolare crediti totali
function calcolaCreditiTotali() {
    return exams.filter(exam => exam.sostenuto && (exam.voto === 0 || exam.voto >= 18)).reduce((accumulatore, examCorrente) => accumulatore + (examCorrente.crediti || 0), 0);
}

//funzione per calcolare numero esami superati
function calcolaEsamiSuperati() {
    return exams.filter(exam => exam.sostenuto && (exam.voto === 0 || exam.voto >= 18)).length;
}

//funzione per calcolare la media aritmetica
function calcolaMediaAritmetica(exams) {
    if (exams.length === 0) return 0;

    const valoreLode = preferenze.valoreLode || 30; // Usa il valore di lode dalle preferenze, default 30
    const esamiConsideratiMedia = exams.filter(exam => exam.voto >= 18).length;

    // Calcola il totale dei voti considerando solo gli esami con voto >= 18 (quindi escludendo gli esami non ancora sostenuti e ad idoneità e non superati)
    // e sostituendo i voti con lode al valore di lode
    const totaleVoti = exams.filter(exam => exam.voto >= 18).reduce(function(accumulatore, examCorrente) {
        if (examCorrente.lode) {
            return accumulatore + valoreLode;
        } else {
            return accumulatore + (examCorrente.voto || 0);
        }
    }, 0);

    return totaleVoti / esamiConsideratiMedia;
}

//function per calcolare la media ponderata
function calcolaMediaPonderata(exams) {
    if (exams.length === 0) return 0;
    const valoreLode = preferenze.valoreLode || 30; // Usa il valore di lode dalle preferenze, default 30
    const creditiConsideratiMedia = exams.filter(exam => exam.voto >= 18).reduce((acc, exam) => acc + (exam.crediti || 0), 0);

    const totalePonderato = exams.filter(exam => exam.voto >= 18).reduce(function(accumulatore, examCorrente) {
        const voto = examCorrente.lode ? valoreLode : (examCorrente.voto || 0);
        return accumulatore + (voto * (examCorrente.crediti || 0));
    }, 0);

   
    return totalePonderato / creditiConsideratiMedia;
}

//funzione per calcolo proiezione voto di laurea
function calcolaProiezioneVotoLaurea(exams) {
    let media = 0;
    const esamiOrdinati = exams.filter(exam => exam.voto >= 18).sort((examA, examB) => {
        return examB.voto - examA.voto;
    })
    const esamiConsiderati = reactive([]);

    if (preferenze.EsamiEsclusi >= esamiOrdinati.length) {
        return 0; // Se il numero di esami da escludere è maggiore o uguale al numero totale di esami, ritorna 0
    } else {
        esamiConsiderati.push(...esamiOrdinati.slice(0, esamiOrdinati.length - preferenze.EsamiEsclusi || 0)); // Prendi i N esami con il voto più basso da escludere
    }

    if (preferenze.tipoMedia == 'Aritmetica') {
        media = calcolaMediaAritmetica(esamiConsiderati);
    } else if (preferenze.tipoMedia == 'Ponderata') {
        media = calcolaMediaPonderata(esamiConsiderati);
    }
    // Calcola la proiezione del voto di laurea su scala 110   
    return (media * 110) / 30;
}



//funzione per resettare gli esami
function resetExams() {
    exams.splice(0, exams.length); // Rimuove tutti gli esami dall'array reattivo
    loadingExams.value = false;
    errorExams.value = null;
}

// funzione personalizzata per usare gli esami
export function useExams() {
    return {
        exams,
        exam,
        loadingExams: readonly(loadingExams),
        errorExams: readonly(errorExams),
        addExam,
        updateExam,
        deleteExam,
        fetchExams,
        calcolaMediaAritmetica,
        calcolaMediaPonderata,
        calcolaCreditiTotali,
        calcolaEsamiSuperati,
        calcolaProiezioneVotoLaurea,
        resetExam
    };
}