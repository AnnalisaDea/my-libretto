<script setup>
    import { ref, computed } from "vue";
    import { useAuth } from "@/auth";
    import { useRouter } from "vue-router";
    import ConfirmModal from "@/components/ConfirmModal.vue";
    
    import { useUserPreferences } from "@/userSettings";
    import { useExams } from "@/exam";

    const { resetUserPreferences } = useUserPreferences();
    const { resetExams } = useExams();

    const { user, logout, changePassword, deleteAccount } = useAuth();

    const router = useRouter();

    // stati locali
    const newPassword = ref("");
    const confirmNewPassword = ref("");

    // stato di caricamento per operazioni asincrone
    const loadingLogout = ref(false);
    const loadingDelete = ref(false);
    const loadingPassword = ref(false);
    const erroreLocalePassword = ref("");
    const successoPassword = ref("");
    const erroreLocale = ref("");

    // stato per modale eliminazione account
    const showDeleteModal = ref(false);

    // computed per validità password
    const newPasswordValid = computed(() => {
        return (
           newPassword.value && confirmNewPassword.value
        );
    });

    // logout
    async function handleLogout() {
        erroreLocale.value = "";
        loadingLogout.value = true;
        try {
            await logout();
            router.push('/welcome');                      
            resetUserPreferences();
            resetExams();
        } catch (err) {
            erroreLocale.value = err.message || "Errore durante il logout.";
        } finally {
            loadingLogout.value = false;
        }
    }

    // cambio password
    async function handleChangePassword() {
        erroreLocalePassword.value = "";
        loadingPassword.value = true;

        if (newPassword.value.length < 6) {
            erroreLocalePassword.value = "Inserisci una password valida di almeno 6 caratteri.";
            loadingPassword.value = false;
            return;
        }

        if (newPassword.value !== confirmNewPassword.value) {
            erroreLocalePassword.value = "Le password non coincidono.";
            loadingPassword.value = false;
            return;
        }

        try {
            await changePassword(newPassword.value);
            successoPassword.value = "Password aggiornata con successo!";
            setTimeout(function() {
                successoPassword.value = "";
            }, 3000);
            newPassword.value = "";
            confirmNewPassword.value = "";
        } catch (err) {
            erroreLocalePassword.value = err.message || "Errore durante l'aggiornamento della password.";
        } finally {
            loadingPassword.value = false;
        }
    }

    // elimina account
    async function confirmDeleteAccount() {
        erroreLocale.value = "";
        loadingDelete.value = true;
        try {
            await deleteAccount();
            router.push('/welcome');
        } catch (err) {
            erroreLocale.value = err.message || "Errore durante l'eliminazione dell'account.";
        } finally {
            loadingDelete.value = false;            
            showDeleteModal.value = false;
        }
    }

    console.log(user);
</script>

<template>
    <div class="flex flex-col flex-1 items-center justify-center bg-quadretti-green p-6 sm:p-6 md:p-10">

        <!-- Stato di errore -->
        <div v-if="erroreLocale" class="w-full max-w-sm sm:max-w-lg lg:max-w-3xl py-8 px-10 mb-8 bg-red-200 border-2 border-black rounded-xl shadow-lg">
            <p class="text-md font-bold text-center">C'è stato un errore durante il completamento dell'operazione. Effettuare nuovamente il login e ripetere l'operazione.</p>
        </div>

        <div class="relative w-full max-w-sm sm:max-w-lg lg:max-w-3xl p-10 sm:p-16 lg:p-20 bg-white border-2 border-black rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200">
            <!-- Linguetta -->
            <div class="absolute z-10 -top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-green-300 border-2 border-black rounded-sm shadow rotate-[-2deg]"></div>
            <!-- Titolo -->
            <h2 class="text-2xl sm:text-3xl md:text-4xl text-center font-extrabold text-gray-900 mb-8">
                Profilo utente
            </h2>

            <!-- Info utente -->
            <div class="flex flex-col space-y-4 text-sm sm:text-md md:text-lg text-gray-800 pb-10">
                <p v-if="user.displayName"><strong>Nome utente:</strong> {{ user.displayName }}</p>
                <p><strong>Email:</strong> {{ user.email }}</p>
                <p>
                <strong>Accesso effettuato con:</strong>
                {{
                    user.providerData[0].providerId === "google.com"
                    ? "Google"
                    : user.providerData[0].providerId === "password"
                    ? "Email e password"
                    : "Altro"
                }}
                </p>
                <p><strong>Account creato il:</strong> {{ new Date(user.metadata.creationTime).toLocaleDateString() }}</p>
                <p><strong>Ultimo accesso:</strong> {{ new Date(user.metadata.lastSignInTime).toLocaleDateString() }}</p>
            </div>

            <!-- Azioni account -->
            <div class="flex flex-col sm:flex-row space-x-0 sm:space-x-3 space-y-2 sm:space-y-0 pb-6 sm:pb-10">
                <button
                @click="handleLogout"
                :disabled="loadingLogout"
                class="flex-1 border-2 border-black rounded-md px-4 py-2 text-sm sm:text-base font-bold text-black bg-green-300 hover:bg-green-400 transition disabled:bg-gray-300"
                >
                {{ loadingLogout ? "Disconnessione..." : "Disconnetti" }}
                </button>

                <button
                @click="showDeleteModal = true"
                :disabled="loadingLogout"
                class="flex-1 border-2 border-black rounded-md px-4 py-2 text-sm sm:text-base font-bold text-black hover:border-red-500 hover:text-red-500 transition disabled:bg-gray-300"
                >
                Elimina account
                </button>
            </div>

            <!-- Divider -->
            
            <div v-if="user.providerData[0].providerId === 'password'" class="relative">
                <div class="absolute inset-0 flex items-center">
                    <div class="w-full border-t border-gray-300"></div>
                </div>
                <div class="relative flex justify-center text-sm">
                    <span class="px-2 bg-white text-gray-500">Gestione password</span>
                </div>
            </div>
            
            <!-- Cambio password -->
            <div v-if="user.providerData[0].providerId === 'password'" class="flex flex-col space-y-4 sm:space-y-6">
                <div class="flex flex-col space-y-2 sm:space-y-3 pt-4 sm:pt-8">
                    <label class="block text-sm font-medium">Nuova password</label>
                    <input
                        v-model="newPassword"
                        type="password"
                        class="w-full border px-3 py-2 rounded-md"
                        :disabled="loadingPassword"
                    />
                    <label class="block text-sm font-medium">Conferma nuova password</label>
                    <input
                        v-model="confirmNewPassword"
                        type="password"
                        class="w-full border px-3 py-2 rounded-md"
                        :disabled="loadingPassword"
                    />
                </div>

                <!-- Errori -->
                <div v-if="erroreLocalePassword && !successoPassword" class="text-red-500 text-sm">
                    {{ erroreLocalePassword }}
                </div>
                <div v-if="successoPassword && !erroreLocalePassword" class="text-green-500 text-sm">
                    {{ successoPassword }}
                </div>

                <button
                    @click="handleChangePassword"
                    :disabled="!newPasswordValid || loadingPassword"
                    class="w-full bg-yellow-300 border-2 border-black text-gray-900 rounded-md shadow hover:bg-yellow-400 transition px-4 py-2 text-sm sm:text-base font-bold disabled:bg-gray-300"
                >
                    {{ loadingPassword ? "Aggiornamento..." : "Aggiorna password" }}
                </button>
            </div>
        </div>
  </div>

  <!-- Modale conferma eliminazione -->
  <ConfirmModal
    v-if="showDeleteModal"
    title="Elimina account"
    message="Sei sicuro di voler eliminare definitivamente il tuo account?"
    :loadingSignal="loadingDelete"
    @confirm="confirmDeleteAccount"
    @cancelled="showDeleteModal = false"
  />
</template>
