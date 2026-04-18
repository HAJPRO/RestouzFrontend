<template>
  <ion-page class="bg-slate-50 dark:bg-[#020617]">
    <Header 
      title="Buyurtmalar" 
      searchable 
      v-model="searchQuery" 
      searchPlaceholder="ID, taom yoki izoh..."
    >
      <template #actions>
        <div class="flex gap-2">
          <Button @click="datePic = !datePic" icon="fas fa-calendar-alt" size="sm" :variant="selectedDateRange ? 'primary' : 'secondary'" />
          
          <div class="relative">
            <Button @click="store_order.isCartOpen = true" icon="fas fa-shopping-basket" size="sm" />
            <span v-if="orders.length" class="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[9px] rounded-full flex items-center justify-center font-black animate-bounce">
              {{ orders.length }}
            </span>
          </div>
        </div>
      </template>
    </Header>

    <ion-content :fullscreen="true" class="ion-padding" id="order-content">
      <GlobalRefresher @refresh="refreshOrders" />
      
      <LoadingState v-if="loading && !orders.length" />
      
      <EmptyState 
        v-else-if="filteredOrders.length === 0" 
        title="Buyurtmalar topilmadi" 
        :description="searchQuery ? 'Qidiruv bo\'yicha natija yo\'q' : 'Hozircha hech qanday buyurtma mavjud emas.'"
      />

      <div v-else class="space-y-6 pb-10 mt-3">
        <div 
          v-for="(order, index) in filteredOrders" 
          :key="order._id" 
          class="animate-slide-up"
          :style="{ animationDelay: `${(index % 10) * 0.1}s` }"
        >
          <div class="bg-white dark:bg-slate-900 rounded-[35px] p-5 border border-slate-100 dark:border-white/5 shadow-sm relative overflow-hidden">
            
            <div :class="['absolute top-0 right-0 w-24 h-24 -mr-12 -mt-12 rounded-full opacity-5', order.orderType === 'takeaway' ? 'bg-rose-500' : 'bg-indigo-500']"></div>

            <div class="flex justify-between items-start mb-5 relative z-10">
              <div class="flex items-center gap-3">
                <div :class="['w-12 h-12 rounded-2xl flex items-center justify-center text-lg', order.orderType === 'takeaway' ? 'bg-rose-50 text-rose-600' : 'bg-indigo-50 text-indigo-600']">
                  <i :class="order.orderType === 'takeaway' ? 'fas fa-box-archive' : 'fas fa-utensils'"></i>
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <h3 class="text-sm font-black dark:text-white uppercase tracking-tighter"> № : {{ order.tableId?.number || 'N/A' }}</h3>
                   
                  </div>
                  <p class="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{{ formatDate(order.createdAt) }}</p>
                </div>
              </div>
              <div :class="[
  'flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-wider border transition-all duration-300 shadow-sm',
  order.orderType === 'table' 
    ? 'bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20' 
    : 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20'
]">
  <i :class="[
    'text-[11px]',
    order.orderType === 'table' ? 'fas fa-chair' : 'fas fa-shuttle-van'
  ]"></i>

  <span>
    {{ order.orderType === 'table' ? 'Zalda / Stolga' : 'Olib ketish' }}
  </span>
  
  <span class="flex h-1.5 w-1.5 relative ml-0.5">
    <span :class="[
      'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
      order.orderType === 'table' ? 'bg-indigo-400' : 'bg-rose-400'
    ]"></span>
    <span :class="[
      'relative inline-flex rounded-full h-1.5 w-1.5',
      order.orderType === 'table' ? 'bg-indigo-500' : 'bg-rose-500'
    ]"></span>
  </span>
</div>
              <div :class="getStatusClass(order.status)">
                {{ order.status }}
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4 mb-5 border-b border-slate-50 dark:border-white/5 pb-4">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs text-slate-500">
                  <i class="fas fa-user-tie"></i>
                </div>
                <div class="truncate">
                  <p class="text-[8px] font-black text-slate-400 uppercase leading-none mb-1">Ofitsiant</p>
                  <p class="text-[11px] font-bold dark:text-slate-200 truncate">{{ order.staffId?.firstname,order.staffId?.lastname|| 'Tizim' }}</p>
                </div>
              </div>
              <div class="flex items-center gap-2 border-l border-slate-50 dark:border-white/5 pl-4">
                <div class="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-xs text-emerald-600">
                  <i class="fas fa-user text-[10px]"></i>
                </div>
                <div class="truncate">
                  <p class="text-[8px] font-black text-slate-400 uppercase leading-none mb-1">Mijoz</p>
                  <p class="text-[11px] font-bold dark:text-slate-200 truncate">{{ order.customerId?.name || 'Mehmon' }}</p>
                </div>
              </div>
            </div>

          <div class="space-y-4 mb-6">
  <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 px-1">Buyurtma tarkibi</p>
  
  <div 
    v-for="item in order.items" 
    :key="item.name" 
    class="group flex justify-between items-start bg-slate-50/50 dark:bg-white/5 p-3 rounded-2xl border border-transparent hover:border-indigo-100 dark:hover:border-indigo-500/20 transition-all duration-300"
  >
    <div class="flex gap-3">
      <div class="flex flex-col items-center justify-center min-w-[36px] h-[36px] bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-white/10">
        <span class="text-[12px] font-black text-indigo-600 dark:text-indigo-400">{{ item.quantity }}</span>
        <span class="text-[8px] font-bold text-slate-400 uppercase">ta</span>
      </div>

      <div class="flex flex-col gap-0.5">
        <span class="text-[13px] font-bold text-slate-700 dark:text-slate-200 leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {{ item.name }}
        </span>
        <span class="text-[10px] font-medium text-slate-400 flex items-center gap-1">
          <i class="fas fa-tag text-[8px] opacity-70"></i>
          {{ (item.price || 0).toLocaleString() }} UZS dan
        </span>
      </div>
    </div>

    <div class="text-right">
      <span class="text-[13px] font-black text-slate-700 dark:text-slate-200 tracking-tight">
        {{ (item.totalPrice || (item.quantity * item.price)).toLocaleString() }}
      </span>
      <p class="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Jami</p>
    </div>
  </div>
</div>

            <div class="bg-slate-50 dark:bg-slate-800/40 rounded-[25px] p-4 space-y-2 mb-5">
              <div class="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <span>Buyurtma</span>
                <span>{{ (order.subtotal || 0).toLocaleString() }}</span>
              </div>
              <div class="flex justify-between text-[10px] font-black text-indigo-500 uppercase tracking-widest">
                <span>Xizmat haqi</span>
                <span>+{{ (order.serviceFeeAmount || 0).toLocaleString() }}</span>
              </div>
              <div v-if="order.discountAmount > 0" class="flex justify-between text-[10px] font-black text-rose-500 uppercase tracking-widest italic">
                <span>Chegirma</span>
                <span>-{{ (order.discountAmount || 0).toLocaleString() }}</span>
              </div>
            </div>

            <div class="flex justify-between items-end">
              <div>
                <p class="text-[9px] font-black text-slate-400 uppercase mb-1">To'lov miqdori</p>
                <div class="flex items-baseline gap-1">
                  <span class="text-2xl font-black dark:text-white tracking-tighter">{{ (order.finalTotal || 0).toLocaleString() }}</span>
                  <span class="text-[10px] font-black text-indigo-600 uppercase">UZS</span>
                </div>
              </div>
              <div class="flex gap-2">
                <Button @click="handlePrint(order)" icon="fas fa-print" variant="secondary" class="!rounded-2xl !w-12 !h-12 shadow-sm" />
                <Button @click="handleDetail(order)" icon="fas fa-arrow-right" class="!rounded-2xl !px-6 !h-12 shadow-lg shadow-indigo-100" />
              </div>
            </div>

            <div v-if="order.comment" class="mt-4 pt-3 border-t border-slate-50 dark:border-white/5 italic text-[10px] text-slate-400 flex items-center gap-2">
              <i class="fas fa-comment-dots text-amber-500 text-xs"></i> "{{ order.comment }}"
            </div>
          </div>
        </div>
      </div>

      <ion-infinite-scroll @ionInfinite="loadMore" :disabled="!store_order.hasMore">
        <ion-infinite-scroll-content loading-spinner="crescent" loading-text="Yuklanmoqda..."></ion-infinite-scroll-content>
      </ion-infinite-scroll>
    </ion-content>

    <Footer class="z-50" />
    
    <div v-if="datePic" class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <DateRangePicker 
        @selected="handleDateFilter" 
        @close="datePic = false" 
      />
    </div>
  </ion-page>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { IonPage, IonContent, IonInfiniteScroll, IonInfiniteScrollContent } from "@ionic/vue";
import { OrderStore } from "../../stores/index.store";
import { storeToRefs } from "pinia";
import { Button, Header, GlobalRefresher, EmptyState, LoadingState, DateRangePicker } from "../../UI/UI";
import Footer from "../../partials/Footer.vue";
import { Haptics, ImpactStyle } from "@capacitor/haptics";

const store_order = OrderStore();
const { orders, loading } = storeToRefs(store_order);

const searchQuery = ref("");
const datePic = ref(false);
const selectedRange = ref(null);

// 1. Dastlabki yuklash
const refreshOrders = async (event) => {
  await Haptics.impact({ style: ImpactStyle.Light });
  await store_order.GetAll(true, selectedRange.value); 
  if (event) event.target.complete();
};

// 2. Sana bo'yicha filtrlash
const handleDateFilter = async (range) => {
  selectedRange.value = range;
  datePic.value = false;
  await store_order.GetAll(true, range);
};

// 3. Pagination
const loadMore = async (event) => {
  await store_order.GetAll(false, selectedRange.value);
  event.target.complete();
};

// Computed Search
const filteredOrders = computed(() => {
  let result = orders.value || [];
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    result = result.filter(o => 
      o._id.toLowerCase().includes(q) || 
      o.staffId?.name?.toLowerCase().includes(q) ||
      o.customerId?.name?.toLowerCase().includes(q) ||
      o.items.some(item => item.name.toLowerCase().includes(q))
    );
  }
  return result;
});

const getStatusClass = (status) => {
  const base = 'px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider border ';
  switch (status) {
    case 'pending': return base + 'bg-amber-100 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20';
    case 'preparing': return base + 'bg-blue-100 text-blue-600 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20';
    case 'completed': return base + 'bg-emerald-100 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20';
    case 'cancelled': return base + 'bg-rose-100 text-rose-600 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20';
    default: return base + 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-white/5';
  }
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleString('uz-UZ', { 
    hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' 
  });
};

const handlePrint = async (order) => {
  // Avvalgi print logikasi...
  console.log("Chop etilmoqda:", order._id);
};

const handleDetail = (order) => {
  // Detail sahifasiga o'tish
};

onMounted(() => {
  store_order.GetAll(true);
});
</script>

<style scoped>
.animate-slide-up {
  animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes slideUp {
  from { transform: translateY(30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
</style>