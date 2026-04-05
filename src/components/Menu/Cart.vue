<template>
  <div class="ion-page">
    <ion-header class="ion-no-border">
      <div class="px-6 py-4 flex items-center justify-between bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-white/5">
        <div>
          <h2 class="text-xl font-black tracking-tight flex items-center gap-2">
            <span class="w-2 h-6 bg-indigo-600 rounded-full"></span>
            Buyurtma savati
          </h2>
        </div>
        <button @click="dismissModal" class="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center active:scale-90 transition-all">
          <ion-icon :icon="closeOutline" class="text-xl" />
        </button>
      </div>
    </ion-header>

    <ion-content class="ion-padding" :scroll-y="true">
      <div class="max-w-full rounded-lg mx-auto pb-32 space-y-6 px-2">
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select 
            size="small"
            v-model="selectedStaff" 
            label="Mas'ul Ofitsiant" 
            :options="staffList" 
            searchable 
            placeholder="Tanlang..." 
          />
          <Select 
            size="small"
            v-model="selectedCustomer" 
            label="Mijoz (Ixtiyoriy)" 
            :options="customerList" 
            searchable 
            placeholder="Mehmon" 
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div class="bg-white dark:bg-slate-900 rounded-[28px] p-5 flex items-center justify-between border border-slate-100 dark:border-white/5 shadow-sm transition-all" :class="{'ring-2 ring-indigo-500/20 bg-indigo-50/10': isServiceActive}">
            <div class="flex items-center gap-3">
              <div :class="['w-10 h-10 rounded-xl flex items-center justify-center transition-all', isServiceActive ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400']">
                <ion-icon :icon="restaurantOutline" />
              </div>
              <div>
                <span class="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Xizmat (10%)</span>
                <p class="text-[13px] font-black">{{ isServiceActive ? formatPrice(calculateServiceFee) + ' uzs' : `O'chirilgan` }}</p>
              </div>
            </div>
            <div @click="toggleService" :class="['w-12 h-6 rounded-full transition-all relative cursor-pointer', isServiceActive ? 'bg-indigo-600 shadow-lg shadow-indigo-500/30' : 'bg-slate-200 dark:bg-slate-800']">
              <div :class="['w-4 h-4 bg-white rounded-full absolute top-1 shadow-sm transition-all duration-300', isServiceActive ? 'right-1' : 'left-1']"></div>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-900 rounded-[28px] p-5 border border-slate-100 dark:border-white/5 shadow-sm transition-all" :class="{'ring-2 ring-red-500/20': discountPercent > 0}">
            <div class="flex items-center gap-3 mb-2">
              <div :class="['w-10 h-10 rounded-xl flex items-center justify-center transition-all', discountPercent > 0 ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-400']">
                <ion-icon :icon="giftOutline" />
              </div>
              <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Chegirma (%)</span>
            </div>
            <div class="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 rounded-xl px-3 py-1">
              <input type="number" v-model="discountPercent" min="0" max="100" class="w-full bg-transparent border-none py-1.5 text-sm font-black outline-none" placeholder="0" />
              <span class="text-xs font-black text-slate-400">%</span>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-slate-900 rounded-[32px] p-5 border border-slate-100 dark:border-white/5 shadow-sm">
          <div class="flex p-1.5 bg-slate-100 dark:bg-slate-800/50 rounded-[24px] mb-4">
            <button @click="serviceType = 'table'" :class="['flex-1 py-3 rounded-[20px] text-[11px] font-black uppercase transition-all flex items-center justify-center gap-2', serviceType === 'table' ? 'bg-white dark:bg-slate-700 shadow-md text-indigo-600' : 'text-slate-400']">
              <ion-icon :icon="appsOutline" /> Stolga
            </button>
            <button @click="handleSaboy" :class="['flex-1 py-3 rounded-[20px] text-[11px] font-black uppercase transition-all flex items-center justify-center gap-2', serviceType === 'takeaway' ? 'bg-white dark:bg-slate-700 shadow-md text-orange-500' : 'text-slate-400']">
              <ion-icon :icon="bagHandleOutline" /> Saboy
            </button>
          </div>
          
          <div v-if="serviceType === 'table'" class="grid grid-cols-4 sm:grid-cols-8 gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <button v-for="t in 16" :key="t" @click="selectedTable = t" :class="['h-11 rounded-2xl border-2 font-black text-xs transition-all relative', selectedTable === t ? 'border-indigo-600 bg-indigo-600 text-white shadow-lg' : 'border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-slate-400']">
              {{ t }}
              <div v-if="selectedTable === t" class="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-full shadow-sm"></div>
            </button>
          </div>
        </div>

        <div class="space-y-3">
          <div class="flex items-center justify-between px-2">
            <span class="text-[10px] font-black text-slate-400 uppercase tracking-[2px]">Savat tarkibi ({{ items.length }})</span>
            <button @click="dismissModal" class="text-[11px] font-black text-indigo-600">+ TAOM QO'SHISH</button>
          </div>

          <div v-for="item in items" :key="item.id" class="group bg-white dark:bg-slate-900 rounded-[28px] p-3 flex gap-4 items-center border border-slate-100 dark:border-white/5 shadow-sm transition-all hover:shadow-md">
            <img :src="item.image" class="w-16 h-16 rounded-[20px] object-cover shadow-sm group-hover:scale-105 transition-transform duration-500" />
            <div class="flex-1 min-w-0">
              <div class="flex justify-between items-start">
                <h4 class="text-sm font-black truncate text-slate-800 dark:text-white capitalize leading-tight">{{ item.name }}</h4>
                <button @click="updateQty(item.id, -item.quantity)" class="text-slate-300 hover:text-red-500 transition-colors p-1"><ion-icon :icon="trashOutline" /></button>
              </div>
              <div class="flex items-center justify-between mt-3">
                <p class="text-[13px] font-black text-indigo-600 dark:text-indigo-400">{{ formatPrice(item.price * item.quantity) }} <small class="text-[10px]">UZS</small></p>
                <div class="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1 gap-1 border border-slate-200 dark:border-white/5">
                  <button @click="updateQty(item.id, -1)" class="w-8 h-8 bg-white dark:bg-slate-700 rounded-lg flex items-center justify-center shadow-sm active:scale-90 transition-all text-slate-600 dark:text-white"><ion-icon :icon="removeOutline" /></button>
                  <span class="text-xs font-black w-7 text-center">{{ item.quantity }}</span>
                  <button @click="updateQty(item.id, 1)" class="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center shadow-sm active:scale-90 transition-all"><ion-icon :icon="addOutline" /></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ion-content>

    <ion-footer class="ion-no-border bg-white dark:bg-slate-950 p-6 pb-safe-area border-t border-slate-100 dark:border-white/5 shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
      <div class="max-w-2xl mx-auto space-y-4">
        <div class="space-y-2 px-2 border-b border-slate-100 dark:border-white/5 pb-4">
          <div class="flex justify-between text-[11px] font-bold text-slate-400">
            <span>Mahsulotlar summasi:</span>
            <span>{{ formatPrice(total) }} uzs</span>
          </div>
          <div v-if="isServiceActive" class="flex justify-between text-[11px] font-bold text-indigo-500">
            <span>Xizmat haqi (10%):</span>
            <span>+{{ formatPrice(calculateServiceFee) }} uzs</span>
          </div>
          <div v-if="discountPercent > 0" class="flex justify-between text-[11px] font-bold text-red-500">
            <span>Chegirma ({{ discountPercent }}%):</span>
            <span>-{{ formatPrice(calculateDiscountAmount) }} uzs</span>
          </div>
        </div>

        <div class="flex justify-between items-center px-2">
          <div>
            <p class="text-slate-400 text-[10px] font-black uppercase tracking-[3px]">Jami To'lov</p>
            <div class="flex items-baseline gap-1 mt-1">
              <p class="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{{ formatPrice(finalTotal) }}</p>
              <small class="text-xs font-black text-slate-400 uppercase">UZS</small>
            </div>
          </div>
          
          <div v-if="!isReady" class="text-right">
            <span class="inline-flex items-center gap-1.5 text-[9px] font-black bg-amber-50 dark:bg-amber-500/10 text-amber-600 px-3 py-1.5 rounded-full uppercase tracking-wider border border-amber-200/50">
              <ion-icon :icon="alertCircleOutline" class="text-xs" />
              To'ldirilmagan
            </span>
          </div>
        </div>

        <Button @click="handleSaveOrder" :disabled="!isReady" size="sm" class="w-full">
          <span v-if="isReady">Tasdiqlash</span>
          <span v-else class="opacity-50">Ma'lumotlarni to'ldiring</span>
        </Button>
      </div>
    </ion-footer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { 
  modalController, IonHeader, IonContent, IonFooter, IonIcon 
} from '@ionic/vue';
import { 
  closeOutline, addOutline, removeOutline, trashOutline, 
  restaurantOutline, bagHandleOutline, giftOutline, appsOutline,
  alertCircleOutline 
} from 'ionicons/icons';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { Select, Button } from '../../UI/UI';

const props = defineProps({
  items: { type: Array, default: () => [] },
  total: { type: Number, default: 0 },
  staffList: { type: Array, default: () => [] },
  customerList: { type: Array, default: () => [] }
});

const emit = defineEmits(['update-qty']);

// State
const serviceType = ref('table');
const selectedTable = ref(null);
const selectedStaff = ref(null);
const selectedCustomer = ref(null);
const isServiceActive = ref(true);
const discountPercent = ref(0);

// Computed Calculations
const calculateServiceFee = computed(() => isServiceActive.value ? props.total * 0.1 : 0);
const calculateDiscountAmount = computed(() => props.total * (discountPercent.value / 100));
const finalTotal = computed(() => props.total + calculateServiceFee.value - calculateDiscountAmount.value);

const isReady = computed(() => {
  return props.items.length > 0 && 
         selectedStaff.value !== null && 
         (serviceType.value === 'table' ? selectedTable.value !== null : true);
});

// Utility
const formatPrice = (val) => val?.toLocaleString() || 0;

// Actions
const toggleService = () => {
  isServiceActive.value = !isServiceActive.value;
  Haptics.impact({ style: ImpactStyle.Light });
};

const handleSaboy = () => {
  serviceType.value = 'takeaway';
  selectedTable.value = 'Saboy';
  Haptics.impact({ style: ImpactStyle.Medium });
};

const updateQty = (id, change) => {
  emit('update-qty', { id, change });
  Haptics.impact({ style: ImpactStyle.Light });
};

const dismissModal = () => modalController.dismiss(null, 'cancel');

const handleSaveOrder = async () => {
  if (!isReady.value) return;

  const orderData = {
    staff_id: selectedStaff.value,
    customer_id: selectedCustomer.value,
    type: serviceType.value,
    table: selectedTable.value,
    items: props.items,
    subtotal: props.total,
    service_fee: calculateServiceFee.value,
    discount_amount: calculateDiscountAmount.value,
    final_total: finalTotal.value,
    timestamp: new Date().toISOString()
  };

  await Haptics.notification({ type: NotificationType.Success });
  modalController.dismiss(orderData, 'confirm');
};
</script>

<style scoped>
/* Input reset */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.pb-safe-area {
  padding-bottom: calc(env(safe-area-inset-bottom) + 1.5rem);
}

.ion-page {
  background: white;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .ion-page {
    background: #0f172a; /* slate-900 */
  }
}
</style>