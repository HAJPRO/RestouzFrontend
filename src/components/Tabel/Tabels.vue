<template>
  <ion-page class="bg-slate-50 dark:bg-slate-950">
    <Modal />

    <ion-header class="ion-no-border">
      <div class="relative bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-100 dark:border-white/5 pt-safe overflow-hidden">
        
        <transition name="slide-fade">
          <div v-if="!isSearchActive" class="px-4 h-14 mt-10 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <Button @click="$router.back()" icon="fas fa-arrow-left" size="sm"  />
              <div class="mt-2">
                <h1 class="text-xl font-black text-slate-900 dark:text-white tracking-tighter leading-none mt-1">Stollar</h1>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <Button @click="toggleSearch" icon="fas fa-search" size="sm" />
              <Button @click="isCategoryModalOpen = true" icon="fas fa-filter" size="sm" />
              <Button @click="store.ModalAction()" icon="fas fa-plus" size="sm" class="!bg-indigo-600 !text-white shadow-lg shadow-indigo-500/20" />
            </div>
          </div>
        </transition>

        <transition name="search-slide">
          <div v-if="isSearchActive" class="px-4 h-14 mt-10 flex items-center gap-2 bg-white dark:bg-slate-950 shadow-sm">
            <div class="flex-1">
              <Input 
                v-model="searchQuery"
                size="small" 
                clearable 
                iconPre="fas fa-search" 
                placeholder="Stol raqami yoki sig'imi..." 
                autofocus
              />
            </div>
            <Button @click="toggleSearch" size="sm" icon="fas fa-xmark" class="mt-[-20px]"/>
          </div>
        </transition>

        <div v-if="!isSearchActive" class="px-4 py-3 flex gap-2 overflow-x-auto no-scrollbar border-t border-slate-50 dark:border-white/5">
          <button 
            v-for="filter in statusFilters" :key="filter.id"
            @click="activeStatus = filter.id"
            :class="[
              'px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider transition-all whitespace-nowrap',
              activeStatus === filter.id 
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-md' 
                : 'bg-slate-100 dark:bg-slate-900 text-slate-400 dark:text-slate-500'
            ]"
          >
            {{ filter.name }} ({{ getCount(filter.id) }})
          </button>
        </div>
      </div>
    </ion-header>

    <ion-content :fullscreen="true">
      <div class="max-w-full mx-auto px-5 py-6 pb-32">
        
        <div v-if="filteredTables.length > 0" class="grid grid-cols-2 gap-4">
          <div 
            v-for="table in filteredTables" :key="table.id"
            @click="handleTableClick(table)"
            :class="[
              'group relative bg-white dark:bg-slate-900 rounded-[35px] p-5 border transition-all duration-500 overflow-hidden active:scale-95 shadow-sm',
              table.status === 'available' ? 'border-slate-100 dark:border-white/5' : 'border-indigo-500/20 ring-1 ring-indigo-500/5'
            ]"
          >
            <div :class="['absolute top-0 left-0 w-full h-1.5 transition-colors duration-500', getStatusColor(table.status)]"></div>

            <div class="flex justify-between items-start mb-5">
              <div class="space-y-0.5">
                <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Stol</span>
                <h3 class="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{{ table.no }}</h3>
              </div>
              
              <div :class="['w-10 h-10 rounded-2xl flex items-center justify-center transition-all shadow-inner', getStatusBg(table.status)]">
                <ion-icon :icon="table.status === 'available' ? addOutline : cartOutline" class="text-lg" />
              </div>
            </div>

            <div class="min-h-[55px] flex flex-col justify-end">
              <div v-if="table.status !== 'available'" class="space-y-2">
                <div class="flex items-center gap-2">
                  <div class="flex items-center gap-1 bg-slate-50 dark:bg-slate-800/50 px-2 py-1 rounded-lg border border-slate-100 dark:border-white/5">
                    <ion-icon :icon="timeOutline" class="text-[10px] text-slate-400" />
                    <span class="text-[10px] font-bold text-slate-500">{{ table.timer }}</span>
                  </div>
                </div>
                <div class="text-[16px] font-black text-indigo-600 dark:text-indigo-400 leading-none">
                  {{ table.total.toLocaleString() }} <small class="text-[9px] uppercase font-bold opacity-60">uzs</small>
                </div>
              </div>

              <div v-else class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span class="text-[11px] font-black uppercase tracking-widest text-emerald-500">Bo'sh</span>
                </div>
                <p class="text-[10px] font-bold text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-md">{{ table.capacity }} kishilik</p>
              </div>
            </div>

            <div class="absolute inset-0 bg-indigo-600/5 opacity-0 group-active:opacity-100 transition-opacity"></div>
          </div>
        </div>

        <div v-else class="flex flex-col items-center justify-center py-20 text-center">
          <div class="w-16 h-16 bg-slate-100 dark:bg-slate-900 rounded-3xl flex items-center justify-center text-slate-300 mb-4">
            <ion-icon :icon="pulseOutline" class="text-3xl" />
          </div>
          <h3 class="text-slate-800 dark:text-white font-bold">Stollar topilmadi</h3>
          <p class="text-xs text-slate-400 mt-1">Filterni o'zgartirib ko'ring</p>
        </div>
      </div>
    </ion-content>

    <Footer />
  </ion-page>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { modalController, IonPage, IonHeader, IonContent, IonIcon } from '@ionic/vue';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

// UI & Components
import { TabelStore } from "../../stores/index.store";
import { Button, Input } from "../../UI/UI";
import Footer from '../../partials/Footer.vue';
import Modal from '../../components/Tabel/ActionModal.vue';
import CartModal from '../../components/Menu/Cart.vue'; // Savatcha modali yo'li

// Icons
import { 
  personOutline, timeOutline, searchOutline, arrowBackOutline,
  pulseOutline, addOutline, cartOutline, closeOutline
} from 'ionicons/icons';

const router = useRouter();
const store = TabelStore();

// --- STATE ---
const isSearchActive = ref(false);
const searchQuery = ref("");
const activeStatus = ref('all');
const isCategoryModalOpen = ref(false);

const statusFilters = [
  { id: 'all', name: 'Barchasi' },
  { id: 'available', name: 'Bo\'sh' },
  { id: 'occupied', name: 'Band' },
  { id: 'waiting', name: 'Hisob' }
];

const tables = ref([
  { id: 1, no: 'T-01', capacity: 4, status: 'occupied', timer: '45 min', total: 450000 },
  { id: 2, no: 'T-02', capacity: 2, status: 'available', timer: '', total: 0 },
  { id: 3, no: 'T-03', capacity: 6, status: 'waiting', timer: '1 soat', total: 1200000 },
  { id: 4, no: 'T-04', capacity: 4, status: 'occupied', timer: '12 min', total: 180000 },
  { id: 5, no: 'T-05', capacity: 8, status: 'available', timer: '', total: 0 },
  { id: 6, no: 'T-06', capacity: 2, status: 'occupied', timer: '30 min', total: 85000 }
]);

// --- COMPUTED ---
const filteredTables = computed(() => {
  return tables.value.filter(t => {
    const matchStatus = activeStatus.value === 'all' || t.status === activeStatus.value;
    const matchSearch = t.no.toLowerCase().includes(searchQuery.value.toLowerCase());
    return matchStatus && matchSearch;
  });
});

const getCount = (status) => {
  if (status === 'all') return tables.value.length;
  return tables.value.filter(t => t.status === status).length;
};

// --- ACTIONS ---
const toggleSearch = async () => {
  isSearchActive.value = !isSearchActive.value;
  if (!isSearchActive.value) searchQuery.value = "";
  await Haptics.impact({ style: ImpactStyle.Light });
};

const handleTableClick = async (table) => {
  await Haptics.impact({ style: ImpactStyle.Medium });

  // 1. BO'SH STOL -> MENYUGA YO'NALTIRISH
  if (table.status === 'available') {
    router.push({
      name: 'menu', // Menyu sahifangiz yo'li
    //   query: { table: table.no, id: table.id }
    });
  } 
  
  // 2. BAND STOL -> SAVATCHANI MODALDA OCHISH
  else {
    const modal = await modalController.create({
      component: CartModal,
      componentProps: {
        tableInfo: table,
        items: [], // Bu yerda store'dan joriy stol buyurtmalarini berasiz
        isWaiting: table.status === 'waiting'
      },
      initialBreakpoint: 0.8,
      breakpoints: [0, 0.8, 1],
      cssClass: 'cart-modal-custom'
    });
    return modal.present();
  }
};

// --- STYLE HELPERS ---
const getStatusColor = (s) => {
  if (s === 'available') return 'bg-emerald-500';
  if (s === 'occupied') return 'bg-rose-500';
  if (s === 'waiting') return 'bg-amber-500';
  return 'bg-slate-200';
};

const getStatusBg = (s) => {
  if (s === 'available') return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10';
  if (s === 'occupied') return 'bg-rose-50 text-rose-600 dark:bg-rose-500/10';
  if (s === 'waiting') return 'bg-amber-50 text-amber-600 dark:bg-amber-500/10';
};
</script>

<style scoped>
/* Animations */
.search-slide-enter-active, .search-slide-leave-active { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.search-slide-enter-from { transform: translateY(-100%); opacity: 0; }
.search-slide-leave-to { transform: translateY(-20px); opacity: 0; }

.slide-fade-enter-active, .slide-fade-leave-active { transition: all 0.3s ease; }
.slide-fade-enter-from, .slide-fade-leave-to { opacity: 0; transform: scale(0.95); }

/* Utilities */
.no-scrollbar::-webkit-scrollbar { display: none; }
ion-content { --padding-bottom: 100px; }
* { -webkit-tap-highlight-color: transparent; }
</style>