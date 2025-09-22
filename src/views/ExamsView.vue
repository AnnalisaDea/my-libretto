<script setup>
    import { ref, onMounted, computed } from 'vue';
    import { useExams } from '@/exam.js';
    import ExamList from '@/components/ExamList.vue';
    import ExamForm from '@/components/ExamForm.vue';

    const { 
            exam,
            exams,  
            errorExams,
            fetchExams
        } = useExams();

    // stato della pagina
    const statoAttuale = ref("viewing"); // 'viewing' | 'adding' | 'editing'
    const loading = ref(false);

    // per passare l'id dell'esame da modificare a ExamForm
    const currentExamId = ref(null);
    
    // chip attiva
    const activeFilter = ref("tutti");


    // definizione dei filtri
    const filters = [
        {
            key: "tutti",
            label: "Tutti",
            activeColor: "bg-blue-300",
            inactiveColor: "bg-blue-100 hover:bg-blue-200",
            filterFn: exams => exams
        },
        {
            key: "superati",
            label: "Superati",
            activeColor: "bg-green-300",
            inactiveColor: "bg-blue-100 hover:bg-green-100",
            filterFn: exams => exams.filter(e => e.sostenuto && (e.voto >= 18 || e.voto === 0))
        },
        {
            key: "nonSuperati",
            label: "Non superati",
            activeColor: "bg-red-300",
            inactiveColor: "bg-blue-100 hover:bg-red-100",
            filterFn: exams => exams.filter(e => e.sostenuto && e.voto > -1 && e.voto < 18)
        },
        {
            key: "idoneita",
            label: "Idoneità",
            activeColor: "bg-purple-300",
            inactiveColor: "bg-blue-100 hover:bg-purple-100",
            filterFn: exams => exams.filter(e => e.sostenuto && e.voto === 0)
        },
        {
            key: "daDare",
            label: "Da dare",
            activeColor: "bg-yellow-300",
            inactiveColor: "bg-blue-100 hover:bg-yellow-100",
            filterFn: exams => exams.filter(e => !e.sostenuto || e.voto === -1)
        }
    ];


    // lista filtrata
    const filteredExams = computed(() => {
        const f = filters.find(f => f.key === activeFilter.value);
        return f ? f.filterFn(exams) : exams;
    });




    onMounted (async () => {
        try {
            loading.value = true;
            await fetchExams();
            if (exams.length === 0) {
                statoAttuale.value = 'adding';
            } else {
                statoAttuale.value = 'viewing';
            }
        } catch (error) {
            console.error(error);
        } finally {
            loading.value = false;
        }
    });


    // quando clicchi su "Modifica" in ExamList
    function handleEditExam(examDaModificare) {
        const { id, ...datiSenzaId } = examDaModificare;
        Object.assign(exam, datiSenzaId);
        currentExamId.value = id; //salvo solo l’id separato
        statoAttuale.value = "editing";
    }

    // quando clicchi "Aggiungi nuovo esame"
    function handleAddExam() {
        loading.value = false;
        currentExamId.value = null;
        statoAttuale.value = "adding";
    }


</script>

<template>
    <div class="flex flex-1 flex-col items-center justify-start bg-quadretti-blu  p-6 sm:p-8">

        <!-- Stato di caricamento -->
        <div v-if="loading" class="py-8 px-10 bg-white border-2 border-black rounded-xl shadow-lg">
            <p class="text-lg font-bold text-center">Caricamento...</p>
        </div>

        <!-- Stato di errore -->
        <div v-if="errorExams" class="py-8 px-10 bg-red-200 border-2 border-black rounded-xl shadow-lg">
            <p class="text-lg font-bold text-center">Errore durante il caricamento degli esami. Prova a ricaricare la pagina.</p>
        </div>

        <!-- Stato di visualizzazione -->
        <div v-if="statoAttuale === 'viewing' && !loading" class="w-full max-w-sm sm:max-w-lg lg:max-w-3xl flex flex-col items-center space-y-6">
            <!-- Titolo -->
            <h2 class="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900">
                I tuoi esami
            </h2>

            <!-- Chips sticky -->
            <div class="w-full sticky top-20 z-10 bg-blue-100 sm:bg-transparent rounded-b-lg px-2 py-2">
                <div class="flex justify-start sm:justify-center gap-2 overflow-x-auto">
                    <button
                    v-for="f in filters"
                    :key="f.key"
                    @click="activeFilter = f.key"
                    class="px-3 py-1 border-2 border-black text-sm font-semibold rounded-full transition flex-shrink-0"
                    :class="[
                        activeFilter === f.key
                        ? `${f.activeColor} text-black`
                        : f.inactiveColor
                    ]"
                    >
                    {{ f.label }}
                    </button>
                </div>
            </div>

            <!-- Lista esami -->
            
            <ExamList
                v-if="filteredExams.length > 0 && !loading"
                class="w-full "
                :exams="filteredExams"
                :editable="true"
                :exams-viewed="exams.length"
                @edit-exam="handleEditExam"
            />

            <div v-if="filteredExams.length === 0 && !loading" class="py-8 px-10 bg-white border-2 border-black rounded-xl shadow-lg">
                <p class="text-lg font-bold text-center">Nessun esame trovato</p>
            </div>

            <!-- Pulsante aggiungi come FAB -->
            <button
                @click="handleAddExam"
                class="fixed bottom-6 right-6 px-4 py-3 bg-green-400 border-2 border-black rounded-full shadow-lg hover:bg-green-500 font-bold"
                >
               <span class="text-lg px-1">+</span>

                <!-- Testo visibile solo da md in su -->
                <span class="hidden md:inline">Aggiungi</span>
            </button>
        </div>
        


        <!-- Stato di aggiunta/modifica -->
        <ExamForm
            v-if="(statoAttuale === 'adding' || statoAttuale === 'editing') && !loading"
            :exam-id="statoAttuale === 'editing' ? currentExamId : null"
            @saved="statoAttuale = 'viewing'" 
            @cancelled="statoAttuale = 'viewing'" 
            />
       
    </div>
</template>

<style scoped></style>
        
   