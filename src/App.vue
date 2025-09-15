<script setup>

  import { RouterView } from 'vue-router';
  import { provideAuth,user } from './auth';
  import Navbar from '@/components/Navbar.vue';

  provideAuth();

</script>

<template>
  <div class="flex flex-col min-h-screen">
    <Navbar v-if="user" />

    <RouterView />
    
  </div>
</template>


<style scoped>
</style>