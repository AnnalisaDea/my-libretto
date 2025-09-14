import { createRouter, createWebHistory } from 'vue-router'
import { getAuth } from 'firebase/auth';


import WelcomeView from '@/views/WelcomeView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import ProfileSetupView from '@/views/ProfileSetupView.vue'
import DashboardView from '@/views/DashboardView.vue'
import ExamsView from '@/views/ExamsView.vue'
import AddExamView from '@/views/AddExamView.vue'
import SettingsView from '@/views/SettingsView.vue'
import PredictionView from '@/views/PredictionView.vue'


const routes = [
    {
      path: '/',
      name: 'Dashboard',
      component: DashboardView,
      meta: { requiresAuth: true }
    },
    {
      path: '/welcome',
      name: 'Welcome',
      component: WelcomeView,
      meta: { requiresGuest: true }
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginView,
      meta: { requiresGuest: true }
    },
    {
      path: '/register',
      name: 'Register',
      component: RegisterView,
      meta: { requiresGuest: true }
    },
    {
      path: '/profile-setup',
      name: 'ProfileSetup',
      component: ProfileSetupView,
      meta: { requiresAuth: true }
    },
    {
      path: '/exams',
      name: 'Exams',
      component: ExamsView,
      meta: { requiresAuth: true }
    },
    { 
      path: '/add-exam',
      name: 'AddExam',
      component: AddExamView,
      meta: { requiresAuth: true }
    },
    {
      path: '/settings',
      name: 'Settings',
      component: SettingsView,
      meta: { requiresAuth: true }
    },
    {
      path: '/prediction',
      name: 'Prediction',
      component: PredictionView,
      meta: { requiresAuth: true }
    }
  ];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation guard globale
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest);
  const currentUser = getAuth().currentUser;

  // Se la rotta richiede autenticazione e l'utente NON è loggato
  if (requiresAuth && !currentUser) {
    next('/login');
  // Se la rotta è per ospiti e l'utente è loggato  
  } else if (requiresGuest && currentUser) {
    // Reindirizza alla dashboard
    next('/');
  } else {
    next();
  }
});


export default router;
