<template>
  <ion-menu content-id="main-content" type="overlay" class="custom-sidebar">
    <ion-content class="ion-no-padding" :scroll-y="false">
      <div class="flex flex-col h-full bg-white dark:bg-[#020617] transition-colors duration-500">
        
        <header class="p-6 pb-1">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <ion-icon :icon="restaurant" class="text-white text-xl" />
              </div>
              <h1 class="text-xl font-black tracking-tighter dark:text-white mt-3">
                Resto<span class="text-indigo-600 italic">.uz</span>
              </h1>
            </div>
            <ion-menu-toggle>
              <button class="">
                <ion-icon :icon="chevronBackOutline" />
              </button>
            </ion-menu-toggle>
          </div>
        </header>

        <nav class="flex-1 overflow-y-auto px-4 py-6 space-y-8 custom-scrollbar">
          
          <div class="space-y-1">
            <p class="px-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4">Menu</p>
            
            <router-link 
              v-for="item in menuItems" 
              :key="item.name"
              :to="{ name: item.routeName }"
              custom
              v-slot="{ navigate, isActive }"
            >
              <button 
                @click="handleNavigate(navigate)"
                :class="[
                  'w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 relative group',
                  isActive 
                    ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' 
                    : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5'
                ]"
              >
                <div v-if="isActive" class="absolute left-0 w-1 h-6 bg-indigo-600 rounded-r-full"></div>
                
                <ion-icon :icon="isActive ? item.activeIcon : item.icon" class="text-xl" />
                <span class="flex-1 text-left text-sm font-bold tracking-tight">{{ item.label }}</span>
                
                <div v-if="item.badge" class="h-2 w-2 rounded-full bg-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.6)]"></div>
              </button>
            </router-link>
          </div>

          

          <div class="space-y-1">
            <p class="px-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4">Resurslar</p>
            
            <div class="space-y-1">
              <button @click="toggleSection('inventory')" class="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                <ion-icon :icon="archiveOutline" class="text-xl opacity-70" />
                <span class="flex-1 text-left text-sm font-bold">Omborxona</span>
                <ion-icon :icon="chevronDownOutline" :class="{'rotate-180': openSections.inventory}" class="text-[10px] transition-transform" />
              </button>
              
              <transition name="expand">
                <div v-if="openSections.inventory" class="pl-12 space-y-1">
                  <router-link v-for="sub in inventorySubs" :to="{ name: sub.routeName }" class="block py-2 text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors">
                    {{ sub.label }}
                  </router-link>
                </div>
              </transition>
            </div>
          </div>
<div class="px-2">
            <div class="p-5 rounded-[24px] bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-white/5">
              <div class="flex items-center justify-between mb-3">
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Kassa</span>
                <ion-icon :icon="trendingUpOutline" class="text-emerald-500" />
              </div>
              <div class="text-xl font-black dark:text-white mb-3">4,280,000 <span class="text-[10px] text-slate-500 font-medium">UZS</span></div>
              <div class="h-1 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div class="h-full bg-indigo-600 w-[65%] rounded-full"></div>
              </div>
            </div>
          </div>
        </nav>

        <footer class="p-4 border-t border-slate-50 dark:border-white/5">
          <button @click="handleLogout" class="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl  text-rose-500 bg-rose-50 dark:bg-rose-500/5 transition-all group">
            <ion-icon :icon="logOutOutline" class="text-xl" />
            <span class="text-sm font-bold">Tizimdan chiqish</span>
          </button>
          <!-- <div class="mt-4 text-center">
            <span class="text-[9px] font-bold text-slate-300 dark:text-slate-700 uppercase tracking-[0.3em]">Version 1.0.4 • Active</span>
          </div> -->
        </footer>
      </div>
    </ion-content>
  </ion-menu>
</template>

<script setup>
import { ref } from 'vue';
import { IonMenu, IonContent, IonIcon, menuController } from '@ionic/vue';
import { 
  restaurant, flame, trophy, trophyOutline, 
  time, timeOutline, logOutOutline, chevronBackOutline,
  archiveOutline, chevronDownOutline, trendingUpOutline 
} from 'ionicons/icons';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

// Routelar nomlangan bo'lishi kerak (name: 'Home')
const menuItems = [
  { label: 'Dashboard', routeName: 'home', icon: flame, activeIcon: flame, badge: true },
  { label: 'Reyting', routeName: 'tables', icon: trophyOutline, activeIcon: trophy },
  { label: 'Tarix', routeName: 'profile', icon: timeOutline, activeIcon: time },
];

const inventorySubs = [
  { label: 'Mahsulotlar', routeName: 'menu' },
  { label: 'Kirim-chiqim', routeName: 'statistic' },
  { label: 'Chek sozlamalari', routeName: 'check' },
];

const openSections = ref({ inventory: false, staff: false });

const toggleSection = async (section) => {
  openSections.value[section] = !openSections.value[section];
  await hapticImpact(ImpactStyle.Light);
};

const handleNavigate = async (navigate) => {
  await hapticImpact(ImpactStyle.Light);
  await menuController.close();
  navigate();
};

const handleLogout = async () => {
  await hapticImpact(ImpactStyle.Medium);
  await menuController.close();
  window.location.href = '/landing/login';
};

const hapticImpact = async (style) => {
  try { await Haptics.impact({ style }); } catch (e) {}
};
</script>

<style scoped>
.custom-sidebar {
  --width: 300px;
  --max-width: 85%;
}

.custom-scrollbar::-webkit-scrollbar {
  display: none;
}

/* Accordion Animatsiyasi */
.expand-enter-active, .expand-leave-active {
  transition: all 0.3s ease-in-out;
  max-height: 200px;
  overflow: hidden;
}
.expand-enter-from, .expand-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-10px);
}

/* Safe areas for mobile */
header { padding-top: calc(env(safe-area-inset-top) + 1.5rem); }
footer { padding-bottom: calc(env(safe-area-inset-bottom) + 1rem); }
</style>