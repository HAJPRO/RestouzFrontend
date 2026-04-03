import { createRouter, createWebHistory } from '@ionic/vue-router';
import ExploreView from '../layouts/ExploreView.vue';
import LandingView from '../layouts/LandingView.vue';

const routes = [
  {
    path: '/landing',
    component: LandingView,
    children: [
      { path: '', redirect: '/landing/login' }, // Redirect qo'shildi
      { path: 'login', name: 'login', component: () => import('../pages/landing/login.vue') },
    ]
  },
  {
    path: '/explore',
    component: ExploreView,
    children: [
      { path: '', redirect: '/home' }, // Root kelganda home ga yuborish
      { path: 'home', name: 'home', component: () => import('../pages/explore/HomePage.vue') },
      { path: 'statistic', name: 'statistic', component: () => import('../pages/explore/Dashboard/sale/index.vue') },
      { path: 'menu', name: 'menu', component: () => import('../pages/explore/Menu/index.vue') },
      { path: 'tables', name: 'tables', component: () => import('../pages/explore/Tabels/index.vue') },
      { path: 'profile', name: 'profile', component: () => import('../pages/explore/Profile/index.vue') },
      { path: 'check', name: 'check', component: () => import('../pages/explore/Check/index.vue') },

      // Settings bo'limi
      { path: 'settings/users', name: 'settingsusers', component: () => import('../pages/explore/Settings/users/index.vue') },
    ]
  },
  // Noma'lum yo'llar uchun default login'ga yuborish
  { path: '/:pathMatch(.*)*', redirect: '/landing/login' }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;