<script setup>
    import { RouterLink } from 'vue-router';
    import { ref, onMounted } from 'vue';
    import { useAuth } from '../auth';
    import { useUserProfile } from '../userProfile';

    const { preferenze, error, loading, fetchUserPreferences } = useUserProfile();
    const { user } = useAuth();
    const erroreLocale = ref('');

    // Carica le preferenze utente al montaggio del componente
    onMounted (async () => {
        try {
            erroreLocale.value = '';
            await fetchUserPreferences(user);
        } catch (error) {
            erroreLocale.value = error.message || 'Errore durante l\'accesso.';
        } 
        console.log(preferenze.setupCompleto);
    });
       
</script>

<template>  
    
    <!-- Contenitore principale con sfondo quadrettato -->
    <div class="flex flex-1 items-center justify-center bg-quadretti-yellow  p-6 sm:p-6 md:p-10">
        <!-- Stato di caricamento -->
        <div v-if="loading" class="py-8 px-10 bg-white border-2 border-black rounded-xl shadow-lg">
            <p class="text-lg font-bold text-center">Caricamento...</p>
        </div>

        <div v-if="!preferenze.setupCompleto && !loading">
            <div class="flex flex-col items-center relative w-full max-w-sm sm:max-w-lg lg:max-w-3xl p-10 sm:p-16 lg:p-24 bg-white border-2 border-black rounded-xl shadow-lg">
                <h1 class="pb-8 text-center">Per iniziare ad usare <span class="font-bold">My Libretto</span> abbiamo bisogno di alcune informazioni sulla tua università. Vai in Impostazioni e compila il form</h1>
                <RouterLink to="/profile-setup" class="px-4 sm:px-6 py-2 sm:py-3 bg-pink-300 border-2 border-black text-gray-900 rounded-md shadow hover:bg-pink-400 transition text-sm sm:text-base">
                    Iniziamo
                </RouterLink>
            </div>
        </div>
        <!-- Utente con impostazioni -->
        <div v-if="preferenze.setupCompleto && !loading">
             

            
        </div>
    </div>    
</template>    


<style scoped></style>