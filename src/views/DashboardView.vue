<script setup>
    import { useRouter } from 'vue-router';
    import { ref } from 'vue';
    import { useAuth } from '../auth';

    const { logout, error, loading } = useAuth();

    const router = useRouter();

    async function logoutUser() {
        try {
            await logout();
            router.push('/login');
        } catch (err) {
            console.error('Errore durante il logout:', err);
        }
    }

    

</script>

<template>
    <button @click="logoutUser">Logout</button>
</template>


<style scoped></style>