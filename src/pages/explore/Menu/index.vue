<template>
  <ion-page class="bg-slate-50 dark:bg-slate-950">
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
          Menyu
        </h1>
      </div>

      <button class="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-500 flex items-center justify-center active:scale-95 transition-all">
        <ion-icon :icon="searchOutline" class="text-base" />
      </button>
    </div>

    <div class="max-w-full mx-auto px-2 pb-1 mt-6 overflow-x-auto no-scrollbar flex gap-2">
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
        
        <div class="grid grid-cols-1 gap-5">
          <div 
            v-for="food in filteredFoods" :key="food.id"
            class="group bg-white dark:bg-slate-900 rounded-[32px] p-2 border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-xl transition-all duration-500 flex gap-4"
          >
            <div class="relative w-32 h-32 flex-none overflow-hidden rounded-[26px]">
              <img :src="food.image" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div class="absolute top-2 left-2 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg shadow-sm">
                <span class="text-[10px] font-black text-orange-600">★ {{ food.rating }}</span>
              </div>
            </div>

            <div class="flex-1 py-2 pr-4 flex flex-col justify-between">
              <div>
                <h3 class="text-[16px] font-black text-slate-800 dark:text-white leading-tight mb-1">{{ food.name }}</h3>
                <p class="text-[11px] text-slate-400 font-medium line-clamp-2 leading-relaxed">{{ food.description }}</p>
              </div>

              <div class="flex items-center justify-between mt-2">
                <span class="text-lg font-black text-slate-900 dark:text-white tracking-tighter">
                  {{ food.price.toLocaleString() }} <small class="text-[10px] uppercase opacity-50">uzs</small>
                </span>
                
                <button @click="addToCart(food)" class="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center active:scale-90 transition-all shadow-lg shadow-indigo-500/20">
                  <ion-icon :icon="addOutline" class="text-xl" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="cartCount > 0" class="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-xs animate-bounce-in">
        <button class="w-full bg-slate-900 dark:bg-indigo-600 text-white py-4 px-6 rounded-[24px] shadow-2xl flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="bg-white/20 px-2 py-1 rounded-lg text-[12px] font-black">{{ cartCount }}</div>
            <span class="text-sm font-bold tracking-tight">Savatchani ko'rish</span>
          </div>
          <span class="text-sm font-black">{{ cartTotal.toLocaleString() }} so'm</span>
        </button>
      </div>
    </ion-content>
  <Footer/>
  </ion-page>
</template>

<script setup>
import { ref, computed } from 'vue';
import { IonPage, IonHeader, IonContent, IonIcon } from '@ionic/vue';
import {  searchOutline, addOutline,arrowBackOutline } from 'ionicons/icons';
import Footer from '../../../partials/Footer.vue';

const activeCategory = ref(1);
const categories = [
  { id: 1, name: '🍔 Fast Food' },
  { id: 2, name: '🍲 Milliy Taomlar' },
  { id: 3, name: '🥗 Salatlar' },
  { id: 4, name: '🥤 Ichimliklar' }
];

const foods = [
  { 
    id: 1, catId: 1, name: 'Double Cheese Burger', rating: 4.8, price: 45000, 
    description: 'Mol go\'shti, cheddar pishlog\'i, maxsus sous va yangi sabzavotlar.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=300&h=300&auto=format&fit=crop'
  },
  { 
    id: 2, catId: 1, name: 'Pizza Margherita', rating: 4.9, price: 68000, 
    description: 'Mozzarella pishlog\'i, tomat sousi va yangi rayhon barglari.',
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=300&h=300&auto=format&fit=crop'
  },
  { 
    id: 3, catId: 3, name: 'Sezar Salati', rating: 4.6, price: 32000, 
    description: 'Grilda pishgan tovuq, parmezan va krutonlar.',
    image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?q=80&w=300&h=300&auto=format&fit=crop'
  },
   { 
    id: 1, catId: 1, name: 'Double Cheese Burger', rating: 4.8, price: 45000, 
    description: 'Mol go\'shti, cheddar pishlog\'i, maxsus sous va yangi sabzavotlar.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=300&h=300&auto=format&fit=crop'
  },
  { 
    id: 2, catId: 1, name: 'Pizza Margherita', rating: 4.9, price: 68000, 
    description: 'Mozzarella pishlog\'i, tomat sousi va yangi rayhon barglari.',
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=300&h=300&auto=format&fit=crop'
  },
  { 
    id: 3, catId: 3, name: 'Sezar Salati', rating: 4.6, price: 32000, 
    description: 'Grilda pishgan tovuq, parmezan va krutonlar.',
    image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?q=80&w=300&h=300&auto=format&fit=crop'
  }
];

const filteredFoods = computed(() => foods.filter(f => f.catId === activeCategory.value));

// Savatcha mantiqi (oddiy ko'rinishda)
const cartCount = ref(2);
const cartTotal = ref(113000);

const addToCart = (food) => {
  console.log('Added to cart:', food.name);
};
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

.animate-bounce-in {
  animation: bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

@keyframes bounceIn {
  from { opacity: 0; transform: translate(-50%, 50px) scale(0.9); }
  to { opacity: 1; transform: translate(-50%, 0) scale(1); }
}

header { backdrop-filter: blur(20px); }
* { -webkit-tap-highlight-color: transparent; }
</style>