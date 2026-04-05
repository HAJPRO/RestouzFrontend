<template>
  <ion-page class="bg-slate-50 dark:bg-slate-950">
    <Modal />
   <Header 
    title="Stollar" 
    searchable 
    v-model="searchQuery"
    searchPlaceholder="Taom izlash..."
  >
    <template #actions>
              <BaseTabs 
                v-model="activeStatus" 
                :tabs="statusFilters"
                @change="onCategoryChange"
              />

              <Button 
                @click="store.ModalAction()" 
                icon="fas fa-plus" 
                size="sm" 
                class="!bg-indigo-600 !text-white shadow-lg shadow-indigo-500/20" 
              />
    </template>
  </Header>

    <ion-content :fullscreen="true">
      <div class="max-w-full mx-auto px-5 py-6 pb-32">
        
        <div v-if="filteredTables.length > 0" class="grid grid-cols-2 gap-4">
          <div 
            v-for="table in filteredTables" :key="table.id"
            @click="handleTableClick(table)"
            :class="[
              'group relative bg-white dark:bg-slate-900 rounded-[35px] p-5 border transition-all duration-500 active:scale-95 shadow-sm overflow-hidden',
              table.status === 'available' ? 'border-slate-100 dark:border-white/5' : 'border-indigo-500/20 ring-1 ring-indigo-500/5'
            ]"
          >
            <div :class="['absolute top-0 left-0 w-full h-1.5', getStatusLineColor(table.status)]"></div>

            <div class="flex justify-between items-start mb-5">
              <div class="space-y-0.5">
                <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Stol</span>
                <h3 class="text-xl font-black text-slate-900 dark:text-white tracking-tighter">{{ table.no }}</h3>
              </div>
              
              <div :class="['w-10 h-10 rounded-2xl flex items-center justify-center shadow-inner', getStatusIconBg(table.status)]">
                <ion-icon :icon="table.status === 'available' ? addOutline : cartOutline" class="text-lg" />
              </div>
            </div>

            <div class="min-h-[55px] flex flex-col justify-end">
              <div v-if="table.status !== 'available'" class="space-y-2">
                <div class="flex items-center gap-1 bg-slate-50 dark:bg-slate-800/50 px-2 py-1 rounded-lg w-fit">
                  <ion-icon :icon="timeOutline" class="text-[10px] text-slate-400" />
                  <span class="text-[10px] font-bold text-slate-500">{{ table.timer }}</span>
                </div>
                <div class="text-[16px] font-black text-indigo-600 dark:text-indigo-400">
                  {{ table.total.toLocaleString() }} <small class="text-[9px] uppercase opacity-60">uzs</small>
                </div>
              </div>

              <div v-else class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span class="text-[11px] font-black uppercase text-emerald-500">Bo'sh</span>
                </div>
                <p class="text-[10px] font-bold text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-md">{{ table.capacity }}kishi</p>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="flex flex-col items-center justify-center py-20 text-center">
          <div class="w-16 h-16 bg-slate-100 dark:bg-slate-900 rounded-3xl flex items-center justify-center text-slate-300 mb-4">
            <ion-icon :icon="pulseOutline" class="text-3xl" />
          </div>
          <h3 class="text-slate-800 dark:text-white font-bold">Stollar topilmadi</h3>
          <p class="text-xs text-slate-400 mt-1">Tanlangan filtr bo'yicha ma'lumot yo'q</p>
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

// UI Components
import { TabelStore } from "../../stores/index.store";
import { Button, Input ,BaseTabs,Header} from "../../UI/UI";
import Footer from '../../partials/Footer.vue';
import Modal from '../../components/Tabel/ActionModal.vue';
import CartModal from '../../components/Menu/Cart.vue';

// Icons
import { timeOutline, pulseOutline, addOutline, cartOutline } from 'ionicons/icons';

const router = useRouter();
const store = TabelStore();

// --- STATE ---
const isSearchActive = ref(false);
const searchQuery = ref("");
const activeStatus = ref('all'); // Filtr mantiqi shunga bog'langan

const statusFilters = [
  { id: 'all', label: 'Barchasi', icon: 'fas fa-border-all' },
  { id: 'available', label: 'Bo\'shlar', icon: 'fas fa-check-circle' },
  { id: 'occupied', label: 'Bandlar', icon: 'fas fa-user-clock' },
  { id: 'waiting', label: 'Hisob kutilmoqda', icon: 'fas fa-file-invoice-dollar' }
];

const tables = ref([
  { id: 1, no: 'T-01', capacity: 4, status: 'occupied', timer: '45 min', total: 450000 },
  { id: 2, no: 'T-02', capacity: 2, status: 'available', timer: '', total: 0 },
  { id: 3, no: 'T-03', capacity: 6, status: 'waiting', timer: '1 soat', total: 1200000 },
  { id: 4, no: 'T-04', capacity: 4, status: 'occupied', timer: '12 min', total: 180000 },
  { id: 5, no: 'T-05', capacity: 8, status: 'available', timer: '', total: 0 },
  { id: 6, no: 'T-06', capacity: 2, status: 'occupied', timer: '30 min', total: 85000 }
]);

// --- FILTER LOGIC ---
const filteredTables = computed(() => {
  return tables.value.filter(t => {
    const matchStatus = activeStatus.value === 'all' || t.status === activeStatus.value;
    const matchSearch = t.no.toLowerCase().includes(searchQuery.value.toLowerCase());
    return matchStatus && matchSearch;
  });
});

const onCategoryChange = async (id) => {
  activeStatus.value = id;
  await Haptics.impact({ style: ImpactStyle.Light });
};

// --- ACTIONS ---
const toggleSearch = async () => {
  isSearchActive.value = !isSearchActive.value;
  if (!isSearchActive.value) searchQuery.value = "";
  await Haptics.impact({ style: ImpactStyle.Light });
};

const handleTableClick = async (table) => {
  await Haptics.impact({ style: ImpactStyle.Medium });

  if (table.status === 'available') {
    router.push({ name: 'menu' });
  } else {
    const modal = await modalController.create({
      component: CartModal,
      componentProps: { tableInfo: table },
      initialBreakpoint: 0.8,
      breakpoints: [0, 0.8, 1],
    });
    return modal.present();
  }
};

// --- STYLE HELPERS ---
const getStatusLineColor = (s) => {
  const colors = { available: 'bg-emerald-500', occupied: 'bg-rose-500', waiting: 'bg-amber-500' };
  return colors[s] || 'bg-slate-200';
};

const getStatusIconBg = (s) => {
  const bgs = {
    available: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10',
    occupied: 'bg-rose-50 text-rose-600 dark:bg-rose-500/10',
    waiting: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10'
  };
  return bgs[s] || 'bg-slate-100';
};
</script>

<style scoped>
.search-slide-enter-active, .search-slide-leave-active { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.search-slide-enter-from { transform: translateY(-50%); opacity: 0; }

.slide-fade-enter-active, .slide-fade-leave-active { transition: all 0.3s ease; }
.slide-fade-enter-from, .slide-fade-leave-to { opacity: 0; transform: translateY(10px); }

ion-content { --padding-bottom: 120px; }
</style>