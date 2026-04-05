<template>
  <ion-page class="bg-slate-50 dark:bg-[#020617]">
    <ion-header class="ion-no-border">
      <div class=" relative bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-100 dark:border-white/5 pt-safe overflow-hidden">
        
        <transition name="slide-fade">
          <div v-if="!isSearchActive" class="px-4 h-14 mt-10 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <Button  @click="$router.back()" icon="fas fa-arrow-left" size="sm" >
              </Button>
              <h1 class="text-lg font-black text-slate-900 dark:text-white tracking-tight mt-3">Menyu</h1>
            </div>

            <div class="flex items-center gap-2">
              <Button @click="toggleSearch" icon="fas fa-search" size="sm">
              </Button>
              
              <Button @click="isCategoryModalOpen = true" icon="fas fa-list" size="sm">
              </Button>

              <Button @click="store.ModalAction()" icon="fas fa-plus" size="sm">
              </Button>
            </div>
          </div>
        </transition>

      <transition name="search-slide">
  <div v-if="isSearchActive" class="mt-10 px-4 h-14 flex items-center gap-2 bg-white dark:bg-slate-950 shadow-sm">
    
    <div class="flex-1">
      <Input 
        v-model="searchQuery"
        size="small" 
        clearable 
        iconPre="fas fa-search" 
        placeholder="Taom izlash..." 
        autofocus
      />
    </div>

    <Button 
      @click="toggleSearch" 
      size="sm"
      icon="fas fa-xmark"
      class="mt-[-20px]"
    </Button>

  </div>
</transition>

        <div v-if="!isSearchActive" class="px-4 py-2 flex items-center justify-between border-t border-slate-50 dark:border-white/5 bg-white/50 dark:bg-transparent">
          <div class="flex items-center gap-2">
            <i :class="[currentCategory?.icon, 'text-indigo-500 text-[10px]']"></i>
            <span class="text-[10px] font-black uppercase text-slate-400 tracking-widest">{{ currentCategory?.label }}</span>
          </div>
          <span v-if="filteredFoods.length" class="text-[10px] font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded-full">
            {{ filteredFoods.length }} ta mahsulot
          </span>
        </div>
      </div>
    </ion-header>

    <ion-content :fullscreen="true">
      <div class="max-w-7xl mx-auto px-4 py-6 pb-44">
        
        <div v-if="filteredFoods.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div 
            v-for="food in filteredFoods" :key="food.id"
            :class="[
              'group bg-white dark:bg-slate-900 rounded-[30px] p-3 border transition-all duration-500 flex gap-4 items-center relative overflow-hidden',
              getItemCount(food.id) > 0 ? 'border-indigo-500 shadow-md ring-1 ring-indigo-500/10' : 'border-slate-100 dark:border-white/5 shadow-sm'
            ]"
          >
            <div class="relative w-24 h-24 flex-none overflow-hidden rounded-[22px] bg-slate-100 dark:bg-slate-800">
              <img :src="food.image" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <button v-if="getItemCount(food.id) > 0" @click="removeFromCart(food.id)" class="absolute inset-0 bg-red-500/80 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <ion-icon :icon="trashOutline" class="text-2xl" />
              </button>
            </div>

            <div class="flex-1 min-w-0">
              <h3 class="text-[15px] font-black text-slate-800 dark:text-white truncate">{{ food.name }}</h3>
              <p class="text-[11px] text-slate-400 line-clamp-1 mb-2">{{ food.description }}</p>
              
              <div class="flex items-center justify-between">
                <span class="text-[14px] font-black text-indigo-600 dark:text-indigo-400">
                  {{ food.price.toLocaleString() }} <small class="text-[9px]">UZS</small>
                </span>
                
                <div class="flex items-center">
                  <div v-if="getItemCount(food.id) > 0" class="flex items-center bg-slate-100 dark:bg-slate-800 rounded-[14px] p-1 gap-1 border border-slate-200 dark:border-white/5">
                    <button @click="updateCart(food, -1)" class="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 text-slate-600 dark:text-white flex items-center justify-center"><ion-icon :icon="removeOutline" /></button>
                    <span class="text-xs font-black min-w-[24px] text-center dark:text-white">{{ getItemCount(food.id) }}</span>
                    <button @click="updateCart(food, 1)" class="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center"><ion-icon :icon="addOutline" /></button>
                  </div>
                  <button v-else @click="updateCart(food, 1)" class="w-10 h-10 rounded-xl bg-slate-900 dark:bg-indigo-600 text-white flex items-center justify-center active:scale-90 shadow-lg"><ion-icon :icon="addOutline" class="text-xl" /></button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="flex flex-col items-center gap-4 mt-20">
          <i class="fas fa-pizza-slice text-6xl text-slate-300"></i>
          <h2 class="text-xl font-black text-slate-500">Taom topilmadi</h2>
          <p class="text-sm text-slate-400">Boshqa kalit so'z bilan qidirib ko'ring yoki kategoriyani o'zgartiring.</p>
        </div>

      </div>

      <div v-if="cartTotalItems > 0" class="fixed bottom-28 left-4 right-4 z-40 animate-slide-up">
        <button @click="openCart" class="w-full bg-indigo-600 text-white h-16 rounded-[24px] shadow-2xl flex items-center justify-between px-4 group">
          <div class="flex items-center gap-4">
            <div class="w-11 h-11 bg-white/20 rounded-2xl flex items-center justify-center relative ring-1 ring-white/30">
              <ion-icon :icon="cartOutline" class="text-xl" />
              <span class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-black border-2 border-slate-950 dark:border-indigo-600">{{ cartTotalItems }}</span>
            </div>
            <div class="text-left">
              <p class="text-[10px] font-black uppercase opacity-60 leading-none mb-1">Jami summa</p>
              <p class="text-base font-black tracking-tighter">{{ cartTotalPrice.toLocaleString() }} so'm</p>
            </div>
          </div>
          <div class="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl">
            <span class="text-xs font-black uppercase tracking-widest">Buyurtma</span>
            <ion-icon :icon="chevronForwardOutline" />
          </div>
        </button>
      </div>
    </ion-content>

    <ion-modal :is-open="isCategoryModalOpen" @didDismiss="isCategoryModalOpen = false" :initial-breakpoint="0.5" :breakpoints="[0, 0.5, 0.85]" handle-behavior="cycle">
      <div class="p-6 bg-white dark:bg-slate-950 h-full">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-black dark:text-white uppercase tracking-tight">Kategoriyalar</h2>
          <button @click="isCategoryModalOpen = false" class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center">
            <ion-icon :icon="closeOutline" />
          </button>
        </div>
        <div class="grid grid-cols-2 gap-3 pb-10">
          <button 
            v-for="cat in categories" :key="cat.id" 
            @click="activeCategory = cat.id; isCategoryModalOpen = false"
            :class="['p-5 rounded-[28px] border-2 flex flex-col items-center gap-3 transition-all active:scale-95', 
              activeCategory === cat.id ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-500/20' : 'bg-slate-50 dark:bg-slate-900 border-transparent text-slate-600 dark:text-slate-400']"
          >
            <i :class="[cat.icon, 'text-2xl']"></i>
            <span class="text-xs font-black uppercase tracking-wide">{{ cat.label }}</span>
          </button>
        </div>
      </div>
    </ion-modal>

    <Footer class="z-50" />
  </ion-page>
</template>

<script setup>
import { ref, computed } from 'vue';
import { IonPage, IonHeader, IonContent, IonIcon, IonModal, modalController } from '@ionic/vue';
import { 
  arrowBackOutline, addOutline, searchOutline, gridOutline, 
  removeOutline, cartOutline, trashOutline, chevronForwardOutline, closeOutline 
} from 'ionicons/icons';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Input,Button,Select } from '../../UI/UI'; 
import Footer from '../../partials/Footer.vue';
import CartModal from './Cart.vue';

// --- STATE ---
const isSearchActive = ref(false);
const isCategoryModalOpen = ref(false);
const activeCategory = ref(1);
const searchQuery = ref("");
const cart = ref({});

const categories = [
  { id: 1, label: 'Fast Food', key: 'fastfood', icon: 'fa-solid fa-burger' },
  { id: 2, label: 'Milliy', key: 'milliy', icon: 'fa-solid fa-utensils' },
  { id: 3, label: 'Salatlar', key: 'salatlar', icon: 'fa-solid fa-leaf' },
  { id: 4, label: 'Ichimliklar', key: 'drinks', icon: 'fa-solid fa-glass-water' }
];

const foods = ref([
  { id: 101, catId: 1, name: 'Eco Burger', price: 35000, description: 'Sershira go\'sht va pishloq', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300' },
  { id: 102, catId: 1, name: 'Cheese Pizza', price: 65000, description: 'To\'rt xil pishloqli pitsa', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300' },
  { id: 103, catId: 2, name: 'Osh (Palov)', price: 45000, description: 'Buxorocha so\'faki palov', image: 'https://images.unsplash.com/photo-1512058560366-cd242d4586ee?w=300' },
]);

// --- COMPUTED ---
const currentCategory = computed(() => categories.find(c => c.id === activeCategory.value));

const filteredFoods = computed(() => {
  return foods.value.filter(f => {
    const matchCat = f.catId === activeCategory.value;
    const matchSearch = f.name.toLowerCase().includes(searchQuery.value.toLowerCase());
    return matchCat && matchSearch;
  });
});

const cartTotalItems = computed(() => Object.values(cart.value).reduce((a, b) => a + b, 0));
const cartTotalPrice = computed(() => {
  return Object.entries(cart.value).reduce((total, [id, qty]) => {
    const food = foods.value.find(f => f.id == id);
    return total + (food ? food.price * qty : 0);
  }, 0);
});

// --- ACTIONS ---
const toggleSearch = async () => {
  isSearchActive.value = !isSearchActive.value;
  if (!isSearchActive.value) searchQuery.value = "";
  await Haptics.impact({ style: ImpactStyle.Light });
};

const updateCart = async (food, change) => {
  const qty = (cart.value[food.id] || 0) + change;
  qty <= 0 ? delete cart.value[food.id] : cart.value[food.id] = qty;
  await Haptics.impact({ style: ImpactStyle.Medium });
};

const removeFromCart = (id) => delete cart.value[id];
const getItemCount = (id) => cart.value[id] || 0;

const openCart = async () => {
  const modal = await modalController.create({
    component: CartModal,
    componentProps: { 
      items: Object.entries(cart.value).map(([id, q]) => ({...foods.value.find(f => f.id == id), quantity: q})),
      total: cartTotalPrice.value 
    },
    initialBreakpoint: 0.75,
    breakpoints: [0, 0.75, 1]
  });
  modal.present();
};
</script>

<style scoped>
/* Search Animation */
.search-slide-enter-active, .search-slide-leave-active { transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
.search-slide-enter-from { transform: translateY(-100%); opacity: 0; }
.search-slide-leave-to { transform: translateY(-20px); opacity: 0; }

.slide-fade-enter-active, .slide-fade-leave-active { transition: all 0.2s ease; }
.slide-fade-enter-from, .slide-fade-leave-to { opacity: 0; transform: scale(0.98); }

/* Custom Styles */
ion-modal { --border-radius: 32px; }
.animate-slide-up { animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes slideUp { from { transform: translateY(100px); } to { transform: translateY(0); } }
</style>