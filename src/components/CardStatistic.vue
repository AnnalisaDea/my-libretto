<script setup>
  import { defineProps, computed } from "vue";
  import { CalculatorIcon, CheckCircleIcon, CircleStackIcon, TrophyIcon } from "@heroicons/vue/24/outline";

  const props = defineProps({
    title: String,
    value: [String, Number],
    color: { type: String, default: "gray" },
    active: { type: Boolean, default: false },
    message: { type: String, default: "" },
    icon: { type: String, default: "Calculator" }
  });

  // icone
  const icons = {
    Calcolatrice: CalculatorIcon,
    Check: CheckCircleIcon,
    Crediti: CircleStackIcon,
    Trofeo: TrophyIcon
  };

  // mappa colori → le classi che Tailwind deve conoscere
  const colorClasses = {
    blue: "bg-blue-200",
    green: "bg-green-200",
    yellow: "bg-yellow-200",
    pink: "bg-pink-200",
    gray: "bg-gray-100 opacity-80"
  };

  // classe finale calcolata
  const cardClass = computed(() => {
    return props.active ? colorClasses[props.color] || colorClasses.gray : colorClasses.gray;
  });
</script>

<template>
  <div
    class="p-4 sm:p-6 border-2 border-black rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-200 text-center flex flex-col items-center justify-center h-full"
    :class="cardClass"
  >
    <component
      :is="icons[icon]"
      class="w-8 h-8 sm:w-10 sm:h-10 mb-2 sm:mb-3"
      :class="active ? 'text-black' : 'text-gray-400'"
    />
    <h3 class="text-base sm:text-lg font-bold mb-1 sm:mb-2">{{ title }}</h3>
    <div v-if="active" class="text-xl sm:text-3xl font-extrabold text-black">
      {{ value }}
    </div>
    <div v-else class="text-xs sm:text-sm text-gray-600 italic">
      {{ message || "Nessun dato disponibile" }}
    </div>
  </div>
</template>
