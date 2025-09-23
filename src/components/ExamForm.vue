<script setup>
    import { ref, computed, defineEmits, defineProps} from "vue";
    import { useExams } from "@/exam";
    import { TrashIcon } from "@heroicons/vue/24/outline";    
    import ConfirmModal from '@/components/ConfirmModal.vue';

    const { exam, addExam, updateExam, loadingExams, errorExams, resetExam, deleteExam } = useExams();
    const erroreLocale = ref('');
    const erroreEliminazione = ref('');
    
    // per emettere eventi al componente genitore
    const emit = defineEmits(["saved", "cancelled"]);

    // per gestire la conferma dell'eliminazione
    const showConfirmDelete = ref(false);
    const loadingDeleteSignal = ref(false);

    const props = defineProps({
      examId: { type: String, default: null } // id passato dal genitore
    });

    // Controlla se il form è completo e valido
    const formCompleted = computed(() => {
        if ((exam.sostenuto === 'true' || exam.sostenuto === true) && (exam.voto < 0 || exam.voto > 30)) {
            erroreLocale.value = "Inserisci un voto valido tra 0 e 30.";
        } else if ((exam.sostenuto === 'true' || exam.sostenuto === true) && (exam.lode === true || exam.lode === 'true') && exam.voto !== 30) {
            erroreLocale.value = "Per ottenere la lode, il voto deve essere almeno 30.";
        } else {
            erroreLocale.value = "";
        }
        return exam.nome && exam.crediti && exam.data && (exam.sostenuto === 'false' || ((exam.sostenuto === 'true' || exam.sostenuto === true) && ((exam.voto >= 0 && exam.voto <= 30 && exam.lode === false) || (exam.lode===true && exam.voto===30))));
    });
    console.log(erroreLocale.value);

    async function handleSubmit() {
        try {
            erroreLocale.value = "";
            if (props.examId) {
                await updateExam(props.examId);
            } else {
                await addExam();
            }
            emit("saved"); // torna alla lista
        } catch (err) {
            erroreLocale.value = err.message || "Errore durante il salvataggio.";
        }
    }

    function handleCancel() {
        resetExam(); 
        emit("cancelled"); // torna alla lista senza salvare
    }

    async function handleDeleteExam() {
        if (!props.examId) return;
        loadingDeleteSignal.value = true;
        erroreEliminazione.value = "";

        try {
            await deleteExam(props.examId);
            emit("saved"); // torna alla lista dopo eliminazione
        } catch (err) {
            erroreEliminazione.value = err.message || "Errore durante l'eliminazione.";
        } finally {
            loadingDeleteSignal.value = false;
            showConfirmDelete.value = false;
        }
        
    }

</script>

<template>
    <!-- Conferma eliminazione -->
    <ConfirmModal
        v-if="showConfirmDelete"
        title="Conferma eliminazione"
        message="Sei sicuro di voler eliminare questo esame?"
        :loadingSignal="loadingDeleteSignal"
        @confirm="handleDeleteExam"
        @cancelled="showConfirmDelete = false"
    />


    <div class="w-full max-w-sm sm:max-w-lg lg:max-w-3xl p-10 sm:p-16 lg:p-20 bg-white border-2 border-black rounded-xl shadow-lg">
       <!-- Stato di errore -->
        <div v-if="erroreEliminazione" class="w-full max-w-sm sm:max-w-lg lg:max-w-3xl py-8 px-10 mb-8 bg-red-200 border-2 border-black rounded-xl shadow-lg">
            <p class="text-md font-bold text-center">C'è stato un errore durante il completamento dell'operazione. Riprova più tardi.</p>
        </div>

        <!-- Form esame -->
        <form @submit.prevent="handleSubmit">
            <div class="w-full flex items-center justify-between mb-8">
                <!-- Titolo -->
                <h2 class="w-full text-2xl sm:text-3xl md:text-4xl text-center font-extrabold text-gray-900 ">
                  {{ props.examId ? "Modifica" : "Inserisci un esame" }}
                </h2>

                <!-- Pulsante elimina (solo in modifica) -->
                <button
                    v-if="props.examId"
                    @click.prevent="showConfirmDelete = true"
                    class="p-2 bg-red-400 border-2 border-black rounded-xl text-black hover:bg-red-500 hover:text-white"
                    :disabled="loadingExams"
                >
                    <TrashIcon class="w-5 h-5" />
                </button>
            </div>
            

            <!-- Nome corso esame -->
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">Nome corso *</label>
                <input
                    type="text"
                    v-model="exam.nome"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
            </div>

            <!-- Radiobutton hai già sostenuto l'esame -->
            <div class="mb-4">
                <span class="block text-sm font-medium text-gray-700 mb-1">Hai già sostenuto l'esame? *</span>
                <div class="flex items-center space-x-4">
                    <label class="inline-flex items-center">
                        <input
                            type="radio"
                            class="form-radio"
                            value="true"
                            v-model="exam.sostenuto"                                
                            @change="exam.voto = 18"
                        />
                        <span class="ml-2">Sì</span>
                    </label>
                    <label class="inline-flex items-center">
                        <input
                            type="radio"
                            class="form-radio"
                            value="false"
                            v-model="exam.sostenuto"
                            @change="exam.voto = -1"
                        />
                        <span class="ml-2">No</span>
                    </label>
                </div>
            </div>

            <!-- Crediti esame -->
            <div class="mb-4 relative">
                <label class="block text-sm font-medium text-gray-700 mb-1">Crediti esame *</label>
                <input
                    type="number"
                    v-model="exam.crediti"
                    min="1"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
            </div>

            <!-- Voto -->
            <div v-if="exam.sostenuto === 'true' || exam.sostenuto === true" class="mb-4 relative">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                    Voto *
                    <span
                        class="ml-2 text-xs bg-gray-200 rounded-full px-2 py-0.5 cursor-pointer relative group"
                        title="Inserisci il voto (0 per le idoneità e -1 se devi ancora sostenerlo)"
                    >
                        i
                        <span
                            class="absolute bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs rounded px-2 py-1"
                        >
                            Inserisci il voto dell'esame (0 per le idoneità)
                        </span>
                    </span>
                </label>
                <input
                    type="number"
                    v-model="exam.voto"
                    min="0"
                    max="30"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                <!-- Checkbox per la lode -->
                <div class="flex items-center mt-2">
                    <input
                        type="checkbox"
                        id="lode"
                        v-model="exam.lode"
                        class="mr-2"
                    />
                    <label for="lode" class="text-sm text-gray-700">Lode</label>
                </div>
            </div>

            <!-- Data esame -->
            <div class="mb-6 relative">
            <label class="block text-sm font-medium text-gray-700 mb-1">
                Data esame *
            </label>
            <input
                type="date"
                v-model="exam.data"
                class="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            </div>

            <!-- Errori -->
            <div v-if="erroreLocale || errorExams" class="text-red-500 text-sm mb-6">
                    {{ erroreLocale || errorExams}}
            </div>

            <!-- Pulsanti azione -->
            <div class="flex flex-col sm:flex-row gap-3">
              
                <!-- Pulsante salva -->
                <button
                    type="submit"
                    :disabled="loadingExams || !formCompleted"
                    class="flex-1 border-2 border-black text-gray-900 rounded-md shadow transition disabled:bg-gray-300 px-4 py-2 text-sm sm:text-base font-bold"
                    :class="[formCompleted ? 'bg-green-300 hover:bg-green-400' : 'bg-gray-300']"
                >
                    {{ loadingExams ? "Salvataggio..." : props.examId ? "Salva modifiche" : "Salva esame" }}
                </button>
                 <!-- Pulsante annulla -->
                <button
                    type="button"
                    @click="handleCancel"
                    class="flex-1 border-2 border-black rounded-md px-4 py-2 text-sm sm:text-base font-bold text-black hover:border-red-500 hover:text-red-500 transition"
                >
                    Annulla
                </button>

            </div>
        </form>
    </div>
    
        
</template>

<style scoped></style>