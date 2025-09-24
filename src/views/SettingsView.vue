<script setup>
    import { ref, onMounted } from "vue";
    //La @ in un progetto Vue creato con Vite è un alias che punta alla cartella src è uguale a import from '../firebase'
    import { useAuth } from "@/auth";
    import { useUserPreferences } from '../userSettings';

    const { preferenze, error, loading, fetchUserPreferences, saveUserPreferences } = useUserPreferences();
    const { user } = useAuth();
    const erroreLocale = ref('');    
    const successoLocale = ref("");

    // Carica le preferenze utente al montaggio del componente
    onMounted (async () => {
        try {
            erroreLocale.value = '';
            await fetchUserPreferences(user);
        } catch (error) {
            erroreLocale.value = error.message || 'Errore durante l\'accesso.';
        } 
    });
    
    async function saveSettings() {
        erroreLocale.value = '';

        try {
            await saveUserPreferences(user);
            successoLocale.value = "Impostazioni salvate con successo!";
            setTimeout(function() {
                successoLocale.value = "";
            }, 3000);
        } catch (err) {
            erroreLocale.value = err.message || "Errore durante il salvataggio, riprova.";
        }
        
    }
</script>

<template>
    <div class="flex flex-1 items-center justify-center bg-quadretti-pink  p-6 sm:p-6 md:p-10">
        <div class="relative w-full max-w-sm sm:max-w-lg lg:max-w-3xl p-10 sm:p-16 lg:p-20 bg-white border-2 border-black rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200">
            <!-- Linguetta -->
            <div class="absolute z-10 -top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-pink-300 border-2 border-black rounded-sm shadow rotate-[-2deg]"></div>

            <form @submit.prevent="saveSettings">
                <!-- Titolo -->
                <h2 class="text-2xl sm:text-3xl md:text-4xl text-center font-extrabold text-gray-900 mb-8">
                Impostazioni iniziali
                </h2>

                <!-- Tipo di media -->
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Tipo di media *</label>
                    <select v-model="preferenze.tipoMedia" class="w-full px-3 py-2 border border-gray-300 rounded-md">
                        <option value="Aritmetica">Aritmetica</option>
                        <option value="Ponderata">Ponderata</option>
                    </select>
                </div>

                <!-- Crediti totali -->
                <div class="mb-4 relative">
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                        Crediti totali *
                        <span
                        class="ml-2 text-xs bg-gray-200 rounded-full px-2 py-0.5 cursor-pointer relative group"
                        title="Inserisci il numero totale di crediti previsti dal tuo piano di studi"
                        >
                        i
                        <div class="absolute bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs rounded px-2 py-1">
                            Inserisci il numero totale di crediti previsti dal tuo piano di studi.
                        </div>
                        </span>
                    </label>
                    <input
                        type="number"
                        v-model="preferenze.creditiTotali"
                        min="1"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                </div>

                <!-- Valore lode -->
                <div class="mb-4 relative">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                    Valore lode *
                    <span
                    class="ml-2 text-xs bg-gray-200 rounded-full px-2 py-0.5 cursor-pointer relative group"
                    title="Inserisci il valore attribuito alla lode dalla tua università (da 30 a 39)"
                    >
                    i
                    <span
                        class="absolute bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs rounded px-2 py-1"
                    >
                        Inserisci il valore attribuito alla lode dalla tua università (da 30 a 39).
                    </span>
                    </span>
                </label>
                <input
                    type="number"
                    v-model="preferenze.valoreLode"
                    min="30"
                    max="39"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                </div>

                <!-- Crediti esclusi -->
                <div class="mb-6 relative">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                    Numero esami esclusi con voto più basso *
                    <span
                    class="ml-2 text-xs bg-gray-200 rounded-full px-2 py-0.5 cursor-pointer relative group"
                    title="Inserisci il numero di esami con voto più basso che la tua università ti permette di eliminare dal calcolo della media e previsione di laurea. Se non previsto lascia 0."
                    >
                    i
                    <span
                        class="absolute bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs rounded px-2 py-1 max-w-xs"
                    >
                        Inserisci il numero di esami con voto più basso che la tua università ti permette
                        di eliminare dal calcolo del voto di laurea. Se non previsto lascia
                        0.
                    </span>
                    </span>
                </label>
                <input
                    type="number"
                    v-model="preferenze.EsamiEsclusi"
                    min="0"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                </div>

                <!-- Divider -->
                <div class="my-6">
                <div class="relative">
                    <div class="absolute inset-0 flex items-center">
                        <div class="w-full border-t border-gray-300"></div>
                    </div>
                    <div class="relative flex justify-center text-sm">
                        <span class="px-2 bg-white text-gray-500">Dati facoltativi</span>
                    </div>
                </div>
                </div>

                <!-- Nome studente -->
                <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">Nome studente</label>
                <input
                    type="text"
                    v-model="preferenze.nomeStudente"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Il tuo nome"
                />
                </div>
                <!-- Università -->
                <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">Università</label>
                <input
                    type="text"
                    v-model="preferenze.università"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="La tua università"
                />
                </div>  
                <!-- Corso di laurea -->
                <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">Corso di laurea</label>
                <input
                    type="text"
                    v-model="preferenze.corso"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Il tuo corso di laurea"
                />  
                </div>
                <!-- Matricola -->
                <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-1">Matricola</label>
                <input
                    type="text"
                    v-model="preferenze.matricola"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Il tuo numero di matricola"
                />
                </div>

                <div v-if="successoLocale && (!erroreLocale || !error)" class="text-green-500 text-sm mb-6">
                    {{ successoLocale }}
                </div>
                <!-- Errori -->
                <div v-if="(erroreLocale || error) && !successoLocale" class="text-red-500 text-sm mb-6">
                     {{ erroreLocale || error }}
                </div>

                <!-- Pulsante -->
                <button
                type="submit"
                :disabled="loading"
                class="w-full bg-green-300 border-2 border-black text-gray-900 rounded-md shadow hover:bg-green-400 transition disabled:bg-gray-300 px-4 py-2 text-sm sm:text-base font-bold"
                >
                {{ loading ? "Salvataggio..." : "Salva impostazioni" }}
                </button>
            </form>
        </div>
    </div>
        
</template>

<style scoped></style>