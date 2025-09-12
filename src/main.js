import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'; // Import Tailwind CSS
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase'; // Questo file deve contenere l'istanza di auth

// assegna l'istanza dell'app solo dopo che lo stato di autenticazione è stato determinato
let app

onAuthStateChanged(auth, () => {
    if (!app) {
        app = createApp(App)
            .use(router)
            .mount('#app')
    }
})