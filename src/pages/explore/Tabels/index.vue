<template>
  <ion-page class="bg-slate-50 dark:bg-slate-950">
  <Modal/>
  <ion-header class="ion-no-border">
  <div class="bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl pt-safe border-b border-slate-100 dark:border-white/5">
    
    <div class="max-w-full mx-auto px-3 h-12 flex items-center justify-between pt-14 mb-6">
      <div class="flex items-center gap-2"> <button 
          @click="$router.back()" 
          class="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 flex items-center justify-center active:scale-95 transition-all"
        >
          <ion-icon :icon="arrowBackOutline" class="text-lg" />
        </button>

        <h1 class="text-base font-bold text-slate-900 dark:text-white tracking-tight mt-3">
          Stollar
        </h1>
      </div>
<div class="flex gap-2">
      <button class="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-500 flex items-center justify-center active:scale-95 transition-all">
        <ion-icon :icon="searchOutline" class="text-base" />
      </button>
      <button @click="store.ModalAction()" class="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-500 flex items-center justify-center active:scale-95 transition-all">
  <ion-icon :icon="addOutline" class="text-base" />
</button>
      </div>
    </div>

    <div class="max-w-md mx-auto px-3 pb-3 mt-1 overflow-x-auto no-scrollbar flex gap-2">
      <button 
        v-for="cat in categories" :key="cat.id"
        @click="activeCategory = cat.id"
        :class="[
          'px-4 py-1.5 rounded-xl text-[12px] font-semibold whitespace-nowrap transition-all duration-300',
          activeCategory === cat.id 
            ? 'bg-indigo-600 text-white shadow-md' 
            : 'bg-white dark:bg-slate-900 text-slate-400 border border-slate-100 dark:border-white/5'
        ]"
      >
        {{ cat.name }}
      </button>
    </div>
  </div>
</ion-header>

    <ion-content :fullscreen="true">
      <div class="max-w-full mx-auto px-5 py-6">
        
        <div class="grid grid-cols-2 gap-4">
          <div 
            v-for="table in filteredTables" :key="table.id"
            @click="openTableDetails(table)"
            class="group relative bg-white dark:bg-slate-900 rounded-[32px] p-5 border border-slate-100 dark:border-white/5 shadow-sm active:scale-[0.97] transition-all duration-300 overflow-hidden"
          >
            <div :class="['absolute top-0 left-0 w-full h-1.5', getStatusColor(table.status)]"></div>

            <div class="flex justify-between items-start mb-4">
              <div class="space-y-1">
                <h3 class="text-2xl font-black text-slate-800 dark:text-white tracking-tighter">{{ table.no }}</h3>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{{ table.capacity }} kishilik</p>
              </div>
              <div :class="['w-8 h-8 rounded-full flex items-center justify-center bg-opacity-10', getStatusBg(table.status)]">
                <ion-icon :icon="personOutline" :class="['text-sm', getStatusText(table.status)]" />
              </div>
            </div>

            <div class="space-y-3">
              <div v-if="table.status !== 'available'" class="flex flex-col gap-1">
                <div class="flex items-center gap-1.5 text-slate-400">
                  <ion-icon :icon="timeOutline" class="text-[10px]" />
                  <span class="text-[11px] font-bold">{{ table.timer }}</span>
                </div>
                <div class="text-[13px] font-black text-slate-800 dark:text-slate-200">
                  {{ table.total.toLocaleString() }} <small class="text-[9px] opacity-50">so'm</small>
                </div>
              </div>

              <div v-else class="flex items-center gap-1.5 text-emerald-500">
                <div class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                <span class="text-[11px] font-black uppercase tracking-tight">Bo'sh</span>
              </div>
            </div>

            <div class="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <ion-icon :icon="chevronForwardCircleOutline" class="text-2xl text-indigo-600" />
            </div>
          </div>
        </div>

      </div>
    </ion-content>
    <Footer/>
  </ion-page>
</template>

<script setup>

import { ref, computed } from 'vue';
import {TabelStore} from "../../../stores/index.store"

import { IonPage, IonHeader, IonContent, IonIcon } from '@ionic/vue';
import { 
  personOutline, 
  timeOutline, chevronForwardCircleOutline,searchOutline,arrowBackOutline,
  pulseOutline,
  addOutline,
  
} from 'ionicons/icons';
import Footer from '../../../partials/Footer.vue';
import Modal from '../../../components/Tabel/ActionModal.vue';
import { storeToRefs } from 'pinia';
const store = TabelStore();
const {} = storeToRefs(store)
const activeStatus = ref('all');

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

const filteredTables = computed(() => {
  if (activeStatus.value === 'all') return tables.value;
  return tables.value.filter(t => t.status === activeStatus.value);
});

const getCount = (status) => {
  if (status === 'all') return tables.value.length;
  return tables.value.filter(t => t.status === status).length;
};

// Ranglar mantig'i
const getStatusColor = (s) => {
  if (s === 'available') return 'bg-emerald-500';
  if (s === 'occupied') return 'bg-rose-500';
  if (s === 'waiting') return 'bg-amber-500';
  return 'bg-slate-200';
};

const getStatusBg = (s) => {
  if (s === 'available') return 'bg-emerald-100 text-emerald-600';
  if (s === 'occupied') return 'bg-rose-100 text-rose-600';
  if (s === 'waiting') return 'bg-amber-100 text-amber-600';
};

const getStatusText = (s) => {
  if (s === 'available') return 'text-emerald-600';
  if (s === 'occupied') return 'text-rose-600';
  if (s === 'waiting') return 'text-amber-600';
};

const openTableDetails = (table) => {
  console.log('Stol ochildi:', table.no);
};
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
header { backdrop-filter: blur(20px); }
* { -webkit-tap-highlight-color: transparent; }
</style>