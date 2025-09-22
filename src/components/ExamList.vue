<script setup>
import { defineProps, defineEmits } from "vue";
import { CircleStackIcon, CalendarIcon, ChevronRightIcon } from '@heroicons/vue/24/outline';


const props = defineProps({
  exams: { type: Array, default: () => [] },
  editable: { type: Boolean, default: false },
  examsViewed: { type: Number, default: 5 }
});

const emits = defineEmits(['editExam']);

function formatDate(date) {
  return new Date(date).toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
}

function getStripeColor(voto) {
  if (voto === -1) return "bg-yellow-200"; // da sostenere
  if (voto === 0 || voto >= 18) return "bg-green-200"; // superato/idoneità
  if (voto < 18) return "bg-red-200"; // non superato
  return "bg-gray-200";
}

</script>

<template>
  <div class="space-y-4">
    <div
      v-for="exam in exams.slice(0, examsViewed).sort((a, b) => new Date(b.data) - new Date(a.data))"
      :key="exam.id"
      class="relative w-full bg-white flex items-center justify-between p-4 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-200 border-2 border-black"
    >
      <!-- Stripe colorata a sinistra -->
      <div
        class="absolute top-0 left-0 h-full rounded-l-md w-2 sm:w-3"
        :class="getStripeColor(exam.voto)"
      ></div>

      <!-- Contenuto card (aggiunto padding-left per non coprire la stripe) -->
      <div class="flex items-center justify-between w-full pl-4 sm:pl-6">
        <!-- Info principali -->
        <div class="flex flex-col flex-1">
          <h3 class="text-lg sm:text-xl font-bold text-black">
            {{ exam.nome }}
          </h3>

          <p v-if="exam.voto !== -1" class="text-sm sm:text-base font-semibold text-black">
            Voto:
            <span
              class="font-bold"
              :class="exam.voto === 0 ? 'text-blue-700' : exam.voto >= 18 ? 'text-green-800' : 'text-red-700'"
            >
              {{ exam.voto === 0 ? 'Idoneità' : exam.voto < 18 ? 'Non superato' : exam.lode == true ? exam.voto + 'L' : exam.voto }}
            </span>
          </p>
          <p v-else class="text-sm sm:text-base font-semibold text-black">
            Voto: <span class="font-bold text-yellow-700">Da sostenere</span>
          </p>
        </div>

        <!-- Icone e dettagli -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-x-4 pr-2 sm:pr-0 sm:space-y-0">
          <div class="flex items-center text-black text-sm font-semibold sm:text-base">
            <CircleStackIcon class="w-5 h-5 mr-1 text-yellow-700" />
            <span>{{ exam.crediti }} cfu</span>
          </div>
          <div class="flex items-center text-black text-sm font-semibold sm:text-base">
            <CalendarIcon class="w-5 h-5 mr-1 text-blue-700" />
            <span>{{ formatDate(exam.data) }}</span>
          </div>
        </div>

        <!-- Pulsante modifica -->
        <button
          v-if="editable"
          @click="emits('editExam', exam)"
          class="ml-4 px-3 py-1 border-2 border-black rounded-md bg-blue-300 hover:bg-blue-400 text-sm font-semibold"
        >
          <ChevronRightIcon class="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>