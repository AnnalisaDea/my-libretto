<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  title: String,
  message: String,
  loadingSignal : { type: Boolean, default: false }
});

const emit = defineEmits(["confirm", "cancelled"]);
</script>

<template>
  <!-- Overlay -->
  <div class="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-60">

    <!-- Modale -->
    <div class="w-full max-w-xs sm:max-w-md lg:max-w-xl p-6 sm:p-10 lg:p-12 bg-white border-2 border-black rounded-lg flex flex-col items-center justify-center shadow-lg">
      
      <h3 class="text-xl sm:text-3xl font-extrabold mb-1 sm:mb-2">{{ title }}</h3>
      <div class="text-base sm:text-lg font-semibold text-black mb-4 sm:mb-8">
        {{ message }}
      </div>

      <!-- Pulsanti azione -->
      <div class="flex gap-3 w-full">
        <!-- Pulsante Conferma -->
        <button
          class="flex-1 border-2 border-black text-gray-900 rounded-md shadow transition bg-green-300 hover:bg-green-400 disabled:bg-gray-300 px-4 py-2 text-sm sm:text-base font-bold"
          @click="$emit('confirm')"
          :disabled="loadingSignal"
        >
          {{ loadingSignal ? 'Eliminazione...' : 'Conferma' }}
        </button>

        <!-- Pulsante Annulla -->
        <button
          type="button"
          @click="$emit('cancelled')"
          class="flex-1 border-2 border-black rounded-md px-4 py-2 text-sm sm:text-base font-bold text-black hover:border-red-500 hover:text-red-500 transition"
        >
          Annulla
        </button>
      </div>
    </div>
  </div>
</template>
