<script setup>
import { RouterView } from 'vue-router';
import { provideAuth } from './auth'

// Chiama la funzione per fornire il contesto di autenticazione presente in auth.js
provideAuth()

</script>

<template>
  <RouterView />
</template>

<style scoped></style>
