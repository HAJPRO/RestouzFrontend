<template>
  <ion-page class="bg-[#f8fafc] dark:bg-[#020617]">
    <Modal />
    
    <Header 
      title="Stollar" 
      searchable 
      v-model="searchQuery"
      searchPlaceholder="Izlash..."
    >
      <template #actions>
        <BaseTabs 
          v-model="activeStatus" 
          :tabs="statusFilters"
          @change="onCategoryChange"
        />

        <Button 
          @click="store.ModalAction({action:'create'})" 
          icon="fas fa-plus" 
          size="sm" 
        />
      </template>
    </Header>

    <ion-content :fullscreen="true">
      <GlobalRefresher />
      
      <div class="max-w-[1600px] mx-auto px-4 py-8 pb-32">
       <div v-if="filteredTables.length > 0" 
     class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
  
  <div 
    v-for="table in filteredTables" 
    :key="table._id"
    @click="handleTableClick(table)"
    :class="[
      'group relative flex flex-col justify-between p-5 min-h-[210px] rounded-[32px] transition-all duration-500 cursor-pointer active:scale-95 overflow-hidden border-2',
      getStatusTheme(table).bgClass,
      getStatusTheme(table).borderClass
    ]"
  >
    <div :class="['absolute -top-8 -right-8 w-20 h-20 rounded-full opacity-[0.08] transition-transform duration-700 group-hover:scale-150', getStatusTheme(table).dot]"></div>

    <div class="flex justify-between items-start z-10">
      <div class="flex flex-col">
        <span class="text-[10px] font-bold opacity-40 uppercase tracking-[2px] mb-0.5">{{ table.position }}</span>
        <h3 :class="['text-lg font-black tracking-tighter leading-none', getStatusTheme(table).text]">
          {{ table.number }}
        </h3>
      </div>
      
      <div v-if="getActiveBookingsCount(table) > 0" class="group/tooltip relative">
        <div class="flex items-center gap-1.5 px-2.5 py-1 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-full border border-slate-200 dark:border-slate-700 shadow-sm transition-all hover:border-indigo-400">
          <i class="fa-solid fa-calendar-check text-[10px] text-indigo-500"></i>
          <span class="text-[11px] font-black text-slate-700 dark:text-slate-200">{{ getActiveBookingsCount(table) }}</span>
        </div>
        
        <div class="absolute top-full right-0 mt-2 w-48 hidden group-hover/tooltip:block z-[100] animate-in fade-in slide-in-from-top-2">
          <div class="bg-white dark:bg-slate-800 shadow-2xl rounded-2xl p-2 border border-slate-100 dark:border-slate-700 overflow-hidden">
            <div class="text-[9px] font-bold text-indigo-500 uppercase mb-2 px-2 border-b border-slate-50 dark:border-slate-700/50 pb-1">Navbatdagi bronlar</div>
            <div class="max-h-32 overflow-y-auto custom-scrollbar">
              <div v-for="b in table.bookings" :key="b._id" class="flex justify-between items-center p-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl transition-colors">
                <span class="text-[10px] font-bold text-slate-700 dark:text-slate-200 truncate pr-2">{{ b.client_name || 'Mijoz' }}</span>
                <span class="text-[9px] font-black opacity-50">
                  {{ b.booking_time ? new Date(b.booking_time).getHours() + ':' + String(new Date(b.booking_time).getMinutes()).padStart(2, '0') : '' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-col items-center justify-center my-2 z-10">
      <div v-if="getActiveBookingTimer(table)" class="flex flex-col items-center">
        <div class="text-[9px] font-black uppercase text-rose-500 tracking-widest mb-1 animate-pulse">Bron kelmoqda</div>
        <div class="text-2xl font-black font-mono tracking-tighter text-rose-600 dark:text-rose-400">
          {{ getActiveBookingTimer(table) }}
        </div>
      </div>
      
      <div v-else :class="['w-16 h-16 rounded-[24px] flex items-center justify-center transition-all duration-500 group-hover:scale-110 shadow-sm', getStatusTheme(table).iconBox]">
        <ion-icon :icon="getStatusIcon(table.status)" class="text-2xl" />
      </div>
    </div>

    <div class="flex items-end justify-between z-10">
      <div v-if="['1', '3','2'].includes(String(table.status)) && table.cartId">
        <p class="text-[9px] font-bold opacity-40 uppercase leading-none mb-1.5">Jami hisob</p>
        <div :class="['text-base font-black tracking-tight', getStatusTheme(table).text]">
          {{ table.cartId?.finalTotal?.toLocaleString() }} 
          <span class="text-[10px] font-medium opacity-60">UZS</span>
        </div>
      </div>
      <div v-else class="flex items-center gap-2 text-slate-400 dark:text-slate-500">
        <i class="fa-solid fa-users text-[11px]"></i>
        <span class="text-[11px] font-bold">{{ table.capacity || 4 }}</span>
      </div>

      <ActionMenu 
        :items="getTableActions(table)" 
        @click.stop 
        class="opacity-30 hover:opacity-100 transition-opacity p-1"
      />
    </div>
  </div>
</div>

<div v-else-if="!loading && filteredTables.length === 0">
  <EmptyState />
</div>

<div v-else>
  <LoadingState 
    title="Stollar yuklanmoqda..." 
    description="Iltimos, biroz kuting." 
  />
</div>
      </div>
    </ion-content>

    <div v-if="isCartOpen && selectedTable && ['1', '3','2'].includes(selectedTable.status)"> 
      <CartModal :tableInfo="selectedTable" @close="isCartOpen = false" />
    </div>
    <TableBookingModal />
    <Footer />
  </ion-page>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { IonPage, IonContent, IonIcon } from '@ionic/vue';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { storeToRefs } from "pinia";

import { TabelStore,MenuStore} from "../../stores/index.store";
import { Button, BaseTabs, Header, GlobalRefresher, ActionMenu,EmptyState,LoadingState } from "../../UI/UI";
import Footer from '../../partials/Footer.vue';
import Modal from '../../components/Tabel/ActionModal.vue';
import CartModal from '../../components/Menu/Cart.vue';
import TableBookingModal from './TableBookingModal.vue';

import { 
  timeOutline, pulseOutline, addOutline, cartOutline, 
  walletOutline, bookmarkOutline, constructOutline, 
  
} from 'ionicons/icons';
import { Loading } from '../../utils/Loading';

const router = useRouter();
const store = TabelStore();
const store_menu = MenuStore();
const { tabels,selectedTableNumber } = storeToRefs(store);
const { isCartOpen } = storeToRefs(store_menu);

const searchQuery = ref("");
const activeStatus = ref('all');
const selectedTable = ref(null);
const now = ref(new Date());

let liveInterval = null;
onMounted(() => {
  store.GetAll();
  liveInterval = setInterval(() => { now.value = new Date(); }, 1000);
});

onUnmounted(() => { if (liveInterval) clearInterval(liveInterval); });

// --- SMART LOGIC ---

const getActiveBookingsCount = (table) => {
  if (!table.bookings || !Array.isArray(table.bookings)) return 0;
  return table.bookings.filter(b => new Date(b.booking_time) > now.value).length;
};

const getActiveBookingTimer = (table) => {
  if (!table.bookings || !table.bookings.length) return null;
  const closest = table.bookings
    .map(b => ({
      time: new Date(b.booking_time),
      diff: new Date(b.booking_time).getTime() - now.value.getTime()
    }))
    .filter(b => b.diff > 0 && b.diff <= 3600000)
    .sort((a, b) => a.diff - b.diff)[0];

  if (closest) {
    const min = Math.floor(closest.diff / 60000);
    const sec = Math.floor((closest.diff % 60000) / 1000);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  }
  return null;
};

const getStatusTheme = (table) => {
  const s = table.status;
  if (getActiveBookingTimer(table)) {
    return { 
      bgClass: 'bg-rose-50/50 dark:bg-rose-950/10', 
      borderClass: 'border-rose-100 dark:border-rose-900 ring-4 ring-rose-500/5',
      text: 'text-rose-600 dark:text-rose-400',
      iconBox: 'bg-rose-100 dark:bg-rose-900/40 text-rose-600',
      dot: 'bg-rose-500'
    };
  }

  const themes = {
    '0': { 
      bgClass: 'bg-white dark:bg-slate-900', 
      borderClass: 'border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-800 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5',
      text: 'text-slate-900 dark:text-white',
      iconBox: 'bg-slate-50 dark:bg-slate-800 text-slate-400',
      dot: 'bg-emerald-500'
    },
    '1': { 
      bgClass: 'bg-rose-50/20 dark:bg-rose-950/5', 
      borderClass: 'border-rose-100 dark:border-rose-900/40',
      text: 'text-rose-600 dark:text-rose-400',
      iconBox: 'bg-rose-100/50 dark:bg-rose-900/30 text-rose-500',
      dot: 'bg-rose-500'
    },
    '2': { 
      bgClass: 'bg-indigo-50/20 dark:bg-indigo-950/5', 
      borderClass: 'border-indigo-100 dark:border-indigo-900/40',
      text: 'text-indigo-600 dark:text-indigo-400',
      iconBox: 'bg-indigo-100/50 dark:bg-indigo-900/30 text-indigo-500',
      dot: 'bg-indigo-500'
    },
    '3': { 
      bgClass: 'bg-amber-50/20 dark:bg-amber-950/5', 
      borderClass: 'border-amber-100 dark:border-amber-900/40',
      text: 'text-amber-600 dark:text-amber-400',
      iconBox: 'bg-amber-100/50 dark:bg-amber-900/30 text-amber-500',
      dot: 'bg-amber-500'
    }
  };
  return themes[s] || themes['0'];
};

const getStatusIcon = (s) => {
  const icons = { '0': addOutline, '1': cartOutline, '2': bookmarkOutline, '3': walletOutline, '-1': constructOutline };
  return icons[s] || addOutline;
};

const handleTableClick = async (table) => {
  await Haptics.impact({ style: ImpactStyle.Light });
  selectedTable.value = table;

  if (table.status === '0'){
    store_menu.selectedTable=table._id
router.push({ name: 'menu' });
  } 
  else if (['1', '2', '3'].includes(table.status)){
store_menu.setEditOrder(table.cartId)
isCartOpen.value = true
  } 
};

const getTableActions = (table) => [
  { label: 'Tahrirlash', icon: 'fa-solid fa-pen-to-square', onClick: () => store.ModalAction({id:table._id,action:'edit'}) },
  { label: 'Hisob berish', icon: 'fa-solid fa-calculator', onClick: () => store.Create({_id:table._id,status:3}, 'edit') },

  { label: 'Bron qo\'shish', icon: 'fa-solid fa-calendar-plus', onClick: () => store.BookingModalAction(table, 'booked') },
  { label: 'Ta’mirga olish', icon: 'fa-solid fa-screwdriver-wrench', onClick: () => store.setStatus(table, 'maintenance') },
  { label: 'Bekor qilish', icon: 'fa-solid fa-xmark', variant: 'warning', onClick: () => store.setStatus(table, 'free') },
  { label: 'O\'chirish', icon: 'fa-solid fa-trash', variant: 'danger', onClick: () => {} }
];

const filteredTables = computed(() => {
  if (!tabels.value) return [];
  return tabels.value.filter(t => {
    const matchStatus = activeStatus.value === 'all' || t.status === activeStatus.value;
    const matchSearch = String(t.number).toLowerCase().includes(searchQuery.value.toLowerCase());
    return matchStatus && matchSearch;
  });
});

const statusFilters = [
  { id: 'all', label: 'Barchasi', icon: 'fas fa-th-large' },
  { id: '0', label: 'Bo\'sh', icon: 'fas fa-door-open' },
  { id: '1', label: 'Band', icon: 'fas fa-user-clock' },
  { id: '2', label: 'Bron', icon: 'fas fa-bookmark' }
];

const onCategoryChange = (id) => {
  activeStatus.value = id;
  Haptics.impact({ style: ImpactStyle.Medium });
};
</script>

<style scoped>
ion-content { --padding-bottom: 120px; }
.custom-scrollbar::-webkit-scrollbar { width: 3px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
.animate-in { animation: fadeIn 0.3s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>