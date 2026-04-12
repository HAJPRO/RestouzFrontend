<template>
  <ion-page>
    <!-- <Modal 
      v-model="isCategoryOpen"
      title="Kategoriyalar"
      icon="fa-solid fa-grid-2"
      width="550px"
      @close="isCategoryOpen = false"
    >
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 p-1 animate-fade-in">
        <button 
          v-for="cat in categories" 
          :key="cat.id"
          @click="handleCategorySelect(cat.id)"
          class="group relative overflow-hidden bg-slate-50 dark:bg-slate-800/40 hover:bg-indigo-600 p-4 rounded-[32px] border border-slate-100 dark:border-white/5 transition-all duration-300 flex flex-col items-center gap-3 active:scale-95 shadow-sm"
        >
          <div class="w-12 h-12 rounded-2xl bg-white dark:bg-slate-700 group-hover:bg-white/20 flex items-center justify-center transition-colors">
            <i :class="['fa-solid', cat.icon, 'text-lg text-indigo-600 dark:text-indigo-400 group-hover:text-white']"></i>
          </div>
          <div class="text-center">
            <span class="block text-[11px] font-black uppercase tracking-wider dark:text-white group-hover:text-white">
              {{ cat.name }}
            </span>
          </div>
          <i :class="['fa-solid', cat.icon, 'absolute -right-2 -bottom-2 text-4xl opacity-[0.03] group-hover:opacity-10 transition-opacity']"></i>
        </button>
      </div>
    </Modal> -->

    <Modal 
      v-model="isCartOpen"
      title="Savat"
      icon="fa-solid fa-cart-shopping"
      width="650px"
      @close="isCartOpen = false"
    >
      <div class="space-y-4">
        <div class="sticky top-0 z-10 mb-4 p-2 bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur-md rounded-[24px] flex gap-1.5 border border-slate-200/50 dark:border-white/5 shadow-sm">
          <button 
            v-for="tab in ['items', 'settings']" 
            :key="tab"
            @click="activeTab = tab"
            :class="[
              'flex-1 py-2.5 rounded-[20px] text-[10px] font-black uppercase tracking-[0.1em] transition-all duration-500 flex items-center justify-center gap-2',
              activeTab === tab 
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-md scale-[1.02]' 
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200/50'
            ]"
          >
            <i :class="[tab === 'items' ? 'fa-solid fa-rectangle-list' : 'fa-solid fa-sliders', 'text-[12px]']"></i>
            <span>{{ tab === 'items' ? 'Buyurtmalar' : 'Sozlamalar' }}</span>
          </button>
        </div>

        <div v-if="activeTab === 'items'" class="space-y-4 animate-fade-in">
          <div v-if="cartItems.length > 0" class="flex items-center justify-between px-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <span>Buyurtmalar ({{ totalItemsCount }} xil)</span>
            <Button @click="isCartOpen = false" size="sm" variant="secondary" class="!h-8 !text-[9px] !rounded-xl">
              <i class="fa-solid fa-plus mr-1"></i> Qo'shish
            </Button>
          </div>

          <div v-if="cartItems.length > 0" class="space-y-3">
            <div v-for="item in cartItems" :key="item.id" 
              class="bg-white dark:bg-slate-900 rounded-[28px] p-2 flex gap-4 items-center border border-slate-100 dark:border-white/5 shadow-sm"
            >
              <img :src="item.image" class="w-16 h-16 rounded-[20px] object-cover bg-slate-100 dark:bg-slate-800" />
              <div class="flex-1 min-w-0">
                <div class="flex justify-between">
                  <h4 class="text-sm font-black truncate dark:text-white text-slate-800 uppercase leading-tight">{{ item.name }}</h4>
                  <button @click="handleRemove(item.id)" class="text-slate-300 hover:text-rose-500 transition-all p-1">
                    <i class="fa-solid fa-trash-can text-xs"></i>
                  </button>
                </div>
                <div class="flex items-center justify-between mt-2">
                  <p class="text-[13px] font-black text-indigo-600 dark:text-indigo-400">
                    {{ (item.price * item.quantity).toLocaleString() }} <span class="text-[9px] opacity-40 uppercase ml-0.5">uzs</span>
                  </p>
                  <div class="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1 gap-1">
                    <button @click="handleUpdateQty(item.id, -1)" class="w-8 h-8 bg-white dark:bg-slate-700 rounded-lg flex items-center justify-center active:scale-75 shadow-sm dark:text-white">
                      <i class="fa-solid fa-minus text-[10px]"></i>
                    </button>
                    <span class="text-xs font-black min-w-[24px] text-center dark:text-white">{{ item.quantity }}</span>
                    <button @click="handleUpdateQty(item.id, 1)" class="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center active:scale-90 shadow-md">
                      <i class="fa-solid fa-plus text-[10px]"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div v-else class="py-20 text-center">
             <i class="fa-solid fa-basket-shopping text-4xl text-slate-200 mb-4 block"></i>
             <p class="text-slate-400 text-xs font-bold uppercase">Savat hozircha bo'sh</p>
          </div>
        </div>

        <div v-if="activeTab === 'settings'" class="space-y-6 animate-fade-in">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div @click="store_menu.toggleService()" class="bg-slate-50 dark:bg-slate-800/40 rounded-[28px] p-3 flex items-center justify-between border border-slate-100 dark:border-white/5 cursor-pointer hover:bg-slate-100 transition-colors">
              <div class="flex items-center gap-2">
                <div :class="['w-10 h-10 rounded-xl flex items-center justify-center transition-all', isServiceActive ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-200 dark:bg-slate-700 text-slate-400']">
                  <i class="fa-solid fa-utensils text-xs"></i>
                </div>
                <div>
                  <span class="block text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Xizmat (10%)</span>
                  <p class="text-[13px] font-black dark:text-white text-slate-900">{{ isServiceActive ? calculateServiceFee.toLocaleString() : "O'chirilgan" }}</p>
                </div>
              </div>
              <div :class="['w-11 h-6 rounded-full relative transition-all duration-300', isServiceActive ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600']">
                <div :class="['w-4 h-4 bg-white rounded-full absolute top-1 transition-all duration-300', isServiceActive ? 'right-1' : 'left-1']"></div>
              </div>
            </div>

            <div class="bg-slate-50 dark:bg-slate-800/40 rounded-[28px] p-3 border border-slate-100 dark:border-white/5 flex items-center gap-3">
              <div :class="['w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all', discountPercent > 0 ? 'bg-rose-500 text-white shadow-lg' : 'bg-slate-200 dark:bg-slate-700 text-slate-400']">
                <i class="fa-solid fa-percent text-xs"></i>
              </div>
              <div class="flex-1">
                <span class="block text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Chegirma (%)</span>
                <input type="number" v-model="discountPercent" class="w-full bg-transparent text-sm font-black outline-none dark:text-white border-none focus:ring-0 p-0" placeholder="0" />
              </div>
            </div>
          </div>

          <div class="p-1 bg-slate-100 dark:bg-slate-800/50 rounded-[22px] flex gap-1">
            <button 
              @click="orderType = 'table'"
              :class="['flex-1 py-3 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2', orderType === 'table' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' : 'text-slate-400']"
            >
              <i class="fa-solid fa-chair"></i> Stolga
            </button>
            <button 
              @click="orderType = 'takeaway'"
              :class="['flex-1 py-3 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2', orderType === 'takeaway' ? 'bg-white dark:bg-slate-700 text-rose-500 shadow-sm' : 'text-slate-400']"
            >
              <i class="fa-solid fa-bag-shopping"></i> Saboy
            </button>
          </div>

          <div class="grid grid-cols-1 gap-4">
            <transition name="fade-slide">
              <div v-if="orderType === 'table'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select size="small" v-model="selectedTable" label="Stol Tanlang" :options="tableList" searchable placeholder="Stol raqami..." iconPre="fa-solid fa-circle-dot" />
                <Select size="small" v-model="selectedCustomer" label="Mijoz (Ixtiyoriy)" :options="customerList" searchable placeholder="Mijoz ismi..." />
              </div>
            </transition>
            <Select size="small" v-model="selectedStaff" label="Mas'ul Ofitsiant" :options="staffList" searchable placeholder="Ofitsiantni tanlang..." />
            <TextArea v-model="orderComment" placeholder="Masalan: Achchiq bo'lmasin..." label="Buyurtma uchun izoh..." />
          </div>
        </div>
      </div>

      <template #footer>
        <div class="w-full space-y-2">
          <div class="grid grid-cols-3 gap-2 px-2 border-b border-slate-100 dark:border-white/5 pb-2">
            <div><p class="text-[9px] font-black text-slate-400 uppercase mb-1">Summa</p><p class="text-[12px] font-bold dark:text-white">{{ currentSubtotal.toLocaleString() }}</p></div>
            <div class="text-center"><p class="text-[9px] font-black text-indigo-500 uppercase mb-1">Xizmat</p><p class="text-[12px] font-bold text-indigo-600">+{{ calculateServiceFee.toLocaleString() }}</p></div>
            <div class="text-right"><p class="text-[9px] font-black text-rose-500 uppercase mb-1">Chegirma</p><p class="text-[12px] font-bold text-rose-600">-{{ calculateDiscountAmount.toLocaleString() }}</p></div>
          </div>
          <div class="flex justify-between items-center bg-indigo-50/50 dark:bg-indigo-500/5 p-4 rounded-[24px]">
            <div>
              <p class="text-slate-400 text-[10px] font-black uppercase mb-1">Jami To'lov</p>
              <div class="flex items-baseline gap-1">
                <span class="text-xl font-black text-slate-900 dark:text-white tracking-tighter">{{ finalTotal.toLocaleString() }}</span>
                <span class="text-[10px] font-black text-indigo-600 uppercase ml-1">uzs</span>
              </div>
            </div>
            <Button @click="handleSaveOrder()"  size="sm" leftIcon="fas fa-check">
              <span class="text-[11px] font-black uppercase tracking-widest">Saqlash</span>
            </Button>
          </div>
        </div>
      </template>
    </Modal>
  </ion-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { MenuStore } from "../../stores/index.store";
import { Select, Button, Modal, TextArea } from '../../UI/UI';

const store_menu = MenuStore();

// Store-dan barcha holatlar
const { 
  cartItems, 
  isCartOpen, 
  isCategoryOpen, // Kategoriya modali uchun
  categories,     // Kategoriya ro'yxati
  totalItemsCount,
  currentSubtotal,
  calculateServiceFee,
  calculateDiscountAmount,
  finalTotal,
  isReadyToOrder,
  isServiceActive,
  discountPercent,
  orderType,
  selectedTable,
  selectedStaff,
  orderComment,
  selectedCustomer 
} = storeToRefs(store_menu);

const activeTab = ref('items');

// Dummy ma'lumotlar (API kelguncha)
const staffList = ref([{ id: 1, name: 'Umid Shomurodov' }, { id: 2, name: 'Sardor Ali' }]);
const tableList = ref([{ id: 1, name: 'Stol #1' }, { id: 2, name: 'Stol #2' }, { id: 3, name: 'VIP xona' }]);
const customerList = ref([{ id: 1, name: 'Mijoz #1' }, { id: 2, name: 'Mijoz #2' }]);

onMounted(async () => {
  await Haptics.impact({ style: ImpactStyle.Medium });
});

// FUNKSIYALAR
const handleCategorySelect = async (categoryId) => {
  await Haptics.impact({ style: ImpactStyle.Light });
  // Bu yerda kategoriyani filterlash mantiqi bo'ladi
  console.log("Tanlangan kategoriya:", categoryId);
  isCategoryOpen.value = false; // Tanlangach modalni yopish
};

const handleUpdateQty = async (id, change) => {
  store_menu.updateCartQty({ id, change });
  await Haptics.impact({ style: ImpactStyle.Light });
};

const handleRemove = async (id) => {
  store_menu.removeFromCart(id);
  await Haptics.impact({ style: ImpactStyle.Medium });
};

const handleSaveOrder = async () => {
  // if (!isReadyToOrder.value) return;
  await Haptics.notification({ type: NotificationType.Success });
  console.log("oks");
  
  store_menu.CreateOrder();
  // isCartOpen.value = false;
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-slide-enter-active, .fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from, .fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { 
  -webkit-appearance: none; 
  margin: 0; 
}
</style>