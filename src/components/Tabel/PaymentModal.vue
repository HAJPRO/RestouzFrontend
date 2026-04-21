<script setup>
import { ref, computed, watch } from "vue";
import { storeToRefs } from "pinia";
import { TabelStore } from "../../stores/index.store"; 
import { Button, Modal, Input, Select } from "../../UI/UI"; 

const store_tabel = TabelStore();
const { isPaymentModal, model_payment, activeTable } = storeToRefs(store_tabel);

const activeTab = ref('single'); 
const selectedMethod = ref('cash');

const formatPrice = (v) => new Intl.NumberFormat('uz-UZ').format(v || 0) + " so'm";
const cart = computed(() => activeTable.value?.cartId || {});
const grandTotal = computed(() => cart.value.finalTotal || 0);

// QOLDIQNI HISOBLASH: Kalit so'zlar model_payment bilan bir xil bo'lishi shart
const totalPaid = computed(() => {
  return (Number(model_payment.value.cash) || 0) + 
         (Number(model_payment.value.card) || 0) + 
         (Number(model_payment.value.terminal) || 0) + 
         (Number(model_payment.value.debt) || 0);
});

const remaining = computed(() => grandTotal.value - totalPaid.value);

// Tezkor rejimda avtomatik to'ldirish
watch([activeTab, selectedMethod, isPaymentModal], () => {
  if (activeTab.value === 'single' && isPaymentModal.value) {
    // Boshqa barcha usullarni nolga tushirib, faqat tanlanganini grandTotal qiladi
    ['cash', 'card', 'terminal', 'debt'].forEach(m => {
      model_payment.value[m] = (m === selectedMethod.value) ? grandTotal.value : 0;
    });
  }
}, { immediate: true });

// Yakunlashga tayyorlik tekshiruvi
const isReady = computed(() => {
  const isAmountMet = remaining.value <= 0;
  const isCustomerSelected = model_payment.value.debt > 0 ? !!model_payment.value.customerId : true;
  return isAmountMet && isCustomerSelected;
});

const onFinish = async () => {
  if (isReady.value) await store_tabel.SubmitPayment();
};
</script>

<template>
  <Modal
    v-model="isPaymentModal"
    size="md"
    no-padding
    :title="`Stol №${activeTable?.number}`"
  >
    <div class="bg-slate-100 dark:bg-slate-950 rounded-xl p-2  space-y-2">
      
      <div class="flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50 p-2 rounded-2xl border border-slate-100 dark:border-slate-800">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700 shadow-sm">
            <i class="fa-solid fa-bell-concierge text-sm text-slate-500"></i>
          </div>
          <div>
            <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Ofitsiant</p>
            <p class="text-[13px] font-bold text-slate-700 dark:text-slate-200">
              {{ cart?.staffId?.firstname || 'Tayinlanmagan' }}  {{ cart?.staffId?.lastname || 'Tayinlanmagan' }}
            </p>
          </div>
        </div>

        <div v-if="cart?.customerId || model_payment.customerId" class="flex items-center gap-3 text-right">
          <div class="flex flex-col items-end">
            <p class="text-[9px] font-black text-indigo-500 uppercase tracking-widest leading-none mb-1">Mijoz</p>
            <p class="text-[13px] font-bold text-slate-800 dark:text-white truncate max-w-[120px]">
              {{ cart?.customerId?.name || 'Doimiy mijoz' }}
            </p>
            <div class="mt-1 flex items-center gap-1.5 bg-white dark:bg-slate-800 px-2 py-0.5 rounded-full border border-slate-100 dark:border-slate-700 shadow-sm font-mono">
              <span :class="[(cart?.customerId?.balance < 0) ? 'text-rose-500' : 'text-emerald-500', 'text-[10px] font-black']">
                {{ formatPrice(cart?.customerId?.balance || 0) }}
              </span>
            </div>
          </div>
          <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-md">
            <i class="fa-solid fa-user text-white text-sm"></i>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-3 gap-6 py-2 px-2 border-b border-slate-50 dark:border-slate-900 pb-6">
        <div>
          <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Taomlar</p>
          <p class="text-sm font-bold text-slate-700 dark:text-slate-300 font-mono">{{ formatPrice(cart.subtotal) }}</p>
        </div>
        <div class="flex flex-col items-center border-x border-slate-100 dark:border-slate-800">
          <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Xizmat ({{ cart.serviceFeePercent }}%)</p>
          <p class="text-sm font-bold text-indigo-500 font-mono">+{{ formatPrice(cart.serviceFeeAmount) }}</p>
        </div>
        <div class="flex flex-col items-end">
          <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Chegirma</p>
          <p class="text-sm font-bold text-rose-500 font-mono">-{{ formatPrice(cart.discountAmount || 0) }}</p>
        </div>
      </div>

      <div class="bg-slate-900 dark:bg-indigo-600 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <i class="fa-solid fa-receipt absolute -right-4 -bottom-4 text-white/10 text-8xl rotate-12"></i>
        <div class="relative z-10">
          <p class="text-[10px] font-black text-white/60 uppercase tracking-[3px] mb-2">Jami To'lov</p>
          <h2 class="text-4xl font-black text-white font-mono tracking-tighter">
            {{ formatPrice(grandTotal) }}
          </h2>
        </div>
      </div>

      <div class="space-y-6">
        <div class="flex p-1.5 bg-slate-100 dark:bg-slate-900/50 rounded-2xl shadow-inner border border-slate-200/50 dark:border-slate-800">
          <button 
            v-for="t in [{id:'single', n:'Tezkor', i:'fa-bolt'}, {id:'mixed', n:'Aralash', i:'fa-layer-group'}]" :key="t.id"
            @click="activeTab = t.id"
            class="flex-1 flex items-center justify-center gap-2 py-2.5 text-[10px] font-black uppercase tracking-[1px] rounded-xl transition-all duration-300"
            :class="activeTab === t.id 
              ? 'bg-white dark:bg-slate-800 shadow-md text-indigo-600 dark:text-indigo-400' 
              : 'text-slate-400 hover:text-slate-600'"
          >
            <i class="fa-solid" :class="t.i"></i> {{ t.n }}
          </button>
        </div>

        <div v-if="activeTab === 'single'" class="grid grid-cols-4 gap-3 fade-in">
          <button 
            v-for="(val, key) in {cash: {l:'Naqd', i:'fa-money-bill-1'}, card: {l:'Karta', i:'fa-credit-card'}, terminal: {l:'Term', i:'fa-print'}, debt: {l:'Qarz', i:'fa-handshake'}}" :key="key"
            @click="selectedMethod = key"
            class="relative flex flex-col items-center gap-3 py-4 rounded-2xl transition-all duration-200 border"
            :class="selectedMethod === key 
              ? 'bg-indigo-50/50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400 ring-2 ring-indigo-500/10' 
              : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-400'"
          >
            <div class="w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 shadow-sm"
                 :class="selectedMethod === key ? 'bg-indigo-500 text-white shadow-indigo-200' : 'bg-slate-50 dark:bg-slate-800'">
              <i class="fa-solid text-sm" :class="val.i"></i>
            </div>
            <span class="text-[9px] font-black uppercase tracking-widest">{{ val.l }}</span>
          </button>
        </div>

        <div v-if="activeTab === 'mixed'" class="grid grid-cols-2 gap-4 fade-in">
          <div v-for="f in [{k:'cash', l:'Naqd Pul', i:'fa-wallet'}, {k:'card', l:'Plastik Karta', i:'fa-credit-card'}, {k:'terminal', l:'Terminal', i:'fa-print'}, {k:'debt', l:'Nasiya', i:'fa-clock'}]" 
               :key="f.k" 
               class="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-transparent focus-within:border-indigo-500/30 transition-all">
            <div class="flex items-center gap-2 mb-1.5 text-slate-400">
              <i class="fa-solid text-[9px]" :class="f.i"></i>
              <label class="text-[9px] font-black uppercase tracking-widest">{{ f.l }}</label>
            </div>
            <Input 
              v-model="model_payment[f.k]" 
              type="number" 
              size="small"
              placeholder="0.00"
              class="w-full bg-transparent border-none text-base font-mono font-bold text-slate-700 dark:text-slate-200 p-0" 
              @focus="$event.target.select()" 
              clearable
              suffix="sum"
            />
          </div>
        </div>

       
      </div>
    </div>

    <template #footer>
      <div class="bg-transparent backdrop-blur-md  flex items-center justify-between w-full">
       <div class="flex items-center gap-5 select-none">
  <div class="relative flex items-center justify-center">
    <div v-if="remaining <= 0" class="absolute inset-0 bg-emerald-400/20 blur-xl rounded-full animate-pulse"></div>
    
    <div class="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 border"
         :class="remaining <= 0 
            ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20 rotate-[360deg]' 
            : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-400'">
      <i class="fa-solid text-sm transition-all" 
         :class="remaining <= 0 ? 'fa-check' : 'fa-receipt'"></i>
    </div>
  </div>

  <div class="flex flex-col gap-0.5">
    <span class="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[2px] leading-none">
      To'lov holati
    </span>
    
    <div class="flex items-baseline gap-1.5">
      <span class="text-lg font-black tracking-tighter transition-colors duration-500" 
            :class="remaining <= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'">
        {{ remaining <= 0 ? 'Yopildi' : formatPrice(remaining) }}
      </span>
      
      <span v-if="remaining > 0" class="flex h-1.5 w-1.5 rounded-full bg-rose-500 animate-bounce"></span>
    </div>
  </div>
</div>

        <div class="flex items-center gap-3">
          <Button size="sm" variant="danger" leftIcon="fas fa-xmark" @click="isPaymentModal = false" class="!rounded-xl !px-6">Yopish</Button>
          <Button 
            size="sm"
            @click="onFinish"
            :variant="isReady ? 'primary' : 'disabled'"
            leftIcon="fas fa-check"
            :class="isReady ? 'shadow-xl shadow-indigo-200 scale-105' : 'opacity-40 grayscale pointer-events-none'"
          >
            <span class="relative z-10 flex items-center gap-2">
              {{ isReady ? `To'lov` : 'To\'ldiring' }}
              <i v-if="isReady" class="fa-solid fa-arrow-right animate-pulse"></i>
            </span>
            <div v-if="isReady" class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer"></div>
          </Button>
        </div>
      </div>
    </template>
  </Modal>
</template>

<style scoped>
input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
input[type=number] { -moz-appearance: textfield; }

:deep(.modal-content) {
  border: none !important;
  border-radius: 32px !important;
}

.fade-in { animation: fadeIn 0.3s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

@keyframes shimmer { 100% { transform: translateX(100%); } }
.animate-shimmer { animation: shimmer 2.5s infinite; }
</style>