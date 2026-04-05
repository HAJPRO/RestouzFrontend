<template>
  <ion-page class="bg-slate-50 dark:bg-[#020617]">
 
    <Header
      title="Menyu"
      searchable
      v-model="searchQuery"
      searchPlaceholder="Taom izlash..."
    >
      <template #actions>
        <Button
          @click="isCategoryModalOpen = true"
          icon="fas fa-list"
          size="sm"
        ></Button>
      </template>
    </Header>

    <ion-content :fullscreen="true" class="ion-padding-bottom">
      <div class="max-w-7xl mx-auto px-4 py-6">
        <div
          v-if="filteredFoods.length > 0"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <div
            v-for="food in filteredFoods"
            :key="food.id"
            :class="[
              'group bg-white dark:bg-slate-900 rounded-[30px] p-3 border transition-all duration-500 flex gap-4 items-center relative overflow-hidden',
              getItemCount(food.id) > 0
                ? 'border-indigo-500 shadow-md ring-1 ring-indigo-500/10'
                : 'border-slate-100 dark:border-white/5 shadow-sm',
            ]"
          >
            <div
              class="relative w-24 h-24 flex-none overflow-hidden rounded-[22px] bg-slate-100 dark:bg-slate-800"
            >
              <img
                :src="food.image"
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <button
                v-if="getItemCount(food.id) > 0"
                @click="removeFromCart(food.id)"
                class="absolute inset-0 bg-red-500/80 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ion-icon :icon="trashOutline" class="text-2xl" />
              </button>
            </div>

            <div class="flex-1 min-w-0">
              <h3
                class="text-[15px] font-black text-slate-800 dark:text-white truncate"
              >
                {{ food.name }}
              </h3>
              <p class="text-[11px] text-slate-400 line-clamp-1 mb-2">
                {{ food.description }}
              </p>

              <div class="flex items-center justify-between">
                <span
                  class="text-[14px] font-black text-indigo-600 dark:text-indigo-400"
                >
                  {{ food.price.toLocaleString() }}
                  <small class="text-[9px]">UZS</small>
                </span>

                <div class="flex items-center">
                  <div
                    v-if="getItemCount(food.id) > 0"
                    class="flex items-center bg-slate-100 dark:bg-slate-800 rounded-[14px] p-1 gap-1 border border-slate-200 dark:border-white/5"
                  >
                    <button
                      @click="updateCart(food, -1)"
                      class="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 text-slate-600 dark:text-white flex items-center justify-center"
                    >
                      <ion-icon :icon="removeOutline" />
                    </button>
                    <span
                      class="text-xs font-black min-w-[24px] text-center dark:text-white"
                      >{{ getItemCount(food.id) }}</span
                    >
                    <button
                      @click="updateCart(food, 1)"
                      class="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center"
                    >
                      <ion-icon :icon="addOutline" />
                    </button>
                  </div>
                  <button
                    v-else
                    @click="updateCart(food, 1)"
                    class="w-10 h-10 rounded-xl bg-slate-900 dark:bg-indigo-600 text-white flex items-center justify-center active:scale-90 shadow-lg"
                  >
                    <ion-icon :icon="addOutline" class="text-xl" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="cartTotalItems > 0"
        class="fixed bottom-24 left-4 right-4 z-40 animate-slide-up cursor-pointer"
      >
        <div
          class="bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl border border-slate-100 dark:border-white/10 overflow-hidden"
        >
          <div
            class="px-5 py-2.5 bg-slate-50/80 dark:bg-slate-900/50 backdrop-blur-md flex items-center justify-between border-b border-slate-100 dark:border-white/5"
          >
            <div class="flex items-center gap-3">
              <div
                class="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white dark:bg-white/5 shadow-sm border border-slate-100 dark:border-white/5"
              >
                <div class="w-1 h-1 rounded-full bg-slate-400"></div>
                <span
                  class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight"
                >
                  Asosiy:
                  <span class="text-slate-900 dark:text-slate-200">{{
                    subtotal.toLocaleString()
                  }}</span>
                </span>
              </div>

              <div
                class="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100/50 dark:border-indigo-500/20"
              >
                <i
                  class="fa-solid fa-bell-concierge text-[9px] text-indigo-500"
                ></i>
                <span
                  class="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight"
                >
                  Xizmat:
                  <span class="font-black"
                    >+{{ serviceFee.toLocaleString() }}</span
                  >
                </span>
              </div>
            </div>

            <div
              class="flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900 dark:bg-indigo-600 shadow-lg shadow-slate-200 dark:shadow-indigo-900/20"
            >
              <i
                class="fa-solid fa-basket-shopping text-[9px] text-white/70"
              ></i>
              <span
                class="text-[9px] font-black text-white uppercase tracking-widest"
              >
                {{ cartTotalItems }} TA
              </span>
            </div>
          </div>

          <div class="p-4 flex items-center justify-between gap-3">
            <div class="flex-1" @click="openCart">
              <p
                class="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1"
              >
                Jami To'lov
              </p>
              <div class="flex items-baseline gap-1">
                <span
                  class="text-2xl font-black text-slate-900 dark:text-white tracking-tighter"
                  >{{ finalTotal.toLocaleString() }}</span
                >
                <span
                  class="text-[10px] font-black text-slate-400 uppercase tracking-widest"
                  >uzs</span
                >
              </div>
            </div>

            <Button
              @click="openCart"
              size="sm"
              leftIcon="fas fa-shopping-basket"
              class="!bg-indigo-600 hover:!bg-indigo-700 shadow-lg shadow-indigo-500/30 !rounded-2xl transition-all active:scale-95"
            >
              <span class="font-black uppercase tracking-wider text-[11px]"
                >Savat</span
              >
            </Button>
          </div>
        </div>
      </div>
    </ion-content>

    <ion-modal
      :is-open="isCategoryModalOpen"
      @didDismiss="isCategoryModalOpen = false"
      :initial-breakpoint="0.5"
      :breakpoints="[0, 0.5, 0.85]"
    >
      <div class="p-6 bg-white dark:bg-slate-950 h-full">
        <h2
          class="text-xl font-black dark:text-white uppercase mb-6 tracking-tight"
        >
          Kategoriyalar
        </h2>
        <div class="grid grid-cols-2 gap-3 pb-10">
          <button
            v-for="cat in categories"
            :key="cat.id"
            @click="
              activeCategory = cat.id;
              isCategoryModalOpen = false;
            "
            :class="[
              'p-5 rounded-[28px] border-2 flex flex-col items-center gap-3 transition-all',
              activeCategory === cat.id
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-500/20'
                : 'bg-slate-50 dark:bg-slate-900 border-transparent text-slate-600',
            ]"
          >
            <i :class="[cat.icon, 'text-2xl']"></i>
            <span class="text-xs font-black uppercase">{{ cat.label }}</span>
          </button>
        </div>
      </div>
    </ion-modal>

    <Footer class="z-50" />
  </ion-page>
  <div  v-if="isCartOpen"> <CartModal
      :items="cartItemsArray"
      :total="finalTotal"
      @updateQty="handleCartUpdate"
      @confirm="processOrder"
   /></div>
  
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import {
  IonPage,
  IonHeader,
  IonContent,
  IonIcon,
  IonModal,
  modalController,
} from "@ionic/vue";
import {
  addOutline,
  removeOutline,
  cartOutline,
  trashOutline,
  chevronForwardOutline,
  closeOutline,
} from "ionicons/icons";
import { Haptics, ImpactStyle } from "@capacitor/haptics";
import { Input, Button, Header } from "../../UI/UI";
import Footer from "../../partials/Footer.vue";
import CartModal from "./Cart.vue";

// --- STATE ---
const isSearchActive = ref(false);
const isCategoryModalOpen = ref(false);
const activeCategory = ref(1);
const searchQuery = ref("");
const cart = ref({}); // { foodId: quantity }

const categories = [
  { id: 1, label: "Fast Food", key: "fastfood", icon: "fa-solid fa-burger" },
  { id: 2, label: "Milliy", key: "milliy", icon: "fa-solid fa-utensils" },
  { id: 3, label: "Salatlar", key: "salatlar", icon: "fa-solid fa-leaf" },
  {
    id: 4,
    label: "Ichimliklar",
    key: "drinks",
    icon: "fa-solid fa-glass-water",
  },
];

const foods = ref([
  {
    id: 101,
    catId: 1,
    name: "Eco Burger",
    price: 35000,
    description: "Sershira go'sht va pishloq",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300",
  },
  {
    id: 102,
    catId: 1,
    name: "Cheese Pizza",
    price: 65000,
    description: "To'rt xil pishloqli pitsa",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300",
  },
  {
    id: 103,
    catId: 2,
    name: "Osh (Palov)",
    price: 45000,
    description: "Buxorocha so'faki palov",
    image: "https://images.unsplash.com/photo-1512058560366-cd242d4586ee?w=300",
  },
]);

// --- COMPUTED (HISOB-KITOB) ---
const currentCategory = computed(() =>
  categories.find((c) => c.id === activeCategory.value),
);

const filteredFoods = computed(() => {
  return foods.value.filter((f) => {
    const matchCat = f.catId === activeCategory.value;
    const matchSearch = f.name
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase());
    return matchCat && matchSearch;
  });
});
const isCartOpen = ref(false);
const openCart = () => {
  isCartOpen.value = !isCartOpen.value;
  Haptics.impact({ style: ImpactStyle.Medium });
};
const cartTotalItems = computed(() =>
  Object.values(cart.value).reduce((a, b) => a + b, 0),
);

// Hisob-kitoblar (Xizmat haqi va jami)
const subtotal = computed(() => {
  return Object.entries(cart.value).reduce((total, [id, qty]) => {
    const food = foods.value.find((f) => f.id == id);
    return total + (food ? food.price * qty : 0);
  }, 0);
});

const serviceFee = computed(() => subtotal.value * 0.1); // 10% xizmat haqi
const finalTotal = computed(() => subtotal.value + serviceFee.value);

// Modalga uzatish uchun savat massivi
const cartItemsArray = computed(() => {
  return Object.entries(cart.value)
    .map(([id, qty]) => {
      const food = foods.value.find((f) => f.id == id);
      return food ? { ...food, quantity: qty } : null;
    })
    .filter((item) => item !== null);
});

// --- ACTIONS ---
const toggleSearch = async () => {
  isSearchActive.value = !isSearchActive.value;
  if (!isSearchActive.value) searchQuery.value = "";
  await Haptics.impact({ style: ImpactStyle.Light });
};

const updateCart = async (food, change) => {
  const currentQty = cart.value[food.id] || 0;
  const newQty = currentQty + change;
  if (newQty <= 0) {
    delete cart.value[food.id];
  } else {
    cart.value[food.id] = newQty;
  }
  await Haptics.impact({ style: ImpactStyle.Medium });
};

const removeFromCart = async (id) => {
  delete cart.value[id];
  await Haptics.impact({ style: ImpactStyle.Light });
};

const getItemCount = (id) => cart.value[id] || 0;

// --- CART MODAL BILAN SINXRONIZATSIYA ---
const syncUpdateQty = (ev) => {
  const { id, change } = ev.detail;
  const food = foods.value.find((f) => f.id === id);
  if (food) updateCart(food, change);
};

const syncRemoveItem = (ev) => {
  removeFromCart(ev.detail);
};

onMounted(() => {
  window.addEventListener("cart:update-qty", syncUpdateQty);
  window.addEventListener("cart:remove-item", syncRemoveItem);
});

onUnmounted(() => {
  window.removeEventListener("cart:update-qty", syncUpdateQty);
  window.removeEventListener("cart:remove-item", syncRemoveItem);
});
</script>

<style scoped>
.pt-safe {
  padding-top: env(safe-area-inset-top);
}
.search-slide-enter-active,
.search-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.search-slide-enter-from {
  transform: translateY(-100%);
  opacity: 0;
}
.search-slide-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

.animate-slide-up {
  animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes slideUp {
  from {
    transform: translateY(100px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
