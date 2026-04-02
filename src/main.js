import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import { IonicVue } from '@ionic/vue';
import i18n from "./Language/i18n.js";

// 1. Pinia-ni import qiling
import { createPinia } from 'pinia';

// Tailwind va Global CSS
import './main.css';

/* Ionic CSS qoidalari */
import '@ionic/vue/css/core.css';
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

// 2. Pinia instansiyasini yarating
const pinia = createPinia();
const app = createApp(App);

// 3. Pinia-ni ilovaga ulang (MUHIM: Boshqa pluginlardan oldin yoki ular bilan birga)
app.use(pinia); 
app.use(IonicVue);
app.use(router);
app.use(i18n);

router.isReady().then(() => {
  app.mount('#app');
});