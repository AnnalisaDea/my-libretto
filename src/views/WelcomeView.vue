<script setup>
    import { RouterLink } from 'vue-router';
</script>

<template>
  <!-- Contenitore principale con sfondo quadrettato -->
  <div class="flex items-center justify-center min-h-screen bg-quadretti-green p-6 sm:p-6 md:p-10">
    
    <!-- Card -->
    <div class="relative w-full max-w-sm sm:max-w-lg lg:max-w-4xl xl:max-w-5xl p-10 sm:p-16 lg:p-24 text-center bg-white border-2 border-black rounded-xl shadow-lg">
      <!-- Linguetta tipo quaderno -->
      <div class="absolute -top-4 left-1/2 -translate-x-1/2 px-3 sm:px-4 py-1 bg-yellow-300 border-2 border-black rounded-t-md text-xs sm:text-sm md:text-base font-bold">
        My Libretto
      </div>

      <h1 class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-3 sm:mb-4">
        Benvenuto in My Libretto
      </h1>

      <p class="text-xs sm:text-sm md:text-base lg:text-lg text-gray-700 mb-6 leading-snug sm:leading-relaxed">
        Monitora il tuo percorso accademico, calcola la tua media  <br class="hidden lg:block" /> e simula il tuo voto di laurea.
      </p>

      <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
        <RouterLink to="/login" class="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white border-2 border-black rounded-md shadow hover:bg-blue-700 transition text-sm sm:text-base">
          Accedi
        </RouterLink>
        <RouterLink to="/register" class="px-4 sm:px-6 py-2 sm:py-3 bg-pink-300 border-2 border-black text-gray-900 rounded-md shadow hover:bg-pink-400 transition text-sm sm:text-base">
          Registrati
        </RouterLink>
      </div>
    </div>

  </div>
</template>

<style scoped></style>
