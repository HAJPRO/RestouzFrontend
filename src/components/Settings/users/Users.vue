<template>
  <ion-page class="bg-slate-50 dark:bg-[#020617]">
    <ion-header class="ion-no-border">
      <div class="bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl pt-safe border-b border-slate-100 dark:border-white/5">
        <div class="max-w-full mx-auto px-4 h-16 flex items-center justify-between">
          <div class="flex items-center gap-4">
            <button 
              @click="$router.back()" 
              class="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 flex items-center justify-center active:scale-90 transition-all"
            >
              <ion-icon :icon="arrowBackOutline" class="text-xl" />
            </button>
            <div>
              <h1 class="text-lg font-black text-slate-900 dark:text-white tracking-tight mt-3">Xodimlar</h1>
            </div>
          </div>

          
        </div>

        <div class="px-4 mt-3">
  <div class="flex items-center gap-2">
    <div class="flex-1">
      <Input
        icon-pre="fas fa-search"
        clearable
        v-model="searchQuery"
        type="text" 
        placeholder="Ism, ID yoki lavozim..." 
        class="w-full"
      />
    </div>
    <div class="shrink-0 mt-[-23px] flex items-center gap-2">
      <Button size="md" @click="openAdvancedFilter" icon="fas fa-filter" rounded-full></Button>
      <Button size="md" @click="openAdvancedFilter" icon="fas fa-user-plus" rounded-full></Button>
    </div>
  </div>

  
</div>
      </div>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)">
        <ion-refresher-content 
          pulling-icon="chevron-down-outline" 
          refreshing-spinner="crescent">
        </ion-refresher-content>
      </ion-refresher>

      <div class="max-w-full mx-auto px-4 py-6">
        
        <div v-if="isLoading" class="space-y-4">
          <div v-for="i in 6" :key="i" 
               class="h-[88px] bg-white dark:bg-slate-900/50 rounded-[28px] border border-slate-100 dark:border-white/5 animate-pulse">
          </div>
        </div>

        <div v-else class="space-y-3">
          <div 
            v-for="user in filteredUsers" :key="user.id" 
            class="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-[28px] p-4 flex items-center justify-between shadow-sm hover:shadow-indigo-500/5 transition-all duration-300 active:scale-[0.98]"
          >
            <div class="flex items-center gap-4">
              <div class="relative">
                <div class="w-14 h-14 rounded-[20px] bg-gradient-to-br from-indigo-50 to-slate-100 dark:from-indigo-500/10 dark:to-slate-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-500/20">
                  <span class="text-xl font-black">{{ user.name.charAt(0) }}</span>
                </div>
                <div 
                  :class="user.isOnline ? 'bg-emerald-500' : 'bg-slate-300'"
                  class="absolute -bottom-0.5 -right-0.5 w-4.5 h-4.5 border-[3px] border-white dark:border-slate-900 rounded-full"
                ></div>
              </div>

              <div class="flex flex-col">
                <div class="flex items-center gap-2 mb-1">
                  <h3 class="font-black text-[15px] text-slate-800 dark:text-slate-100 tracking-tight leading-none">
                    {{ user.name }}
                  </h3>
                </div>
                <div class="flex items-center gap-1.5">
                  <span class="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase rounded-lg border border-indigo-100 dark:border-indigo-500/10">
                    {{ user.role }}
                  </span>
                  <span class="text-[11px] text-slate-400 font-bold tracking-tighter">ID: #{{ user.id }}</span>
                </div>
              </div>
            </div>

            <div class="flex items-center gap-1">
              <button class="w-10 h-10 rounded-xl flex items-center justify-center text-slate-300 dark:text-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                <ion-icon :icon="chevronForwardOutline" class="text-lg" />
              </button>
            </div>
          </div>
<EmptyState 
v-if="filteredUsers.length === 0"
          title="Xodim topilmadi"
          :searchTerm="searchQuery"
          description="Biz qidirayotgan ism bo'yicha hech qanday natija chiqmaganini aytishdan afsusdamiz."
          actionLabel="Qidiruvni tozalash"
          @action="searchQuery = ''"
        />
          
        </div>
        
      </div>
    </ion-content>

  </ion-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { 
  IonPage, IonHeader, IonContent, IonRefresher, IonRefresherContent, IonIcon 
} from '@ionic/vue';
import { 
  arrowBackOutline, searchOutline, personAddOutline, chevronForwardOutline 
} from 'ionicons/icons';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import {Input,EmptyState,Button,Select} from '../../../UI/UI';

const isLoading = ref(true);
const searchQuery = ref('');
const selectedCategory = ref('all'); // Standart: Hammasi

// Kategoriyalar ro'yxati (Restoapp rollari)
const categories = ref([
  { label: 'Barchasi', value: 'all' },
  { label: 'Admin', value: 'Admin' },
  { label: 'Manager', value: 'Manager' },
  { label: 'Ofitsiant', value: 'Ofitsiant' },
  { label: 'Oshpaz', value: 'Oshpaz' },
  { label: 'Kassir', value: 'Kassir' },
]);
const users = ref([
  { id: 2001, name: "Azizbek Karimov", role: "Manager", isOnline: true },
  { id: 2005, name: "Dilnoza Sodiqova", role: "Kassir", isOnline: true },
  { id: 2009, name: "Shaxzod Aliyev", role: "Ofitsiant", isOnline: false },
  { id: 2012, name: "Muzaffar Hakimov", role: "Oshpaz", isOnline: true },
  { id: 2015, name: "Nilufar Orifova", role: "Ofitsiant", isOnline: false },
  { id: 2018, name: "Bekzod Rahmonov", role: "Admin", isOnline: true },
]);

// FILTRLASH MANTIQI (Best Practice)
const filteredUsers = computed(() => {
  return users.value.filter(user => {
    // 1. Matnli qidiruv (Ism, ID yoki Rol bo'yicha)
    const query = searchQuery.value.toLowerCase();
    const matchesSearch = 
      user.name.toLowerCase().includes(query) ||
      user.id.toString().includes(query) ||
      user.role.toLowerCase().includes(query);

    // 2. Kategoriya (Chip) bo'yicha tanlov
    const matchesCategory = 
      selectedCategory.value === 'all' || 
      user.role === selectedCategory.value;

    return matchesSearch && matchesCategory;
  });
});

const openAdvancedFilter = () => {
  // Bu yerda Modal yoki Popover ochishingiz mumkin
  console.log("Murakkab filtr ochildi");
};

const handleRefresh = async (event) => {
  await Haptics.impact({ style: ImpactStyle.Light });
  // Simulyatsiya (Backend-dan ma'lumot olish)
  setTimeout(() => {
    event.target.complete();
  }, 1500);
};

const addUser = async () => {
  await Haptics.impact({ style: ImpactStyle.Medium });
  // Foydalanuvchi qo'shish modalini ochish mantiqi
};

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 1000);
});
</script>

<style scoped>
/* Shadow DOM ichidagi scrollbarni yashirish */
ion-content::part(scroll) {
  scrollbar-width: none;
}
ion-content::part(scroll)::-webkit-scrollbar {
  display: none;
}

/* Mobil qurilmalar uchun yuqori bo'shliq (notch) */
.pt-safe {
  padding-top: env(safe-area-inset-top);
}

/* Silliq o'tish animatsiyalari */
.group:active {
  background-color: rgba(var(--ion-color-primary-rgb), 0.05);
}
</style>