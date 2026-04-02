<template>
  <ion-page class="bg-slate-50 dark:bg-slate-950">
        <Header />

     <ion-header class="ion-no-border">
  <div class="bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl pt-safe border-b border-slate-100 dark:border-white/5">
    
    <div class="max-w-full mx-auto px-3 h-12 flex items-center justify-between">
    
      <div class="flex items-center gap-3  mt-3">
        <button 
          @click="$router.back()" 
          class="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 flex items-center justify-center active:scale-95 transition-all"
        >
          <ion-icon :icon="arrowBackOutline" class="text-xl" />
        </button>

        <h1 class="text-[17px] font-black text-slate-900 dark:text-white tracking-tight mt-3">
          Mahsulotlar
        </h1>
      </div>
      <div class="flex items-center gap-1.5  mt-3">
        <button class="w-9 h-9 rounded-xl bg-slate-100/80 dark:bg-slate-900 text-slate-500 flex items-center justify-center active:scale-90 transition-all">
          <ion-icon :icon="searchOutline" class="text-lg" />
        </button>
        
        <button 
          @click="openFilter()"
          class="w-9 h-9 rounded-xl bg-slate-100/80 dark:bg-slate-900 text-slate-500 flex items-center justify-center active:scale-90 transition-all relative"
        >
          <ion-icon :icon="filterOutline" class="text-lg" />
          <span class="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-2 border-white dark:border-slate-950"></span>
        </button>

        <button class="w-9 h-9 rounded-xl bg-slate-100/80 dark:bg-slate-900 text-slate-500 dark:text-indigo-400 flex items-center justify-center active:scale-90 transition-all border border-indigo-100/50 dark:border-indigo-500/20">
          <ion-icon :icon="addOutline" class="text-xl" />
        </button>
      </div>
    </div>

    <div class="max-w-md mx-auto px-3 pb-3 mt-1 overflow-x-auto no-scrollbar flex gap-2">
      <button 
        v-for="cat in categories" :key="cat.id"
        @click="activeCategory = cat.id"
        :class="[
          'px-5 py-2 rounded-2xl text-[13px] font-bold whitespace-nowrap transition-all duration-300 transform-gpu',
          activeCategory === cat.id 
            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 scale-105' 
            : 'bg-white dark:bg-slate-900 text-slate-400 border border-slate-100 dark:border-white/5'
        ]"
      >
        {{ cat.name }}
      </button>
    </div>
  </div>
</ion-header>

    <ion-content :fullscreen="true">
      <ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)">
        <ion-refresher-content 
          pulling-icon="chevron-down-outline" 
          refreshing-spinner="bubbles">
        </ion-refresher-content>
      </ion-refresher>

      <div class="max-w-full mx-auto px-4 py-6 mt-10">
        
        <div v-if="isLoading && items.length === 0" class="space-y-4">
          <div v-for="i in 5" :key="i" 
               class="bg-white dark:bg-slate-900/50 rounded-[24px] p-4 flex gap-4 border border-slate-100 dark:border-white/5 animate-pulse">
            <div class="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl"></div>
            <div class="flex-1 space-y-3 py-2">
              <div class="h-3 bg-slate-100 dark:bg-slate-800 rounded w-2/3"></div>
              <div class="h-2 bg-slate-100 dark:bg-slate-800 rounded w-1/3"></div>
            </div>
          </div>
        </div>

        <div v-else class="space-y-3">
          <div v-for="item in items" :key="item.id" 
               class="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-[24px] p-4 shadow-sm hover:shadow-md active:bg-slate-50 dark:active:bg-slate-800/50 transition-all duration-300">
            
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div class="w-14 h-14 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-active:scale-90 transition-transform">
                  <i class="fas fa-box-open text-xl opacity-80"></i>
                </div>
                
                <div>
                  <h3 class="font-bold text-[15px] text-slate-800 dark:text-slate-100 leading-tight">
                    {{ item.name }}
                  </h3>
                  <div class="flex items-center gap-2 mt-1">
                    <span class="text-[10px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-md font-bold uppercase tracking-tighter">
                      Skladda bor
                    </span>
                    <p class="text-[11px] text-slate-400 font-medium">· {{ item.time }}</p>
                  </div>
                </div>
              </div>

              <div class="w-8 h-8 rounded-full flex items-center justify-center text-slate-300 dark:text-slate-700">
                <i class="fas fa-chevron-right text-[10px]"></i>
              </div>
            </div>
            
          </div>
        </div>

       
        
      </div>
    </ion-content>
        <Footer />

  </ion-page>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { 
  IonPage, 
  IonHeader, 
  IonContent, 
  IonRefresher, 
  IonRefresherContent ,
  IonIcon
} from '@ionic/vue';
import { 
  addCircleOutline,
  addOutline,
  archiveOutline,
  arrowBackOutline,
  filterOutline,
  searchOutline, 

} from 'ionicons/icons';
import Header from '../../partials/Header.vue';
import Footer from '../../partials/Footer.vue';
const isLoading = ref(false);
const items = ref([
  { id: 1, name: "Maxsulot A", time: "5 daqiqa oldin" },
  { id: 2, name: "Maxsulot B", time: "15 daqiqa oldin" },
  { id: 3, name: "Maxsulot C", time: "1 soat oldin" },
  { id: 4, name: "Maxsulot D", time: "3 soat oldin" },  { id: 1, name: "Maxsulot A", time: "5 daqiqa oldin" },
  { id: 2, name: "Maxsulot B", time: "15 daqiqa oldin" },
  { id: 3, name: "Maxsulot C", time: "1 soat oldin" },
  { id: 4, name: "Maxsulot D", time: "3 soat oldin" }
]);

const handleRefresh = async (event) => {
  await fetchData();
  event.target.complete();
};

const fetchData = async () => {
  if (isLoading.value) return;
  isLoading.value = true;
  try {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const newItem = {
      id: Date.now(),
      name: "Yangi Maxsulot #" + (items.value.length + 1),
      time: "Hozirgina"
    };
    items.value.unshift(newItem);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  window.addEventListener('app-refresh-data', fetchData);
});

onUnmounted(() => {
  window.removeEventListener('app-refresh-data', fetchData);
});
</script>

<style scoped>
/* Header fonini shaffof qilish */
ion-header {
  background: transparent;
}

/* iOS uchun silliq blur effekti */
.backdrop-blur-xl {
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

/* Kontent skroll bo'lganda header ostida qolishi uchun */
ion-content {
  --padding-top: 0;
}
</style>