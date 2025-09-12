<script setup>
import { RouterLink } from 'vue-router';

</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <div class="text-center p-8 bg-white rounded-lg shadow-md max-w-lg">
      <h1 class="text-4xl font-bold text-gray-800 mb-4">Benvenuto in My Libretto</h1>
      <p class="text-gray-600 mb-6">
        Monitora il tuo percorso accademico, calcola la tua media e simula il voto di laurea.
      </p>
      <div class="flex space-x-4 justify-center">
        <router-link to="/login" class="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
          Accedi
        </router-link>
        <router-link to="/register" class="px-6 py-3 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition">
          Registrati
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped></style>