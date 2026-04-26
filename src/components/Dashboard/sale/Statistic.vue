<template>
  <ion-page class="bg-slate-50 dark:bg-slate-950">
    <Header 
      title="Statistika" 
      searchable 
      v-model="searchQuery"
      searchPlaceholder="Taom izlash..."
    >
      <template #actions>
        <Button @click="loadData" icon="fas fa-sync-alt" :class="{ 'fa-spin': statsStore.loading }" size="sm" />
      </template>
    </Header>

    <ion-content :fullscreen="true">
      <div class="max-w-full mx-auto px-5 py-6 space-y-8">
        
        <div class="flex p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl shadow-inner">
          <button 
            v-for="filter in ['Kun', 'Hafta', 'Oy', 'Yil']" 
            :key="filter"
            @click="statsStore.setFilter(filter)"
            :class="[
              'flex-1 py-2.5 text-[13px] font-bold rounded-xl transition-all duration-300',
              statsStore.activeFilter === filter 
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-white shadow-sm' 
                : 'text-slate-400 hover:text-slate-600'
            ]"
          >
            {{ filter }}
          </button>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="bg-indigo-600 p-5 rounded-[32px] text-white shadow-xl shadow-indigo-500/20 space-y-2 col-span-2 relative overflow-hidden">
            <div class="relative z-10">
              <p class="text-[10px] font-bold opacity-70 uppercase tracking-widest">Umumiy tushum</p>
              <div class="text-3xl font-black tracking-tighter">
                {{ formatCurrency(statsStore.totalRevenue) }}
              </div>
            </div>
            <div class="absolute -right-4 -bottom-4 text-white/10 text-7xl rotate-12">
              <i class="fas fa-wallet"></i>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-900 p-5 rounded-[32px] border border-slate-100 dark:border-white/5 space-y-1">
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Buyurtmalar</p>
            <div class="text-xl font-black text-slate-800 dark:text-white">{{ statsStore.totalOrders }}</div>
            <p class="text-[9px] text-emerald-500 font-bold uppercase">{{ statsStore.activeFilter }}lik</p>
          </div>

          <div class="bg-emerald-500 p-5 rounded-[32px] text-white space-y-1 shadow-lg shadow-emerald-500/10">
            <p class="text-[10px] font-bold opacity-80 uppercase tracking-widest">O'rtacha chek</p>
            <div class="text-xl font-black">{{ formatCurrency(statsStore.averageCheck) }}</div>
          </div>
        </div>
         <div class="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-100 dark:border-white/5 space-y-5">
          <h3 class="text-xs font-black uppercase tracking-wider">To'lov turlari ulushi</h3>
          <div class="space-y-4">
            <div v-for="pay in statsStore.payments" :key="pay.label" class="space-y-1.5">
              <div class="flex justify-between text-[11px] font-bold uppercase">
                <span class="text-slate-400">{{ pay.label }}</span>
                <span class="text-slate-800 dark:text-white">{{ formatCurrency(pay.value) }}</span>
              </div>
              <div class="w-full h-2 bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  class="h-full bg-indigo-500 rounded-full transition-all duration-1000" 
                  :style="{ width: (pay.value / (statsStore.totalRevenue || 1) * 100) + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-slate-950 rounded-[32px] p-6 border border-slate-100 dark:border-white/5 space-y-6 shadow-sm">
          <div class="flex items-center justify-between">
            <div class="space-y-1">
              <h3 class="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">Savdo dinamikasi</h3>
              <p class="text-[9px] text-slate-400 font-bold uppercase tracking-widest italic">{{ statsStore.activeFilter }}lik tahlil</p>
            </div>
          </div>

          <div v-if="!statsStore.loading" class="h-44 w-full flex items-end justify-between gap-3 px-1">
            <div v-for="(item, i) in statsStore.chartData" :key="i" class="flex-1 h-full flex flex-col justify-end group relative">
              <div class="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 pointer-events-none">
                <div class="bg-slate-900 text-white text-[9px] font-bold px-2 py-1 rounded-lg shadow-xl">
                  {{ (item.value / 1000).toFixed(0) }}k
                </div>
              </div>
              <div class="w-full h-full bg-slate-50 dark:bg-slate-900/40 rounded-t-xl overflow-hidden relative">
                <div 
                  :style="{ height: item.percent + '%' }" 
                  class="absolute bottom-0 w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-lg transition-all duration-1000 group-hover:brightness-110"
                ></div>
              </div>
              <span class="text-[8px] font-black text-slate-400 uppercase mt-3 text-center truncate">{{ item.label }}</span>
            </div>
          </div>
          <div v-else class="h-44 flex items-center justify-center"><ion-spinner name="crescent"></ion-spinner></div>
        </div>

       

        <div class="space-y-4">
          <h3 class="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider px-2">Top Mijozlar</h3>
          <div class="flex gap-4 overflow-x-auto pb-4 px-2 no-scrollbar">
            <div v-for="client in statsStore.topCustomers" :key="client._id" 
                 class="min-w-[140px] bg-white dark:bg-slate-900 p-5 rounded-[28px] border border-slate-100 dark:border-white/5 text-center space-y-3">
              <div class="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl mx-auto flex items-center justify-center text-indigo-600 font-black text-lg shadow-sm">
                {{ client.name[0] }}
              </div>
              <div>
                <p class="text-[11px] font-black truncate text-slate-800 dark:text-white uppercase">{{ client.name }}</p>
                <p class="text-[10px] text-emerald-500 font-bold mt-1">{{ formatCurrency(client.totalSpent) }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-4 pb-10">
          <div class="flex items-center justify-between px-2">
            <h3 class="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">Top Sotuvlar</h3>
            <button class="text-[11px] font-bold text-indigo-600 uppercase">Barchasi</button>
          </div>
          <div class="space-y-3">
            <div v-for="product in statsStore.topProducts" :key="product._id" class="flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm">
              <div class="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-indigo-600">
                <i class="fas fa-utensils"></i>
              </div>
              <div class="flex-1">
                <p class="text-sm font-bold text-slate-800 dark:text-white">{{ product.name }}</p>
                <p class="text-[10px] text-slate-400 font-medium">{{ product.totalSold }} ta sotildi</p>
              </div>
              <div class="text-right">
                <p class="text-sm font-black text-slate-800 dark:text-white">{{ formatCurrency(product.revenue) }}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </ion-content>
    <Footer/>
  </ion-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { IonPage, IonContent, IonSpinner } from '@ionic/vue';
import { StatisticsStore } from '../../../stores/index.store';
import Footer from '../../../partials/Footer.vue';
import { Button, Header } from '../../../UI/UI';
import { formatCurrency } from '../../../utils/index.util';

const statsStore = StatisticsStore();
const searchQuery = ref('');

const loadData = async () => {
  await statsStore.fetchAllStats();
};

onMounted(() => {
  loadData();
});
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
button { -webkit-tap-highlight-color: transparent; }
</style>