<script setup>
    import { ref } from "vue";
    import { RouterLink, useRoute, useRouter } from "vue-router";
    import { useAuth } from "../auth";
    import { useUserPreferences } from "@/userSettings";
    import { useExams } from "@/exam";

    const { resetUserPreferences } = useUserPreferences();
    const { resetExams } = useExams();
    const router = useRouter()
    const route = useRoute();
    const { user, logout } = useAuth();

    const menuOpen = ref(false);

    const menuItems = [
    { name: "Esami", to: "/exams", activeColor: "bg-blue-300", hoverColor: "bg-blue-200" },
    { name: "Impostazioni", to: "/settings", activeColor: "bg-pink-300", hoverColor: "bg-pink-200" },
    { name: "Profilo", to: "/profile", activeColor: "bg-green-300", hoverColor: "bg-green-200" }
    ];

    async function logoutUser() {
        try {
            await logout();
            router.push('/login');            
            resetUserPreferences();
            resetExams();
        } catch (err) {
            console.error('Errore durante il logout:', err);
        }
    }


</script>

<template>
  <nav class="border-b-2 border-black shadow px-4 pt-6 pb-0 bg-white relative">
    <!-- Navbar desktop -->
    <div class="hidden lg:flex justify-between w-full">
        <!-- Voci navbar -->
        <div class="flex space-x-2 items-end">
            <!-- Logo come link alla Dashboard -->
            <RouterLink 
            to="/"
            class="bg-yellow-300 px-6 py-3.5 border-x-2 border-t-2 border-black rounded-t-md text-black font-extrabold transition-all duration-200"
            :class="[
                route.path === '/' 
                ? ' -mb-[2px] mt-0.5'
                : ' hover:bg-yellow-400 mt-0'
            ]"
            >
            My Libretto
            </RouterLink>

            <!-- Voci di menu -->
            <div v-for="item in menuItems" :key="item.to">
                <RouterLink
                :to="item.to"
                class="px-4 py-2 flex items-end rounded-t-md border-x-2 border-t-2 border-black font-semibold transition-all duration-200"
                :class="[
                    route.path === item.to
                    ? item.activeColor + ' text-black -mb-[2px]'
                    : 'bg-white text-black hover:' + item.hoverColor + ''
                ]"
                >
                {{ item.name }}
                </RouterLink>
            </div>
        </div>

        <!-- Profilo utente desktop-->
        <div class="flex items-center space-x-3">
            <span class="font-bold text-sm">{{user.email}}</span>
            <button @click="logoutUser" class="px-3 py-2 bg-red-400 border-2 border-black rounded-md hover:bg-red-500 transition hover:text-white text-sm font-bold">
                Disconnetti
            </button>
        </div>
    </div>

    <!-- Menu mobile -->
    <div class="w-full lg:hidden flex justify-between">
        <div class="flex space-x-2 items-end">
            <RouterLink
            to="/"
            class="bg-yellow-300 px-6 py-3.5 border-x-2 border-t-2 border-black rounded-t-md font-extrabold transition-all duration-200"
            :class="[
                route.path === '/' 
                ? 'text-black -mb-[2px] mt-0.5'
                : 'text-black hover:bg-yellow-400 mt-0'
            ]"
            >
            My Libretto
            </RouterLink>

            <!-- Altra voce di menu attiva-->
            <div v-if="route.path !== '/'"
                class="px-4 py-2 flex items-end rounded-t-md border-x-2 border-t-2 border-black font-semibold transition-all duration-200  text-black -mb-[2px]"
                :class="[
                (menuItems.find(i => i.to === route.path)?.activeColor || 'bg-white text-gray-700') 
                ]"
            >
                {{ menuItems.find(i => i.to === route.path)?.name || route.name }}
            </div>
        </div>    
        
        <button @click="menuOpen = !menuOpen" class="p-2 text-black">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
        </button>
    </div>

    <!-- Menu a discesa mobile -->
    <div v-if="menuOpen" class="lg:hidden absolute top-full left-0 w-full bg-white border-y-2 border-black shadow z-10 flex flex-col items-center py-4">
      <RouterLink
        to="/"
        @click="menuOpen = false"
        class="block w-full text-center px-4 py-2 text-black font-semibold"
      >
        My Libretto
      </RouterLink>

      <div v-for="item in menuItems" :key="item.to" class="w-full">
        <RouterLink
          :to="item.to"
          @click="menuOpen = false "
          class="block w-full text-center px-4 py-2 text-black font-semibold"
        >
          {{ item.name }}
        </RouterLink>
      </div>

      <div class="w-full text-center mt-4 pt-4 border-t-2 border-black border-dashed">
        <span class="font-bold text-sm block mb-2">{{ user.email }}</span>
        <button @click="logoutUser" class="w-2/3 px-3 py-2 bg-red-400 border-2 border-black rounded-md hover:bg-red-500 transition hover:text-white text-sm font-bold">
          Disconnetti
        </button>
      </div>
    </div>   
     
  </nav>

  
</template>
