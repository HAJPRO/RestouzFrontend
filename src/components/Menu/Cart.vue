<template>
  <div class="ion-page">
    <ion-header class="ion-no-border">
      <div class="px-6 py-4 flex items-center justify-between bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-white/5">
        <div>
          <h2 class="text-lg font-black tracking-tight dark:text-white text-slate-900">Buyurtma savati</h2>
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Stol: #12 / Ofitsiant: {{ selectedStaff ? 'Tanlangan' : '...' }}</p>
        </div>
        <button @click="dismissModal" class="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center active:scale-90 transition-all">
          <ion-icon :icon="closeOutline" class="text-xl dark:text-white text-slate-600" />
        </button>
      </div>
    </ion-header>

    <ion-content class="ion-padding" :scroll-y="true">
      <div class="max-w-full mx-auto pb-32 space-y-6 px-2 bg-white dark:bg-slate-900">
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select size="small" v-model="selectedStaff" label="Mas'ul Ofitsiant" :options="staffList" searchable placeholder="Tanlang..." />
          <Select size="small" v-model="selectedCustomer" label="Mijoz" :options="customerList" searchable placeholder="Tanlang..." />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div class="bg-white dark:bg-slate-800/50 rounded-[28px] p-5 flex items-center justify-between border border-slate-100 dark:border-white/5 shadow-sm" :class="{'ring-2 ring-indigo-500/20 bg-indigo-50/10': isServiceActive}">
            <div class="flex items-center gap-3">
              <div :class="['w-10 h-10 rounded-xl flex items-center justify-center', isServiceActive ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400']">
                <ion-icon :icon="restaurantOutline" />
              </div>
              <div>
                <span class="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Xizmat (10%)</span>
                <p class="text-[13px] font-black dark:text-white text-slate-900">{{ isServiceActive ? formatPrice(calculateServiceFee) : 'O\'chirilgan' }}</p>
              </div>
            </div>
            <div @click="toggleService" :class="['w-12 h-6 rounded-full relative cursor-pointer transition-all', isServiceActive ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700']">
              <div :class="['w-4 h-4 bg-white rounded-full absolute top-1 transition-all', isServiceActive ? 'right-1' : 'left-1']"></div>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800/50 rounded-[28px] p-5 border border-slate-100 dark:border-white/5 shadow-sm">
            <div class="flex items-center gap-3 mb-2">
              <div :class="['w-10 h-10 rounded-xl flex items-center justify-center', discountPercent > 0 ? 'bg-red-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400']">
                <ion-icon :icon="giftOutline" />
              </div>
              <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Chegirma (%)</span>
            </div>
            <input type="number" v-model="discountPercent" min="0" max="100" class="w-full bg-slate-50 dark:bg-slate-800 rounded-xl px-3 py-2 text-sm font-black outline-none dark:text-white focus:ring-1 focus:ring-indigo-500" />
          </div>
        </div>

        <div class="space-y-3">
  <div v-if="localItems.length > 0" class="flex items-center justify-between px-2">
    <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Buyurtmalar ({{ localItems.length }})</span>
    <Button @click="addMoreItems" size="sm" variant="secondary" leftIcon="fas fa-plus" class="!h-8 !text-[10px] !rounded-xl">
      Yangi qo'shish
    </Button>
  </div>

  <div v-if="localItems.length > 0" class="space-y-3">
    <div v-for="item in localItems" :key="item.id" class="bg-white dark:bg-slate-800/50 rounded-[28px] p-2 flex gap-4 items-center border border-slate-100 dark:border-white/5 shadow-sm">
      <img :src="item.image" class="w-16 h-16 rounded-[20px] object-cover bg-slate-100" />
      
      <div class="flex-1 min-w-0">
        <div class="flex justify-between items-start">
          <h4 class="text-sm font-black truncate dark:text-white text-slate-800 capitalize">{{ item.name }}</h4>
          <button @click="handleRemove(item.id)" class="text-slate-300 hover:text-red-500 p-1 active:scale-75 transition-all">
            <ion-icon :icon="trashOutline" />
          </button>
        </div>

        <div class="flex items-center justify-between mt-3">
          <div>
            <p class="text-[13px] font-black text-indigo-600 dark:text-indigo-400">{{ formatPrice(item.price * item.quantity) }} UZS</p>
            <button @click="addMoreItems" class="flex items-center gap-1 text-[9px] font-black text-indigo-500 uppercase tracking-tighter mt-1 active:opacity-50">
              <ion-icon :icon="addCircleOutline" class="text-xs" />
              Yana qo'shish
            </button>
          </div>

          <div class="flex items-center bg-slate-100 dark:bg-slate-700 rounded-xl p-1 gap-1">
            <button @click="handleUpdateQty(item.id, -1)" class="w-8 h-8 bg-white dark:bg-slate-600 rounded-lg flex items-center justify-center shadow-sm active:scale-90 transition-all">
              <ion-icon :icon="removeOutline" />
            </button>
            <span class="text-xs font-black w-7 text-center dark:text-white text-slate-800">{{ item.quantity }}</span>
            <button @click="handleUpdateQty(item.id, 1)" class="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center shadow-sm active:scale-90 transition-all">
              <ion-icon :icon="addOutline" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="flex flex-col items-center justify-center py-12 px-6 text-center animate-fade-in">
    <div class="w-24 h-24 mb-6 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center relative">
      <i class="fa-solid fa-basket-shopping text-4xl text-slate-200 dark:text-slate-700"></i>
      <div class="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center border-4 border-white dark:border-slate-900">
        <div class="w-2 h-0.5 bg-white rounded-full"></div>
      </div>
    </div>
    
    <h3 class="text-lg font-black text-slate-900 dark:text-white mb-2">Savat bo'sh</h3>
    <p class="text-xs font-medium text-slate-400 dark:text-slate-500 max-w-[200px] mb-8 leading-relaxed">
      Hali hech narsa qo'shmadingiz. Buyurtma olishni boshlash uchun menyuga o'ting.
    </p>

    <Button @click="addMoreItems" variant="primary" class="shadow-xl shadow-indigo-500/20 px-8">
      <i class="fa-solid fa-plus mr-2"></i>
      Taom qo'shish
    </Button>
  </div>
</div>
      </div>
    </ion-content>

    <ion-footer class="ion-no-border bg-white dark:bg-slate-950 p-6 pb-safe-area border-t border-slate-100 dark:border-white/5">
  <div class="max-w-2xl mx-auto space-y-4">
    
    <div class="grid grid-cols-3 gap-2 px-2 border-b border-slate-50 dark:border-white/5 pb-4">
      <div>
        <p class="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-1">Mahsulotlar</p>
        <p class="text-[12px] font-bold dark:text-white text-slate-700">{{ formatPrice(currentSubtotal) }}</p>
      </div>
      <div class="text-center">
        <p class="text-[9px] font-black text-indigo-500 uppercase tracking-tighter mb-1">Xizmat (10%)</p>
        <p class="text-[12px] font-bold text-indigo-600 dark:text-indigo-400">+{{ formatPrice(calculateServiceFee) }}</p>
      </div>
      <div class="text-right">
        <p class="text-[9px] font-black text-red-500 uppercase tracking-tighter mb-1">Chegirma</p>
        <p class="text-[12px] font-bold text-red-600">-{{ formatPrice(calculateDiscountAmount) }}</p>
      </div>
    </div>

    <div class="flex justify-between items-center px-2">
      <div>
        <p class="text-slate-400 text-[10px] font-black uppercase mb-1 tracking-widest">Jami To'lov</p>
        <div class="flex items-baseline gap-1">
          <span class="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">
            {{ formatPrice(finalTotal) }}
          </span>
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">uzs</span>
        </div>
      </div>
      
      <Button 
        @click="handleSaveOrder" 
        :disabled="!isReady" 
        size="sm" 
        leftIcon="fas fa-check"
        class="h-14 px-10 shadow-xl shadow-indigo-500/20 active:scale-95 transition-all"
      >
        <div class="flex flex-col items-center leading-none">
          <span class="text-[11px] font-black uppercase tracking-wider">Tasdiqlash</span>
        </div>
      </Button>
    </div>
  </div>
</ion-footer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { modalController, IonHeader, IonContent, IonFooter, IonIcon } from '@ionic/vue';
import { 
  closeOutline, addOutline, removeOutline, trashOutline, 
  restaurantOutline, giftOutline, addCircleOutline, searchOutline 
} from 'ionicons/icons';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { Select, Button } from '../../UI/UI';

const props = defineProps({
  items: { type: Array, default: () => [] },
  staffList: { type: Array, default: () => [] },
  customerList: { type: Array, default: () => [] }
});

// Mahalliy state
const localItems = ref([...props.items]);
const selectedStaff = ref(null);
const selectedCustomer = ref(null);
const isServiceActive = ref(true);
const discountPercent = ref(0);

// Hisob-kitoblar
const currentSubtotal = computed(() => localItems.value.reduce((sum, i) => sum + (i.price * i.quantity), 0));
const calculateServiceFee = computed(() => isServiceActive.value ? currentSubtotal.value * 0.1 : 0);
const calculateDiscountAmount = computed(() => currentSubtotal.value * (discountPercent.value / 100));
const finalTotal = computed(() => currentSubtotal.value + calculateServiceFee.value - calculateDiscountAmount.value);
const isReady = computed(() => localItems.value.length > 0 && selectedStaff.value !== null);

const formatPrice = (val) => Math.round(val || 0).toLocaleString();

// GLOBAL EVENT yuborish (List.vue ni yangilash uchun)
const emitGlobalUpdate = (name, detail) => {
  window.dispatchEvent(new CustomEvent(name, { detail }));
};

const handleUpdateQty = (id, change) => {
  const item = localItems.value.find(i => i.id === id);
  if (!item) return;

  if (item.quantity === 1 && change === -1) {
    handleRemove(id);
  } else {
    item.quantity += change;
    emitGlobalUpdate('cart:update-qty', { id, change });
    Haptics.impact({ style: ImpactStyle.Light });
  }
};

const handleRemove = (id) => {
  localItems.value = localItems.value.filter(i => i.id !== id);
  emitGlobalUpdate('cart:remove-item', id);
  Haptics.impact({ style: ImpactStyle.Medium });
};

// MODALNI YOPISH VA MENYUGA QAYTISH
const addMoreItems = async () => {
  await Haptics.impact({ style: ImpactStyle.Light });
  modalController.dismiss(null, 'add-more');
};

const toggleService = () => { 
  isServiceActive.value = !isServiceActive.value; 
  Haptics.impact({ style: ImpactStyle.Light });
};

const dismissModal = () => modalController.dismiss(null, 'cancel');

const handleSaveOrder = async () => {
  if (!isReady.value) return;
  const orderData = { 
    items: localItems.value, 
    final_total: finalTotal.value, 
    staff_id: selectedStaff.value,
    customer_id: selectedCustomer.value,
    service_fee: calculateServiceFee.value,
    discount: calculateDiscountAmount.value
  };
  await Haptics.notification({ type: NotificationType.Success });
  modalController.dismiss(orderData, 'confirm');
};
</script>

<style scoped>
/* Modal ichidagi scroll chiroyli ko'rinishi uchun */
ion-content {
  --background: transparent;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>