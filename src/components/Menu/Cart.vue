<template>
  <Modal 
        v-model="isCartOpen"
        title="Buyurtma Savati"
        icon="fa-solid fa-cart-shopping"
        :subtitle="`Stol: #12 • ${localItems.length} ta mahsulot`"
        width="650px"
        @close="handleClose"
      >
        <div class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select size="small" v-model="selectedStaff" label="Mas'ul Ofitsiant" :options="staffList" searchable placeholder="Tanlang..." />
            <Select size="small" v-model="selectedCustomer" label="Mijoz" :options="customerList" searchable placeholder="Tanlang..." />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div class="bg-slate-50 dark:bg-slate-800/40 rounded-[28px] p-4 flex items-center justify-between border border-slate-100 dark:border-white/5 shadow-sm">
              <div class="flex items-center gap-3">
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

            <div class="bg-slate-50 dark:bg-slate-800/40 rounded-[28px] p-4 border border-slate-100 dark:border-white/5 flex items-center gap-3 shadow-sm">
              <div :class="['w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all', discountPercent > 0 ? 'bg-rose-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-400']">
                <i class="fa-solid fa-percent text-xs"></i>
              </div>
              <div class="flex-1">
                <span class="block text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Chegirma (%)</span>
                <input type="number" v-model="discountPercent" class="w-full bg-transparent text-sm font-black outline-none dark:text-white" placeholder="0" />
              </div>
            </div>
          </div>

          <div class="space-y-3">
            <div v-if="localItems.length > 0" class="flex items-center justify-between px-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <span>Savat tarkibi</span>
              <Button @click="isCartOpen = false" size="sm" variant="secondary" class="!h-8 !text-[9px] !rounded-xl">
                <i class="fa-solid fa-plus mr-1"></i> Qo'shish
              </Button>
            </div>

            <div v-if="localItems.length > 0" class="space-y-3 max-h-[38vh] overflow-y-auto pr-2 custom-scroll">
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
          </div>
        </div>

        <template #footer>
          <div class="w-full space-y-4">
            <div class="grid grid-cols-3 gap-2 px-2 border-b border-slate-100 dark:border-white/5 pb-4">
              <div><p class="text-[9px] font-black text-slate-400 uppercase mb-1">Summa</p><p class="text-[12px] font-bold dark:text-white">{{ formatPrice(currentSubtotal) }}</p></div>
              <div class="text-center"><p class="text-[9px] font-black text-indigo-500 uppercase mb-1">Xizmat (10%)</p><p class="text-[12px] font-bold text-indigo-600">+{{ formatPrice(calculateServiceFee) }}</p></div>
              <div class="text-right"><p class="text-[9px] font-black text-rose-500 uppercase mb-1">Chegirma</p><p class="text-[12px] font-bold text-rose-600">-{{ formatPrice(calculateDiscountAmount) }}</p></div>
            </div>
            <div class="flex justify-between items-center bg-indigo-50/50 dark:bg-indigo-500/5 p-4 rounded-[2rem]">
              <div>
                <p class="text-slate-400 text-[10px] font-black uppercase mb-1">Jami To'lov</p>
                <div class="flex items-baseline gap-1">
                  <span class="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{{ formatPrice(finalTotal) }}</span>
                  <span class="text-[10px] font-black text-indigo-600 uppercase">uzs</span>
                </div>
              </div>
              <Button @click="handleSaveOrder" :disabled="!isReady" class="h-14 px-10 shadow-xl shadow-indigo-600/30 active:scale-95 transition-all !rounded-[22px]">
                <span class="text-[11px] font-black uppercase tracking-widest">Tasdiqlash</span>
              </Button>
            </div>
          </div>
        </template>
      </Modal>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { Select, Button, Modal } from '../../UI/UI';

const props = defineProps({
  items: { type: Array, default: () => [] },
  staffList: { type: Array, default: () => [{ id: 1, name: 'Umid Shomurodov' }] },
  customerList: { type: Array, default: () => [{ id: 1, name: 'Stol #12' }] }
});

const isPageReady = ref(false); // Sahifa tayyorligi
const isCartOpen = ref(false); // Modal holati
const localItems = ref([...props.items]);
const selectedStaff = ref(null);
const selectedCustomer = ref(null);
const isServiceActive = ref(true);
const discountPercent = ref(0);

onMounted(async () => {
  // Sahifadagi u "oq blok" ko'rinmasligi uchun delay bilan ochamiz
  setTimeout(() => {
    isPageReady.value = true;
    setTimeout(() => {
      isCartOpen.value = true;
    }, 50);
  }, 200);
  await Haptics.impact({ style: ImpactStyle.Heavy });
});

// HISOB-KITOB
const currentSubtotal = computed(() => localItems.value.reduce((sum, i) => sum + (i.price * i.quantity), 0));
const calculateServiceFee = computed(() => isServiceActive.value ? currentSubtotal.value * 0.1 : 0);
const calculateDiscountAmount = computed(() => currentSubtotal.value * (discountPercent.value / 100));
const finalTotal = computed(() => (currentSubtotal.value + calculateServiceFee.value) - calculateDiscountAmount.value);
const isReady = computed(() => localItems.value.length > 0 && selectedStaff.value !== null);

const formatPrice = (val) => Math.round(val || 0).toLocaleString();

const handleUpdateQty = async (id, change) => {
  const item = localItems.value.find(i => i.id === id);
  if (item) {
    if (item.quantity === 1 && change === -1) handleRemove(id);
    else item.quantity += change;
    await Haptics.impact({ style: ImpactStyle.Light });
  }
};

const handleRemove = async (id) => {
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
  console.log("Confirmed!");
  isCartOpen.value = false;
};

const handleClose = () => {
  // Modal yopilganda qilinadigan ishlar
};
</script>

<style scoped>
.custom-scroll::-webkit-scrollbar { width: 4px; }
.custom-scroll::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.2); border-radius: 10px; }
.ion-page { --background: transparent; }
input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }

@keyframes bounce-in {
  0% { transform: scale(0.3); opacity: 0; }
  70% { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
}
.animate-bounce-in { animation: bounce-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
</style>