import { createRouter, createWebHistory } from '@ionic/vue-router';
import ExploreView from '../layouts/ExploreView.vue';
import LandingView from '../layouts/LandingView.vue';

const routes = [
  {
    path: '/landing',
    component: LandingView,
    children: [
      { path: '', redirect: '/landing/login' },
      { path: 'login', name: 'login', component: () => import('../pages/landing/login.vue') },
    ],
    meta: { guestOnly: true } // Faqat mehmonlar (tizimga kirmaganlar) uchun
  },
  {
    path: '/explore',
    component: ExploreView,
    children: [
      { path: '', redirect: '/explore/home' }, // To'g'ri pathga redirect
      { path: 'home', name: 'home', component: () => import('../pages/explore/Home/index.vue') },
      { path: 'statistic', name: 'statistic', component: () => import('../pages/explore/Dashboard/sale/index.vue') },
      { path: 'menu', name: 'menu', component: () => import('../pages/explore/Menu/index.vue') },
      { path: 'order', name: 'order', component: () => import('../pages/explore/Order/index.vue') },
      { path: 'tables', name: 'tables', component: () => import('../pages/explore/Tabels/index.vue') },
      { path: 'profile', name: 'profile', component: () => import('../pages/explore/Profile/index.vue') },
      { path: 'check', name: 'check', component: () => import('../pages/explore/Check/index.vue') },
      { path: 'employee', name: 'employee', component: () => import('../pages/explore/HR/Employee/index.vue') },
      { path: 'settings/users', name: 'settingsusers', component: () => import('../pages/explore/Settings/users/index.vue') },
      { path: 'settings/roles', name: 'settingsroles', component: () => import('../pages/explore/Settings/role/index.vue') },
      { path: 'settings/permissions', name: 'settingspermissions', component: () => import('../pages/explore/Settings/permission/index.vue') },
    ],
    meta: { requiresAuth: true } // Avtorizatsiya talab qilinadigan sahifalar
  },
  { path: '/', redirect: '/explore/home' },
  { path: '/:pathMatch(.*)*', redirect: '/landing/login' }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

// --- NAVIGATION GUARD QISMI ---
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  const isAuthenticated = token && user;

  // 1. Agar sahifa login talab qilsa va user kirmagan bo'lsa
  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    next('/landing/login');
  } 
  // 2. Agar user kirgan bo'lsa va login sahifasiga o'tmoqchi bo'lsa
  else if (to.matched.some(record => record.meta.guestOnly) && isAuthenticated) {
    next('/explore/home');
  } 
  // 3. Qolgan holatlarda yo'lida davom etaveradi
  else {
    next();
  }
});

export default router;