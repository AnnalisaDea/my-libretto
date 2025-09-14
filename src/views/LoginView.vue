<script setup>
    import { useRouter } from 'vue-router';
    import { ref, onMounted } from 'vue';
    import { useAuth } from '../auth';

    const { login, error, loading, resetError, loginWithGoogle } = useAuth();

    const router = useRouter();

    onMounted(() => {
        resetError();        
        erroreLocale.value = '';
    });

    const email = ref('');
    const password = ref('');   
    const erroreLocale = ref('');


    async function handleSubmit() {
        erroreLocale.value = '';

        if (!email.value || !password.value) {
            erroreLocale.value = 'Compila tutti i campi.';
            return;
        }

        try {
            erroreLocale.value = ''
            await login(email.value, password.value);
            router.push('/');
        } catch (error) {
            if (error.message === 'Firebase: Error (auth/invalid-credential).') {
                erroreLocale.value = 'Credenziali non corrette.';
                return;
            } 
            if (error.message === 'Firebase: Error (auth/too-many-requests).') {
                erroreLocale.value = 'Il numero di richieste supera il massimo consentito. Riprova più tardi.';
                return;
            }
            erroreLocale.value = error.message || 'Errore durante l\'accesso.';       
        }
    }

    async function handleGoogleLogin() {
        erroreLocale.value = '';

        try {
            await loginWithGoogle();
            router.push('/');
        } catch (error) {
            erroreLocale.value = error.message || 'Errore durante l\'accesso con Google.';
        }
    }


</script>

<template>
    <!-- Contenitore principale con sfondo quadrettato -->
    <div class="flex items-center justify-center min-h-screen bg-quadretti-blu p-6 sm:p-6 md:p-10">

        <!-- Card -->
        <div class="relative w-full max-w-sm sm:max-w-lg lg:max-w-2xl p-10 sm:p-16 lg:p-24 bg-white border-2 border-black rounded-xl shadow-lg">
            <form @submit.prevent="handleSubmit" >
                <div class="absolute -top-4 left-1/2 -translate-x-1/2 px-3 sm:px-4 py-1 bg-yellow-300 border-2 border-black rounded-t-md text-xs sm:text-sm md:text-base font-bold">
                    My Libretto
                </div>

                <h2 class="text-2xl sm:text-3xl md:text-4xl text-center font-extrabold text-gray-900 mb-6">Accedi</h2>

                <!-- Text fields -->
                <div class="mb-4">
                    <label for="email" class="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" id="email" v-model="email" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                </div>
                <div class="mb-6">
                    <label for="password" class="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input type="password" id="password" v-model="password" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                </div>

                <!-- Messaggio di errore -->
                <div v-if="erroreLocale || error" class="text-red-500 text-sm mb-6">
                    {{ erroreLocale || error }}
                </div>

                <button type="submit" :disabled="loading" class="w-full bg-blue-600 border-2 border-black text-white rounded-md shadow hover:bg-blue-700 transition disabled:bg-gray-300 px-4 py-2 text-sm sm:text-base font-bold">{{ loading ? 'Accesso in corso...' : 'Accedi' }}</button>
            </form>

            <!-- Divider -->
            <div class="mt-4">
                <div class="relative">
                    <div class="absolute inset-0 flex items-center">
                        <div class="w-full border-t border-gray-300"></div>
                    </div>
                    <div class="relative flex justify-center text-sm">
                        <span class="px-2 bg-white text-gray-500">Or continue with</span>
                    </div>
                </div>
                <!-- Google Button -->
                <div class="mt-4">
                    <button @click="handleGoogleLogin" :disabled="loading" class="w-full bg-white border-2 border-black text-black rounded-md shadow hover:bg-gray-100 transition disabled:bg-gray-300 px-4 py-2 text-sm sm:text-base font-bold">
                    <span class="flex items-center justify-center">
                        <svg class="h-5 w-5 mr-2" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        <path d="M1 1h22v22H1z" fill="none" />
                        </svg>
                        {{ loading ? 'Accesso in corso...' : 'Google' }}
                    </span>
                    </button>
                </div>
            </div>  

            <!-- Link to Register -->
            <div class="mt-6 text-center">
                <p class="text-sm text-gray-600">
                    Hai già un account?
                    <router-link to="/register" class="font-medium text-indigo-600 hover:text-indigo-500">Registrati</router-link>
                </p>
            </div>
    
        </div>
    </div>


</template>

<style scoped></style>