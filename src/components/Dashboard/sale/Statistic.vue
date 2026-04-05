<template>
  <ion-page class="bg-slate-50 dark:bg-slate-950">
   <Header 
    title="Statistika" 
    searchable 
    v-model="searchQuery"
    searchPlaceholder="Taom izlash..."
  >
    <template #actions>
      <Button @click="openCategory" icon="fas fa-list" size="sm" />
      <Button @click="addNew" icon="fas fa-plus" size="sm" />
    </template>
  </Header>

    <ion-content :fullscreen="true">
      <div class="max-w-full mx-auto px-5 py-6 space-y-8">
        
        <div class="flex p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl">
          <button 
            v-for="filter in ['Kun', 'Hafta', 'Oy', 'Yil']" 
            :key="filter"
            @click="activeFilter = filter"
            :class="[
              'flex-1 py-2 text-[13px] font-bold rounded-xl transition-all duration-300',
              activeFilter === filter 
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-white shadow-sm' 
                : 'text-slate-400 hover:text-slate-600'
            ]"
          >
            {{ filter }}
          </button>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="bg-indigo-600 p-5 rounded-[32px] text-white shadow-xl shadow-indigo-500/20 space-y-2">
            <p class="text-[10px] font-bold opacity-70 uppercase tracking-widest">Umumiy tushum</p>
            <div class="text-xl font-black tracking-tighter">12,8M</div>
            <div class="text-[9px] bg-white/20 w-fit px-2 py-0.5 rounded-full">+8.4%</div>
          </div>
          <div class="bg-white dark:bg-slate-900 p-5 rounded-[32px] border border-slate-100 dark:border-white/5 space-y-2">
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Buyurtmalar</p>
            <div class="text-xl font-black text-slate-800 dark:text-white tracking-tighter">1,240</div>
            <div class="text-[9px] text-emerald-500 font-bold uppercase tracking-tight">O'sishda</div>
          </div>
        </div>

   <div class="bg-white dark:bg-slate-950 rounded-[32px] p-6 border border-slate-100 dark:border-white/5 space-y-6 shadow-sm">
    
    <div class="flex items-center justify-between">
      <div class="space-y-1">
        <h3 class="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">Savdo grafigi</h3>
        <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic">
          {{ activeFilter }}lik hisobot
        </p>
      </div>
      <div class="text-right">
        <span class="text-[9px] font-black text-slate-400 uppercase block">Jami</span>
        <span class="text-sm font-black text-indigo-600 dark:text-indigo-400 leading-none">
          {{ totalSales }} mln
        </span>
      </div>
    </div>

    <div class="h-48 w-full flex items-end justify-between gap-2.5 px-1 mt-4">
      <div 
        v-for="(item, i) in chartData[activeFilter]" 
        :key="i" 
        class="flex-1 h-full flex flex-col justify-end group relative"
      >
        <div class="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-10">
          <div class="bg-slate-900 text-white text-[9px] font-bold px-2 py-1 rounded-lg shadow-xl whitespace-nowrap">
            {{ item.value.toLocaleString() }} k
          </div>
          <div class="w-1.5 h-1.5 bg-slate-900 rotate-45 mx-auto -mt-1"></div>
        </div>

        <div class="w-full h-full bg-slate-50 dark:bg-slate-900/50 rounded-t-xl overflow-hidden relative border border-transparent group-hover:border-indigo-100 dark:group-hover:border-indigo-500/20 transition-colors">
          <div 
            :style="{ height: item.percent + '%' }" 
            class="absolute bottom-0 w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-lg transition-all duration-1000 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:brightness-125 group-hover:shadow-[0_0_15px_rgba(79,70,229,0.4)]"
          >
            <div class="w-full h-full opacity-20 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:10px_10px]"></div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="flex justify-between px-1 border-t border-slate-50 dark:border-white/5 pt-4">
      <span 
        v-for="item in chartData[activeFilter]" 
        :key="item.label" 
        class="text-[9px] font-black text-slate-400 uppercase tracking-tighter w-full text-center group-hover:text-indigo-600 transition-colors"
      >
        {{ item.label }}
      </span>
    </div>

  </div>

        <div class="space-y-4">
          <div class="flex items-center justify-between px-2">
            <h3 class="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">Top Sotuvlar</h3>
            <button class="text-[11px] font-bold text-indigo-600 uppercase tracking-tighter">Barchasi</button>
          </div>

          <div class="space-y-3">
            <div v-for="i in 3" :key="i" class="flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-white/5">
              <div class="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-indigo-600">
                <i class="fas fa-hamburger"></i>
              </div>
              <div class="flex-1">
                <p class="text-sm font-bold text-slate-800 dark:text-white">Burger Special</p>
                <p class="text-[10px] text-slate-400 font-medium">124 ta sotildi</p>
              </div>
              <div class="text-right">
                <p class="text-[13px] font-black text-slate-800 dark:text-white">450k</p>
                <p class="text-[9px] text-emerald-500 font-bold uppercase">Top 1</p>
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
import { ref,computed  } from 'vue';
import { IonPage, IonHeader, IonContent,IonIcon} from '@ionic/vue';
// IKONALARNI BU YERDAN OLING:
import {arrowBackOutline,searchOutline } from 'ionicons/icons';
import Footer from '../../../partials/Footer.vue';
import {Button,Input,Select,Header} from '../../../UI/UI';
const activeFilter = ref('Hafta');

// Statik Ma'lumotlar
const chartData = {
  'Hafta': [
    { label: 'Du', value: 450, percent: 40 },
    { label: 'Se', value: 820, percent: 70 },
    { label: 'Ch', value: 510, percent: 45 },
    { label: 'Pa', value: 980, percent: 90 },
    { label: 'Ju', value: 720, percent: 65 },
    { label: 'Sha', value: 890, percent: 80 },
    { label: 'Ya', value: 550, percent: 50 },
  ],
  'Oy': [
    { label: '1-h', value: 2400, percent: 60 },
    { label: '2-h', value: 3100, percent: 85 },
    { label: '3-h', value: 1800, percent: 45 },
    { label: '4-h', value: 3600, percent: 100 },
  ],
  'Yil': [
    { label: 'Q1', value: 12500, percent: 55 },
    { label: 'Q2', value: 18900, percent: 80 },
    { label: 'Q3', value: 14200, percent: 65 },
    { label: 'Q4', value: 21000, percent: 95 },
  ]
};

// Jami summani hisoblash
const totalSales = computed(() => {
  const sum = chartData[activeFilter.value].reduce((acc, curr) => acc + curr.value, 0);
  return (sum / 1000).toFixed(1); // Mln ko'rinishida
});
</script>

<style scoped>
/* Smooth transition for filter buttons */
button {
  -webkit-tap-highlight-color: transparent;
}

/* Scroll yashirish */
ion-content::-webkit-scrollbar {
  display: none;
}

/* Glassmorphism Header */
header {
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}
</style>