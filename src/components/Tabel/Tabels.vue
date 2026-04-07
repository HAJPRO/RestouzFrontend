<template>
  <ion-page class="bg-slate-50 dark:bg-slate-950">
    <Modal />
    
    <Header 
      title="Stollar" 
      searchable 
      v-model="searchQuery"
      searchPlaceholder="Stol raqami orqali izlash..."
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
      <GlobalRefresher />
      
      <div class="max-w-full mx-auto px-5 py-6 pb-32">
        <div v-if="filteredTables.length > 0" class="grid grid-cols-2 gap-4">
          <div 
            v-for="table in filteredTables" 
            :key="table.id"
            @click="handleTableClick(table)"
            :class="[
              'group relative bg-white dark:bg-slate-900 rounded-[35px] p-5 border transition-all duration-500 active:scale-95 shadow-sm overflow-hidden cursor-pointer',
              table.status === '0' ? 'border-slate-100 dark:border-white/5' : 'border-indigo-500/20 ring-1 ring-indigo-500/5'
            ]"
          >
            <div :class="['absolute top-0 left-0 w-full h-1.5 transition-colors duration-500', getStatusColor(table.status).line]"></div>

            <div class="flex justify-between items-start mb-5">
              <div class="space-y-0.5">
                <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Stol</span>
                <div class="flex items-center gap-2">
                  <h3 class="text-xl font-black text-slate-900 dark:text-white tracking-tighter">{{ table.number }}</h3>
                  
                  <ActionMenu 
                    :items="getTableActions(table)" 
                    :title="`Stol #${table.number}`"
                    @click.stop 
                  />
                </div>
              </div>
              
              <div :class="['w-10 h-10 rounded-2xl flex items-center justify-center shadow-inner transition-all duration-300', getStatusColor(table.status).iconBg]">
                <ion-icon :icon="getStatusIcon(table.status)" class="text-lg" />
              </div>
            </div>

            <div class="min-h-[65px] flex flex-col justify-end">
              
              <div v-if="['1', '3'].includes(table.status)" class="space-y-2">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/50 px-2 py-1 rounded-lg">
                    <ion-icon :icon="timeOutline" class="text-[11px] text-slate-400" />
                    <span class="text-[11px] font-bold text-slate-500">{{ table.timer || '00:00' }}</span>
                  </div>
                  <span :class="['text-[10px] font-black uppercase tracking-wider', getStatusColor(table.status).text]">
                    {{ getStatusLabel(table.status) }}
                  </span>
                </div>
                <div :class="['text-[17px] font-black flex items-baseline gap-1', getStatusColor(table.status).text]">
                  {{ table.total ? table.total.toLocaleString() : '0' }}
                  <span class="text-[9px] font-medium opacity-60 uppercase">uzs</span>
                </div>
              </div>

              <div v-else-if="table.status === '0'" class="flex items-center justify-between border-t border-slate-50 dark:border-slate-800/50 pt-3">
                <div class="flex items-center gap-2">
                  <div class="relative flex h-2 w-2">
                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </div>
                  <span class="text-[11px] font-black uppercase text-emerald-500 tracking-tight">Bo'sh</span>
                </div>
                <div class="flex items-center gap-1 text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-md">
                  <i class="fa-solid fa-user-group text-[9px]"></i>
                  <span class="text-[10px] font-bold">{{ table.capacity || 4 }}</span>
                </div>
              </div>

              <div v-else class="flex flex-col gap-1 border-t border-slate-50 dark:border-slate-800/50 pt-3">
                <div class="flex items-center gap-2">
                  <div :class="['w-2 h-2 rounded-full', table.status === '2' ? 'bg-blue-500' : 'bg-slate-400']"></div>
                  <span :class="['text-[11px] font-black uppercase tracking-tight', getStatusColor(table.status).text]">
                    {{ getStatusLabel(table.status) }}
                  </span>
                </div>
                <p v-if="table.status === '2'" class="text-[10px] text-slate-400 font-medium truncate italic">
                   Rezerv: {{ table.reserve_time || 'Bugun 19:00' }}
                </p>
                <p v-else class="text-[10px] text-slate-400 font-medium">Vaqtinchalik yopiq</p>
              </div>

            </div>
          </div>
        </div>

        <div v-else class="flex flex-col items-center justify-center py-24 text-center">
          <div class="w-20 h-20 bg-white dark:bg-slate-900 rounded-[30px] shadow-sm flex items-center justify-center text-slate-200 mb-5 border border-slate-100 dark:border-slate-800">
            <ion-icon :icon="pulseOutline" class="text-4xl" />
          </div>
          <h3 class="text-slate-800 dark:text-white font-bold text-lg">Ma'lumot mavjud emas</h3>
          <p class="text-sm text-slate-400 mt-1 max-w-[200px]">Ushbu kategoriya bo'yicha stollar topilmadi</p>
        </div>
      </div>
    </ion-content>

    <div v-if="isCartOpen && selectedTable && ['1', '3'].includes(selectedTable.status)"> 
      <CartModal
        :tableInfo="selectedTable"
        @close="isCartOpen = false"
      />
    </div>

    <Footer />
  </ion-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { IonPage, IonContent, IonIcon } from '@ionic/vue';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { storeToRefs } from "pinia";

import { TabelStore } from "../../stores/index.store";
import { Button, BaseTabs, Header, GlobalRefresher, ActionMenu } from "../../UI/UI";
import Footer from '../../partials/Footer.vue';
import Modal from '../../components/Tabel/ActionModal.vue';
import CartModal from '../../components/Menu/Cart.vue';

import { 
  timeOutline, pulseOutline, addOutline, cartOutline, 
  walletOutline, bookmarkOutline, constructOutline 
} from 'ionicons/icons';

const router = useRouter();
const store = TabelStore();
const { tabels } = storeToRefs(store);

const searchQuery = ref("");
const activeStatus = ref('all');
const isCartOpen = ref(false);
const selectedTable = ref(null);

const statusFilters = [
  { id: 'all', label: 'Barchasi', icon: 'fas fa-border-all' },
  { id: '0',   label: 'Bo\'sh', icon: 'fas fa-check-circle' },
  { id: '1',   label: 'Band', icon: 'fas fa-user-clock' },
  { id: '2',   label: 'Bron', icon: 'fas fa-bookmark' },
  { id: '3',   label: 'Hisob', icon: 'fas fa-money-bill-wave' },
  { id: '-1',  label: 'Ta\'mir', icon: 'fas fa-tools' }
];

// --- STATUS LOGIKASI ---
const getStatusLabel = (s) => {
  const labels = { '0': 'Bo\'sh', '1': 'Band', '2': 'Bron', '3': 'Hisob kutilmoqda', '-1': 'Ta\'mirda' };
  return labels[s] || 'Noma\'lum';
};

const getStatusColor = (s) => {
  const themes = {
    '0':  { line: 'bg-emerald-500', iconBg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10', text: 'text-emerald-500' },
    '1':  { line: 'bg-rose-500',    iconBg: 'bg-rose-50 text-rose-600 dark:bg-rose-500/10',       text: 'text-rose-500' },
    '2':  { line: 'bg-blue-500',    iconBg: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10',       text: 'text-blue-500' },
    '3':  { line: 'bg-amber-500',   iconBg: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10',    text: 'text-amber-500' },
    '-1': { line: 'bg-slate-400',   iconBg: 'bg-slate-100 text-slate-500 dark:bg-slate-800',     text: 'text-slate-400' }
  };
  return themes[s] || themes['0'];
};

const getStatusIcon = (s) => {
  const icons = { '0': addOutline, '1': cartOutline, '2': bookmarkOutline, '3': walletOutline, '-1': constructOutline };
  return icons[s] || cartOutline;
};

// --- AMALLAR ---
const handleTableClick = async (table) => {
  await Haptics.impact({ style: ImpactStyle.Medium });
  selectedTable.value = table;

  if (table.status === '0') {
    router.push({ name: 'menu' });
  } else if (['1', '3'].includes(table.status)) {
    isCartOpen.value = true;
  }
};

const getTableActions = (table) => [
  { label: 'Tahrirlash', icon: 'fa-solid fa-pen-to-square', onClick: () => store.ModalAction(table) },
  { label: 'Batafsil', icon: 'fa-solid fa-eye', onClick: () => router.push(`/tables/${table.id}`) },
  { label: 'O\'chirish', icon: 'fa-solid fa-trash', variant: 'danger', onClick: () => console.log('Delete', table.id) }
];

const filteredTables = computed(() => {
  if (!tabels.value) return [];
  return tabels.value.filter(t => {
    const matchStatus = activeStatus.value === 'all' || t.status === activeStatus.value;
    const matchSearch = String(t.number).includes(searchQuery.value);
    return matchStatus && matchSearch;
  });
});

const onCategoryChange = (id) => {
  activeStatus.value = id;
  Haptics.impact({ style: ImpactStyle.Light });
};

onMounted(() => store.GetAll());
</script>

<style scoped>
ion-content { --padding-bottom: 120px; }
.animate-ping { animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite; }
@keyframes ping { 75%, 100% { transform: scale(2); opacity: 0; } }
</style>