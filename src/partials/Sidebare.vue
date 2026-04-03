<template>
  <ion-menu content-id="main-content" type="overlay" class="custom-sidebar">
    <ion-content class="ion-no-padding" :scroll-y="false">
      <div class="flex flex-col h-full bg-white dark:bg-[#020617] transition-colors duration-500">
        
        <header class="p-6 pb-2">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <ion-icon :icon="restaurant" class="text-white text-xl" />
              </div>
              <h1 class="text-xl font-black tracking-tighter dark:text-white">
                Resto<span class="text-indigo-600 italic">.uz</span>
              </h1>
            </div>
            <ion-menu-toggle>
              <button class="text-slate-400 hover:text-indigo-600 transition-colors">
                <ion-icon :icon="chevronBackOutline" class="text-xl" />
              </button>
            </ion-menu-toggle>
          </div>
        </header>

        <nav class="flex-1 overflow-y-auto px-4 py-6 space-y-6 custom-scrollbar">
          
          <div class="space-y-1">
            <p class="px-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4">Statistika</p>
            <router-link
              v-for="item in menuItems"
              :key="item.routeName"
              :to="{ name: item.routeName }"
              custom
              v-slot="{ navigate, isActive }"
            >
              <button
                @click="handleNavigate(navigate)"
                :class="[
                  'w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 relative group',
                  isActive ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5'
                ]"
              >
                <div v-if="isActive" class="absolute left-0 w-1 h-6 bg-indigo-600 rounded-r-full"></div>
                <ion-icon :icon="isActive ? item.activeIcon : item.icon" class="text-xl" />
                <span class="flex-1 text-left text-sm font-bold tracking-tight">{{ item.label }}</span>
                <div v-if="item.badge" class="h-2 w-2 rounded-full bg-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.6)] animate-pulse"></div>
              </button>
            </router-link>
          </div>

          <div class="space-y-1">
            <p class="px-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4">Boshqaruv</p>
            
            <div class="space-y-1">
              <button @click="toggleSection('staff')" 
                class="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                <ion-icon :icon="peopleOutline" class="text-xl opacity-70" />
                <span class="flex-1 text-left text-sm font-bold">Xodimlar</span>
                <ion-icon :icon="chevronDownOutline" :class="{ 'rotate-180': openSections.staff }" class="text-[10px] transition-transform" />
              </button>
              <transition name="expand">
                <div v-if="openSections.staff" class="ml-4 pl-8 border-l-2 border-slate-100 dark:border-slate-800 space-y-1">
                  <router-link v-for="sub in staffSubs" :key="sub.routeName" :to="{ name: sub.routeName }" @click="closeMenuOnly"
                    class="flex items-center gap-3 py-2.5 text-sm font-bold text-slate-400 hover:text-indigo-600 transition-all">
                    <ion-icon :icon="sub.icon" class="text-[14px]" /> {{ sub.label }}
                  </router-link>
                </div>
              </transition>
            </div>

            <div class="space-y-1">
              <button @click="toggleSection('supply')" 
                class="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                <ion-icon :icon="briefcaseOutline" class="text-xl opacity-70" />
                <span class="flex-1 text-left text-sm font-bold">Ta'minot</span>
                <ion-icon :icon="chevronDownOutline" :class="{ 'rotate-180': openSections.supply }" class="text-[10px] transition-transform" />
              </button>
              <transition name="expand">
                <div v-if="openSections.supply" class="ml-4 pl-8 border-l-2 border-slate-100 dark:border-slate-800 space-y-1">
                  <router-link v-for="sub in supplySubs" :key="sub.routeName" :to="{ name: sub.routeName }" @click="closeMenuOnly"
                    class="flex items-center gap-3 py-2.5 text-sm font-bold text-slate-400 hover:text-indigo-600 transition-all">
                    <ion-icon :icon="sub.icon" class="text-[14px]" /> {{ sub.label }}
                  </router-link>
                </div>
              </transition>
            </div>

            <div class="space-y-1">
              <button @click="toggleSection('orders')" 
                class="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                <ion-icon :icon="receiptOutline" class="text-xl opacity-70" />
                <span class="flex-1 text-left text-sm font-bold">Buyurtmalar</span>
                <ion-icon :icon="chevronDownOutline" :class="{ 'rotate-180': openSections.orders }" class="text-[10px] transition-transform" />
              </button>
              <transition name="expand">
                <div v-if="openSections.orders" class="ml-4 pl-8 border-l-2 border-slate-100 dark:border-slate-800 space-y-1">
                  <router-link v-for="sub in orderSubs" :key="sub.routeName" :to="{ name: sub.routeName }" @click="closeMenuOnly"
                    class="flex items-center gap-3 py-2.5 text-sm font-bold text-slate-400 hover:text-indigo-600 transition-all">
                    <ion-icon :icon="sub.icon" class="text-[14px]" /> {{ sub.label }}
                  </router-link>
                </div>
              </transition>
            </div>
   <div class="space-y-1">
              <button @click="toggleSection('inventory')" 
                class="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                <ion-icon :icon="layersOutline" class="text-xl opacity-70" />
                <span class="flex-1 text-left text-sm font-bold">TMO</span>
                <ion-icon :icon="chevronDownOutline" :class="{ 'rotate-180': openSections.inventory }" class="text-[10px] transition-transform" />
              </button>
              <transition name="expand">
                <div v-if="openSections.inventory" class="ml-4 pl-8 border-l-2 border-slate-100 dark:border-slate-800 space-y-1">
                  <router-link v-for="sub in tmoSubs" :key="sub.routeName" :to="{ name: sub.routeName }" @click="closeMenuOnly"
                    class="flex items-center gap-3 py-2.5 text-sm font-bold text-slate-400 hover:text-indigo-600 transition-all">
                    <ion-icon :icon="sub.icon" class="text-[14px]" /> {{ sub.label }}
                  </router-link>
                </div>
              </transition>
            </div>
            <div class="space-y-1">
              <button @click="toggleSection('inventory')" 
                class="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                <ion-icon :icon="archiveOutline" class="text-xl opacity-70" />
                <span class="flex-1 text-left text-sm font-bold">Omborxona</span>
                <ion-icon :icon="chevronDownOutline" :class="{ 'rotate-180': openSections.inventory }" class="text-[10px] transition-transform" />
              </button>
              <transition name="expand">
                <div v-if="openSections.inventory" class="ml-4 pl-8 border-l-2 border-slate-100 dark:border-slate-800 space-y-1">
                  <router-link v-for="sub in inventorySubs" :key="sub.routeName" :to="{ name: sub.routeName }" @click="closeMenuOnly"
                    class="flex items-center gap-3 py-2.5 text-sm font-bold text-slate-400 hover:text-indigo-600 transition-all">
                    <ion-icon :icon="sub.icon" class="text-[14px]" /> {{ sub.label }}
                  </router-link>
                </div>
              </transition>
            </div>
          </div>

          <div class="space-y-1">
            <p class="px-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4">Sozlamalar</p>
            <div class="space-y-1">
              <button @click="toggleSection('settings')" 
                class="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                <ion-icon :icon="settingsOutline" class="text-xl opacity-70" />
                <span class="flex-1 text-left text-sm font-bold">Tizim sozlamalari</span>
                <ion-icon :icon="chevronDownOutline" :class="{ 'rotate-180': openSections.settings }" class="text-[10px] transition-transform" />
              </button>
              <transition name="expand">
                <div v-if="openSections.settings" class="ml-4 pl-8 border-l-2 border-slate-100 dark:border-slate-800 space-y-1">
                  <router-link v-for="sub in staffSubs" :key="sub.routeName" :to="{ name: sub.routeName }" @click="closeMenuOnly"
                    class="flex items-center gap-3 py-2.5 text-[12px] font-bold text-slate-500 hover:text-indigo-600 transition-all">
                    <ion-icon :icon="sub.icon" class="text-[14px]" /> {{ sub.label }}
                  </router-link>
                </div>
              </transition>
            </div>
          </div>
        </nav>

        <footer class="p-4 border-t border-slate-50 dark:border-white/5">
          <button @click="handleLogout" class="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-rose-500 bg-rose-50 dark:bg-rose-500/5 transition-all active:scale-95 group">
            <ion-icon :icon="logOutOutline" class="text-xl group-hover:rotate-180 transition-transform duration-500" />
            <span class="text-sm font-bold uppercase tracking-wider">Tizimdan chiqish</span>
          </button>
        </footer>
      </div>
    </ion-content>
  </ion-menu>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { IonMenu, IonContent, IonIcon, menuController, IonMenuToggle } from "@ionic/vue";
import {
  restaurant, flame, trophy, trophyOutline, time, timeOutline, logOutOutline,
  chevronBackOutline, archiveOutline, chevronDownOutline, peopleOutline,
  cartOutline, receiptOutline, settingsOutline, ribbonOutline, shieldCheckmarkOutline,
  cubeOutline, clipboardOutline, listOutline, personOutline, swapVerticalOutline, printOutline,
  cashOutline,
  layersOutline,
  briefcaseOutline
} from "ionicons/icons";
import { Haptics, ImpactStyle } from "@capacitor/haptics";

const router = useRouter();

// Bo'limlarning ochilish holati
const openSections = ref({
  staff: false,
  supply: false,
  orders: false,
  inventory: false,
  settings: false
});

const menuItems = [
  { label: "Dashboard", routeName: "home", icon: flame, activeIcon: flame, badge: true },
  { label: "Reyting", routeName: "tables", icon: trophyOutline, activeIcon: trophy },
  { label: "Tarix", routeName: "profile", icon: timeOutline, activeIcon: time },
];

const staffSubs = [
  { label: "Foydalanuvchilar", routeName: "home", icon: personOutline },
  { label: "Rollar", routeName: "home", icon: ribbonOutline },
  { label: "Ruxsatlar", routeName: "home", icon: shieldCheckmarkOutline },
  { label: "Chek sozlamalari", routeName: "check", icon: printOutline },

];

const supplySubs = [
  { label: "Xaridlar", routeName: "home", icon: cartOutline },
  { label: "Yetkazib beruvchilar", routeName: "home", icon: peopleOutline },
];

const orderSubs = [
  { label: "Aktiv buyurtmalar", routeName: "home", icon: flame },
  { label: "Barcha buyurtmalar", routeName: "home", icon: listOutline },
];

const inventorySubs = [
  { label: "Mahsulotlar", routeName: "menu", icon: cubeOutline },
  { label: "Kirim-chiqim", routeName: "statistic", icon: swapVerticalOutline },
];
const tmoSubs = [
  { label: "Mahsulotlar", routeName: "menu", icon: cubeOutline },
  { label: "Kirim-chiqim", routeName: "statistic", icon: swapVerticalOutline },
  { label: "Sotuv qilish", routeName: "statistic", icon: cashOutline },
];

const settingsSubs = [
  { label: "Tizim sozlamasi", routeName: "check", icon: settingsOutline },
];

const toggleSection = async (section) => {
  // Boshqa hamma bo'limlarni yopish (Accordion effect)
  Object.keys(openSections.value).forEach(key => {
    if (key !== section) openSections.value[key] = false;
  });
  openSections.value[section] = !openSections.value[section];
  await hapticImpact(ImpactStyle.Light);
};

const handleNavigate = async (navigate) => {
  await hapticImpact(ImpactStyle.Light);
  await menuController.close();
  navigate();
};

const closeMenuOnly = async () => {
  await hapticImpact(ImpactStyle.Light);
  await menuController.close();
};

const handleLogout = async () => {
  await hapticImpact(ImpactStyle.Medium);
  await menuController.close();
  localStorage.removeItem("token");
  window.location.href = "/landing/login";
};

const hapticImpact = async (style) => {
  try { await Haptics.impact({ style }); } catch (e) {}
};
</script>

<style scoped>
.custom-sidebar {
  --width: 310px;
}

.custom-scrollbar::-webkit-scrollbar {
  display: none;
}

/* Accordion Animation */
.expand-enter-active, .expand-leave-active {
  transition: all 0.3s ease-in-out;
  max-height: 250px;
  overflow: hidden;
}
.expand-enter-from, .expand-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-10px);
}

/* Mobile Safe Areas */
header { padding-top: calc(env(safe-area-inset-top) + 1rem); }
footer { padding-bottom: calc(env(safe-area-inset-bottom) + 1rem); }
</style>