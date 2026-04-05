<template>
  <ion-page>
    <Modal 
      v-model="isCartOpen"
      title="Savat"
      icon="fa-solid fa-cart-shopping"
      width="650px"
      @close="handleClose"
    >
      <div class="space-y-4">
        <div class="flex p-1 bg-slate-100 dark:bg-slate-800/50 rounded-[22px] gap-1">
          <button 
            v-for="tab in ['items', 'settings']" 
            :key="tab"
            @click="activeTab = tab"
            :class="[
              'flex-1 py-2.5 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all duration-300',
              activeTab === tab 
                ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' 
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            ]"
          >
            <i :class="[tab === 'items' ? 'fa-solid fa-list-ul' : 'fa-solid fa-gear', 'mr-2']"></i>
            {{ tab === 'items' ? 'Buyurtmalar' : 'Sozlamalar' }}
          </button>
        </div>
        <div v-if="activeTab === 'items'" class="space-y-4 animate-fade-in">
          <div v-if="localItems.length > 0" class="flex items-center justify-between px-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <span>Savat tarkibi</span>
            <Button @click="isCartOpen = false" size="sm" variant="secondary" class="!h-8 !text-[9px] !rounded-xl">
              <i class="fa-solid fa-plus mr-1"></i> Qo'shish
            </Button>
          </div>

          <div v-if="localItems.length > 0" class="space-y-3 max-h-[42vh] overflow-y-auto pr-2 custom-scroll">
            <div v-for="item in localItems" :key="item.id" class="bg-white dark:bg-slate-900 rounded-[28px] p-2 flex gap-4 items-center border border-slate-100 dark:border-white/5 shadow-sm">
              <img :src="item.image" class="w-16 h-16 rounded-[20px] object-cover bg-slate-100 dark:bg-slate-800" />
              <div class="flex-1 min-w-0">
                <div class="flex justify-between">
                  <h4 class="text-sm font-black truncate dark:text-white text-slate-800 uppercase tracking-tight">{{ item.name }}</h4>
                  <button @click="handleRemove(item.id)" class="text-slate-300 hover:text-rose-500 active:scale-75 transition-all"><i class="fa-solid fa-trash-can text-xs"></i></button>
                </div>
                <div class="flex items-center justify-between mt-2">
                  <p class="text-[13px] font-black text-indigo-600">{{ formatPrice(item.price * item.quantity) }} <span class="text-[9px] opacity-40 uppercase">uzs</span></p>
                  <div class="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1 gap-1">
                    <button @click="handleUpdateQty(item.id, -1)" class="w-8 h-8 bg-white dark:bg-slate-700 rounded-lg flex items-center justify-center active:scale-75 transition-all shadow-sm"><i class="fa-solid fa-minus text-[10px]"></i></button>
                    <span class="text-xs font-black w-6 text-center dark:text-white">{{ item.quantity }}</span>
                    <button @click="handleUpdateQty(item.id, 1)" class="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center active:scale-90 transition-all shadow-sm"><i class="fa-solid fa-plus text-[10px]"></i></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="py-20 text-center">
             <i class="fa-solid fa-basket-shopping text-4xl text-slate-200 mb-4 block"></i>
             <p class="text-slate-400 text-xs font-bold uppercase">Savat bo'sh</p>
          </div>
        </div>

     <div v-if="activeTab === 'settings'" class="space-y-6 animate-fade-in">
  <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
    <div class="bg-slate-50 dark:bg-slate-800/40 rounded-[28px] p-3 flex items-center justify-between border border-slate-100 dark:border-white/5">
      <div class="flex items-center gap-2">
        <div :class="['w-10 h-10 rounded-xl flex items-center justify-center transition-all', isServiceActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'bg-slate-200 dark:bg-slate-700 text-slate-400']">
          <i class="fa-solid fa-utensils text-xs"></i>
        </div>
        <div>
          <span class="block text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Xizmat (10%)</span>
          <p class="text-[13px] font-black dark:text-white text-slate-900">{{ isServiceActive ? formatPrice(calculateServiceFee) : "O'chirilgan" }}</p>
        </div>
      </div>
      <div @click="toggleService" :class="['w-11 h-6 rounded-full relative cursor-pointer transition-all', isServiceActive ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600']">
        <div :class="['w-4 h-4 bg-white rounded-full absolute top-1 transition-all', isServiceActive ? 'right-1' : 'left-1']"></div>
      </div>
    </div>

    <div class="bg-slate-50 dark:bg-slate-800/40 rounded-[28px] p-3 border border-slate-100 dark:border-white/5 flex items-center gap-3">
      <div :class="['w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all', discountPercent > 0 ? 'bg-rose-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-400']">
        <i class="fa-solid fa-percent text-xs"></i>
      </div>
      <div class="flex-1">
        <span class="block text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Chegirma (%)</span>
        <input type="number" v-model="discountPercent" class="w-full bg-transparent text-sm font-black outline-none dark:text-white" placeholder="0" />
      </div>
    </div>
  </div>
  <div class="p-1 bg-slate-100 dark:bg-slate-800/50 rounded-[22px] flex gap-1">
    <button 
      @click="orderType = 'table'"
      :class="[
        'flex-1 py-3 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2',
        orderType === 'table' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' : 'text-slate-400'
      ]"
    >
      <i class="fa-solid fa-chair"></i> Stolga
    </button>
    <button 
      @click="orderType = 'takeaway'"
      :class="[
        'flex-1 py-3 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2',
        orderType === 'takeaway' ? 'bg-white dark:bg-slate-700 text-rose-500 shadow-sm' : 'text-slate-400'
      ]"
    >
      <i class="fa-solid fa-bag-shopping"></i> Saboy
    </button>
  </div>

  <div class="grid grid-cols-1 gap-4">
    <transition name="fade-slide">
      <div v-if="orderType === 'table'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select 
          size="small" 
          v-model="selectedTable" 
          label="Stol Tanlang" 
          :options="tableList" 
          searchable 
          placeholder="Stol raqami..." 
          iconPre="fa-solid fa-circle-dot"
        />
        <Select 
          size="small" 
          v-model="selectedCustomer" 
          label="Mijoz (Ixtiyoriy)" 
          :options="customerList" 
          searchable 
          placeholder="Mijoz ismi..." 
        />
      </div>
    </transition>

    <Select 
      size="small" 
      v-model="selectedStaff" 
      label="Mas'ul Ofitsiant" 
      :options="staffList" 
      searchable 
      placeholder="Ofitsiantni tanlang..." 
    />
  </div>

  

  <TextArea placeholder="Masalan: Achchiq bo'lmasin..." label="Buyurtma uchun izoh..."></TextArea>
</div>

      </div>

      <template #footer>
        <div class="w-full space-y-4">
          <div class="grid grid-cols-3 gap-2 px-2 border-b border-slate-100 dark:border-white/5 pb-4">
            <div><p class="text-[9px] font-black text-slate-400 uppercase mb-1">Summa</p><p class="text-[12px] font-bold dark:text-white">{{ formatPrice(currentSubtotal) }}</p></div>
            <div class="text-center"><p class="text-[9px] font-black text-indigo-500 uppercase mb-1">Xizmat</p><p class="text-[12px] font-bold text-indigo-600">+{{ formatPrice(calculateServiceFee) }}</p></div>
            <div class="text-right"><p class="text-[9px] font-black text-rose-500 uppercase mb-1">Chegirma</p><p class="text-[12px] font-bold text-rose-600">-{{ formatPrice(calculateDiscountAmount) }}</p></div>
          </div>
          <div class="flex justify-between items-center bg-indigo-50/50 dark:bg-indigo-500/5 p-4 rounded-2xl">
            <div>
              <p class="text-slate-400 text-[10px] font-black uppercase mb-1">Jami To'lov</p>
              <div class="flex items-baseline gap-1">
                <span class="text-sm font-black text-slate-900 dark:text-white tracking-tighter">{{ formatPrice(finalTotal) }}</span>
                <span class="text-[10px] font-black text-indigo-600 uppercase">uzs</span>
              </div>
            </div>
            <Button @click="handleSaveOrder" :disabled="!isReady" size="sm">
              <span class="text-[11px] font-black uppercase tracking-widest">Tasdiqlash</span>
            </Button>
          </div>
        </div>
      </template>
    </Modal>
  </ion-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { Select, Button, Modal,TextArea } from '../../UI/UI';

const props = defineProps({
  items: { type: Array, default: () => [] },
  staffList: { type: Array, default: () => [{ id: 1, name: 'Umid Shomurodov' }] },
  customerList: { type: Array, default: () => [{ id: 1, name: 'Stol #12' }] }
});

const activeTab = ref('items'); // 'items' yoki 'settings'
const isCartOpen = ref(false);
const localItems = ref([...props.items]);
const selectedStaff = ref(null);
const selectedCustomer = ref(null);
const isServiceActive = ref(true);
const discountPercent = ref(0);

onMounted(async () => {
  setTimeout(() => { isCartOpen.value = true; }, 250);
  await Haptics.impact({ style: ImpactStyle.Heavy });
});

const currentSubtotal = computed(() => localItems.value.reduce((sum, i) => sum + (i.price * i.quantity), 0));
const calculateServiceFee = computed(() => isServiceActive.value ? currentSubtotal.value * 0.1 : 0);
const calculateDiscountAmount = computed(() => currentSubtotal.value * (discountPercent.value / 100));
const finalTotal = computed(() => (currentSubtotal.value + calculateServiceFee.value) - calculateDiscountAmount.value);
// const isReady = computed(() => localItems.value.length > 0 && selectedStaff.value !== null);

const formatPrice = (val) => Math.round(val || 0).toLocaleString();

// Emitlarni e'lon qilish
const emit = defineEmits(['updateQty', 'removeItem', 'close']);

const handleUpdateQty = async (id, change) => {
  // 1. Parentga xabar berish (Asosiy savatni yangilash uchun)
  emit('updateQty', { id, change });

  // 2. Local vizualizatsiyani yangilash (Modal ochiqligida darhol ko'rinishi uchun)
  const item = localItems.value.find(i => i.id === id);
  if (item) {
    if (item.quantity === 1 && change === -1) {
      handleRemove(id);
    } else {
      item.quantity += change;
    }
    await Haptics.impact({ style: ImpactStyle.Light });
  }
};

const handleRemove = async (id) => {
  // Parentga o'chirishni buyurish
  emit('removeItem', id);
  
  // Local ro'yxatdan o'chirish
  localItems.value = localItems.value.filter(i => i.id !== id);
  await Haptics.impact({ style: ImpactStyle.Medium });
};
const toggleService = async () => { 
  isServiceActive.value = !isServiceActive.value; 
  await Haptics.impact({ style: ImpactStyle.Light });
};

const handleSaveOrder = async () => {
  if (!isReady.value) return;
  await Haptics.notification({ type: NotificationType.Success });
  isCartOpen.value = false;
};

const handleClose = () => {};
const orderType = ref('table'); // 'table' yoki 'takeaway'
const selectedTable = ref(null);

// Stollar ro'yxati (Buni API dan olishingiz mumkin)
const tableList = ref([
  { id: 1, name: 'Stol #1' },
  { id: 2, name: 'Stol #2' },
  { id: 3, name: 'Stol #3' },
  { id: 4, name: 'VIP xona' },
]);

// Validatsiya computed qismini yangilaymiz
const isReady = computed(() => {
  const hasItems = localItems.value.length > 0;
  const hasStaff = selectedStaff.value !== null;
  // Agar stolga bo'lsa, stol tanlanishi shart, saboy bo'lsa shart emas
  const hasTableIfRequired = orderType.value === 'table' ? selectedTable.value !== null : true;
  
  return hasItems && hasStaff && hasTableIfRequired;
});
</script>

<style scoped>
.custom-scroll::-webkit-scrollbar { width: 4px; }
.custom-scroll::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.2); border-radius: 10px; }

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}

input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
</style>