<script setup>
    import { computed } from 'vue';
    import { RouterLink } from 'vue-router';
    import { ref, onMounted } from 'vue';
    import { useAuth } from '../auth';
    import { useUserProfile } from '../userProfile';
    import { useExams } from '../exam';
    import { AcademicCapIcon } from '@heroicons/vue/24/outline';
    import ExamList from '@/components/ExamList.vue';

    import CardStatistic from '@/components/CardStatistic.vue';

    const { preferenze, error, loading, fetchUserPreferences } = useUserProfile();
    const { 
            exams,  
            loadingExams,
            errorExams,
            calcolaMediaAritmetica,
            calcolaMediaPonderata,
            calcolaCreditiTotali,
            calcolaEsamiSuperati,
            calcolaProiezioneVotoLaurea, 
            fetchExams
        } = useExams();
    const { user } = useAuth();
    const erroreLocale = ref('');

    // Carica le preferenze utente al montaggio del componente
    onMounted (async () => {
        try {
            erroreLocale.value = '';
            await fetchUserPreferences(user);
            await fetchExams(user);
        } catch (error) {
            erroreLocale.value = error.message || 'Errore durante l\'accesso.';
        }         
    });
    
</script>

<template>
  <!-- Contenitore principale con sfondo quadrettato -->
    <div class="flex flex-1 items-center justify-center bg-quadretti-yellow p-6 sm:p-6 md:p-10">

        <!-- Stato di caricamento -->
        <div v-if="loading || loadingExams" class="py-8 px-10 bg-white border-2 border-black rounded-xl shadow-lg">
        <p class="text-lg font-bold text-center">Caricamento...</p>
        </div>

        <!-- Utente senza impostazioni -->
        <div v-if="!preferenze.setupCompleto && !loading && !loadingExams">
        <div class="flex flex-col items-center relative w-full max-w-sm sm:max-w-lg lg:max-w-3xl p-10 sm:p-16 lg:p-24 bg-white border-2 border-black rounded-xl shadow-lg">
            <div class="absolute z-10 -top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-pink-300 border-2 border-black rounded-sm shadow rotate-[-2deg]"></div>
            <h2 class="text-xl sm:text-2xl font-extrabold mb-4">Benvenut*</h2>
            <h1 class="pb-8 text-center">
            Per iniziare ad usare <span class="font-bold">My Libretto</span> abbiamo bisogno di alcune informazioni sulla tua università. 
            Vai in <span class="font-bold">Impostazioni</span> e compila il form per iniziare a monitorare il tuo percorso accademico!
            </h1>
            <RouterLink
            to="/profile-setup"
            class="px-4 sm:px-6 py-2 sm:py-3 bg-pink-300 border-2 border-black text-gray-900 rounded-md shadow hover:bg-pink-400 transition text-sm sm:text-base font-bold"
            >
            Iniziamo
            </RouterLink>
        </div>
        </div>

        <!-- Utente con impostazioni -->
        <div v-if="preferenze.setupCompleto && !loading && !loadingExams" class="w-full max-w-7xl">

            <!-- Layout responsive: 1 colonna su mobile, 2 su desktop -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-20">

                <!-- Colonna sinistra: benvenuto + statistiche -->
                <div class="flex flex-col gap-6">
                
                    <!-- Card benvenuto -->
                    <div class="relative flex justify-center p-6 border-2 border-black rounded-xl shadow-lg bg-white">
                        <div class="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-yellow-300 border-2 border-black rounded-sm shadow rotate-[-2deg]"></div>
                        <div class="flex items-start space-x-4 sm:space-x-10">
                            <div class="flex-shrink-0">
                                <AcademicCapIcon class="w-12 h-12 sm:w-14 sm:h-14" />
                            </div>
                            <div class="flex-1">
                                <h2 class="text-xl sm:text-2xl font-extrabold mb-1">
                                Benvenut*<span v-if="preferenze.nomeStudente">, {{ preferenze.nomeStudente }}</span>!
                                </h2>
                                <div v-if="preferenze.università || preferenze.corso" class="mb-1">
                                <p class="text-lg sm:text-xl font-bold text-gray-900">
                                    {{ preferenze.università }}
                                </p>
                                <p v-if="preferenze.corso" class="text-md sm:text-lg text-gray-700 font-semibold">
                                    {{ preferenze.corso }}
                                </p>
                                </div>
                                <p v-if="preferenze.matricola" class="text-sm text-gray-600 mb-1">Matricola: {{ preferenze.matricola }}</p>
                                <p v-if="!preferenze.università && !preferenze.corso" class="pr-14 text-sm sm:text-base text-gray-600 italic">
                                Monitorare il tuo percorso accademico non è mai stato così semplice con My Libretto!
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Card statistiche -->
                    <div class="grid grid-cols-2 gap-6">
                        <CardStatistic
                        title="Media attuale"
                        :value="preferenze.tipoMedia === 'Aritmetica'
                            ? calcolaMediaAritmetica(exams).toFixed(2)
                            : calcolaMediaPonderata(exams).toFixed(2)"
                        color="blue"
                        icon="Calcolatrice"
                        :active="exams.length > 0"
                        message="Inserisci il tuo primo esame per vedere la media"
                        />

                        <CardStatistic
                        title="Esami superati"
                        :value="calcolaEsamiSuperati(exams)"
                        color="green"
                        icon="Check"
                        :active="exams.length > 0"
                        message="Ancora nessun esame registrato"
                        />

                        <CardStatistic
                        title="Crediti acquisiti"
                        :value="`${calcolaCreditiTotali(exams)} / ${preferenze.creditiTotali}`"
                        color="yellow"
                        icon="Crediti"
                        :active="exams.length > 0"
                        message="Nessun credito ancora acquisito"
                        />

                        <CardStatistic
                        title="Proiezione laurea"
                        :value="calcolaProiezioneVotoLaurea(exams).toFixed(2)"
                        color="pink"
                        icon="Trofeo"
                        :active="exams.filter(exam => exam.voto >= 18).length > preferenze.EsamiEsclusi"
                        message="La proiezione apparirà solo quando il numero di esami supera quello escluso nel calcolo"
                        />
                    </div>
                </div>

                <!-- Colonna destra: esami -->
                <div class="flex flex-col items-center h-full">
                    <!-- Nessun esame inserito -->
                    <div v-if="exams.length === 0" class="relative flex flex-col items-center w-full h-full">
                        <div class="absolute z-10 -top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-blue-300 border-2 border-black rounded-sm shadow rotate-[-2deg]"></div>
                        <div class="flex flex-col justify-center items-center relative w-full h-full p-10 sm:p-16 lg:p-24 bg-white border-2 border-black rounded-xl shadow-lg">
                            <h2 class="text-xl sm:text-2xl font-extrabold mb-4">Aggiungi il tuo primo esame</h2>
                            <h1 class="pb-8 text-center">Per iniziare a vedere le statistiche è necessario che tu inserisca almeno un esame</h1>
                            <RouterLink
                                to="/exams"
                                class="px-4 sm:px-6 py-2 sm:py-3 bg-blue-300 border-2 border-black text-gray-900 rounded-md shadow hover:bg-blue-400 transition text-sm sm:text-base font-bold"
                            >
                                Iniziamo
                            </RouterLink>
                        </div>
                    </div>

                    <!-- Elenco esami recenti -->
                    <div v-else class="w-full">
                        <h2 class="text-2xl sm:text-3xl font-extrabold mb-4 text-center">Esami recenti</h2>
                        <ExamList class="w-full" :exams="exams.filter(exam => exam.voto !== -1)" :editable="false" :exams-viewed="5" />
                        <div v-if="erroreLocale || error || errorExams" class="text-red-500 text-sm mt-6">
                        {{ erroreLocale || error || errorExams }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>



<style scoped></style>