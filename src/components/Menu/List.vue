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
        <Button
          @click="store_menu.ModalAction({ action: 'create' })"
          icon="fas fa-plus"
          size="sm"
        ></Button>
      </template>
    </Header>

    <ion-content :fullscreen="true" class="ion-padding-bottom">
      <GlobalRefresher />
      <div class="max-w-7xl mx-auto px-4 py-40">
        <div
          v-if="filteredFoods.length > 0"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <div
            v-for="food in filteredFoods"
            :key="food._id"
            :class="[
              'group bg-white dark:bg-slate-900 rounded-[30px] p-3 border transition-all duration-500 flex gap-4 items-center relative overflow-hidden',
              getItemCount(food._id) > 0
                ? 'border-indigo-500 shadow-md ring-1 ring-indigo-500/10'
                : 'border-slate-100 dark:border-white/5 shadow-sm',
            ]"
          >
            <div class="relative w-24 h-24 flex-none overflow-hidden rounded-[22px] bg-slate-100 dark:bg-slate-800">
              <img
                :src="food.image"
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <button
                v-if="getItemCount(food._id) > 0"
                @click="removeFromCart(food._id)"
                class="absolute inset-0 bg-red-500/80 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ion-icon :icon="trashOutline" class="text-2xl" />
              </button>
            </div>

            <div class="flex-1 min-w-0">
              <h3 class="text-[15px] font-black text-slate-800 dark:text-white truncate">
                {{ food.name }}
              </h3>
              <p class="text-[11px] text-slate-400 line-clamp-1 mb-2">
                {{ food.description }}
              </p>

              <div class="flex items-center justify-between">
                <span class="text-[14px] font-black text-indigo-600 dark:text-indigo-400">
                  {{ food.price.toLocaleString() }}
                  <small class="text-[9px]">UZS</small>
                </span>

                <div class="flex items-center">
                  <div
                    v-if="getItemCount(food._id) > 0"
                    class="flex items-center bg-slate-100 dark:bg-slate-800 rounded-[14px] p-1 gap-1 border border-slate-200 dark:border-white/5"
                  >
                    <button
                      @click="updateCart(food, -1)"
                      class="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 text-slate-600 dark:text-white flex items-center justify-center"
                    >
                      <ion-icon :icon="removeOutline" />
                    </button>
                    <span class="text-xs font-black min-w-[24px] text-center dark:text-white">
                      {{ getItemCount(food._id) }}
                    </span>
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

        <div v-else class="flex flex-col items-center justify-center py-20 text-slate-400">
           <i class="fa-solid fa-utensils text-4xl mb-4 opacity-20"></i>
           <p>Ushbu ruknda hozircha taomlar yo'q</p>
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
        <h2 class="text-xl font-black dark:text-white uppercase mb-6 tracking-tight">Kategoriyalar</h2>
        <div class="grid grid-cols-2 gap-3 pb-10">
          <button
            v-for="cat in categories"
            :key="cat.id"
            @click="activeCategory = cat.id; isCategoryModalOpen = false;"
            :class="[
              'p-5 rounded-[28px] border-2 flex flex-col items-center gap-3 transition-all',
              activeCategory === cat.id
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl'
                : 'bg-slate-50 dark:bg-slate-900 border-transparent text-slate-600',
            ]"
          >
            <i :class="[cat.icon, 'text-2xl']"></i>
            <span class="text-xs font-black uppercase">{{ cat.label }}</span>
          </button>
        </div>
      </div>
    </ion-modal>

    <CartModal
      v-if="isCartOpen"
      :items="cartItemsArray"
      :total="finalTotal"
      @updateQty="handleCartUpdate"
      @removeItem="removeFromCart"
      @close="isCartOpen = false"
    />

    <Footer class="z-50" />
  </ion-page>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { IonPage, IonContent, IonIcon, IonModal } from "@ionic/vue";
import { addOutline, removeOutline, trashOutline } from "ionicons/icons";
import { Haptics, ImpactStyle } from "@capacitor/haptics";
import { MenuStore } from "../../stores/index.store";
import { storeToRefs } from "pinia";
import { Button, Header, GlobalRefresher } from "../../UI/UI";
import Footer from "../../partials/Footer.vue";
import CartModal from "./Cart.vue";

const store_menu = MenuStore();
const { menus } = storeToRefs(store_menu);

// --- STATE ---
const isCategoryModalOpen = ref(false);
const isCartOpen = ref(false);
const activeCategory = ref(0); // Sukut bo'yicha 'Milliy' (id: 2)
const searchQuery = ref("");
const cart = ref({}); // { _id: quantity }

// Bazadagi 'category' maydoniga mos 'key'lar

const categories = [
  { id: 0, label: "Barchasi", key: "all", icon: "fa-solid fa-border-all" }, // Yangi qo'shildi
  { id: 1, label: "Sho'rvalar", key: "soups", icon: "fa-solid fa-bowl-food" },
  { id: 2, label: "Milliy", key: "main_dishes", icon: "fa-solid fa-utensils" },
  { id: 3, label: "Salatlar", key: "salatlar", icon: "fa-solid fa-leaf" },
  { id: 4, label: "Ichimliklar", key: "drinks", icon: "fa-solid fa-glass-water" },
  { id: 5, label: "Fast Food", key: "fastfood", icon: "fa-solid fa-burger" },
];

// --- COMPUTED ---

// Filtr: Tanlangan kategoriya key'i va qidiruv matni bo'yicha
const filteredFoods = computed(() => {
  // Tanlangan kategoriya obyektini topamiz
  const activeCat = categories.find(c => c.id === activeCategory.value);
  const activeCatKey = activeCat?.key;

  return menus.value.filter((f) => {
    // AGAR activeCatKey 'all' bo'lsa, hamma taomlar o'tadi (true)
    // AKS HOLDA, bazadagi category bilan mosligi tekshiriladi
    const matchCat = activeCatKey === 'all' ? true : f.category === activeCatKey;
    
    // Qidiruv mantiqi o'zgarishsiz qoladi
    const matchSearch = f.name.toLowerCase().includes(searchQuery.value.toLowerCase());
    
    return matchCat && matchSearch;
  });
});

// Savatdagi ma'lumotlarni to'liq obyekt ko'rinishida yig'ish
const cartItemsArray = computed(() => {
  return Object.entries(cart.value)
    .map(([id, qty]) => {
      const food = menus.value.find((f) => f._id === id);
      return food ? { ...food, quantity: qty } : null;
    })
    .filter(Boolean);
});

const cartTotalItems = computed(() => Object.values(cart.value).reduce((a, b) => a + b, 0));

const subtotal = computed(() => {
  return Object.entries(cart.value).reduce((total, [id, qty]) => {
    const food = menus.value.find((f) => f._id === id);
    return total + (food ? food.price * qty : 0);
  }, 0);
});

const serviceFee = computed(() => subtotal.value * 0.1); // 10% xizmat haqi
const finalTotal = computed(() => subtotal.value + serviceFee.value);

// --- ACTIONS ---

const getItemCount = (id) => cart.value[id] || 0;

const updateCart = async (food, change) => {
  const id = food._id; 
  const currentQty = cart.value[id] || 0;
  const newQty = currentQty + change;

  if (newQty <= 0) {
    delete cart.value[id];
  } else {
    cart.value[id] = newQty;
  }
  await Haptics.impact({ style: ImpactStyle.Medium });
};

// Savat modalidan keladigan yangilanish
const handleCartUpdate = (payload) => {
  const { id, change } = payload;
  const currentQty = cart.value[id] || 0;
  const newQty = currentQty + change;
  if (newQty <= 0) delete cart.value[id];
  else cart.value[id] = newQty;
};

const removeFromCart = async (id) => {
  delete cart.value[id];
  await Haptics.impact({ style: ImpactStyle.Light });
};

const openCart = () => {
  isCartOpen.value = true;
  Haptics.impact({ style: ImpactStyle.Medium });
};

// --- GLOBAL EVENT LISTENERS ---
const syncUpdateQty = (ev) => {
  const { id, change } = ev.detail;
  const food = menus.value.find((f) => f._id === id);
  if (food) updateCart(food, change);
};

const syncRemoveItem = (ev) => removeFromCart(ev.detail);

onMounted(async () => {
  await store_menu.GetAll();
  window.addEventListener("cart:update-qty", syncUpdateQty);
  window.addEventListener("cart:remove-item", syncRemoveItem);
});

onUnmounted(() => {
  window.removeEventListener("cart:update-qty", syncUpdateQty);
  window.removeEventListener("cart:remove-item", syncRemoveItem);
});
</script>

<style scoped>
.animate-slide-up {
  animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes slideUp {
  from { transform: translateY(100px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
</style>