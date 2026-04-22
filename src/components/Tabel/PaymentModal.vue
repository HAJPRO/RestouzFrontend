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
      
     <div class="grid grid-cols-2 gap-2 p-1.5 bg-slate-50/80 dark:bg-slate-900/50 rounded-[24px] border border-slate-100 dark:border-white/5 shadow-sm">
  
  <div class="flex items-center gap-2.5 p-2 bg-white dark:bg-slate-800/40 rounded-[20px] border border-white dark:border-white/5 shadow-sm">
    <div class="relative shrink-0">
      <div class="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center border border-indigo-100/50 dark:border-indigo-500/20">
        <i class="fa-solid fa-bell-concierge text-[13px] text-indigo-500"></i>
      </div>
      <div class="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
    </div>
    
    <div class="flex flex-col min-w-0">
      <span class="text-[8px] font-black text-slate-400 uppercase tracking-wider leading-none mb-1">Xizmat</span>
      <p class="text-[11px] font-bold text-slate-700 dark:text-slate-200 truncate leading-tight">
        {{ cart?.staffId?.firstname || 'Tayinlanmagan' }}
      </p>
    </div>
  </div>

  <div v-if="cart?.customerId || model_payment.customerId" 
       class="flex items-center justify-between p-2 bg-white dark:bg-slate-800/40 rounded-[20px] border border-white dark:border-white/5 shadow-sm">
    
    <div class="flex flex-col min-w-0">
      <span class="text-[8px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-wider leading-none mb-0.5">Mijoz</span>
      <p class="text-[11px] font-bold text-slate-800 dark:text-white truncate leading-tight mb-1">
        {{ cart?.customerId?.name || 'Doimiy mijoz' }}
      </p>
      
      <div class="flex items-center">
        <span :class="[
          'px-1.5 py-0.5 rounded-md text-[9px] font-black font-mono',
          (cart?.customerId?.balance < 0) 
            ? 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400' 
            : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
        ]">
          {{ formatPrice(cart?.customerId?.balance || 0) }}
        </span>
      </div>
    </div>

    <div class="shrink-0 ml-2">
      <div class="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center border border-white dark:border-white/5 shadow-inner">
        <i class="fa-solid fa-user text-[13px] text-slate-500 dark:text-slate-400"></i>
      </div>
    </div>
  </div>
</div>
    <div class="grid grid-cols-3 gap-2 py-4 px-3 bg-slate-50/50 dark:bg-slate-900/40 rounded-3xl border border-slate-100 dark:border-white/5 shadow-sm">
  <div class="flex flex-col gap-0.5">
    <span class="text-[8px] font-black text-slate-400 uppercase tracking-[0.1em]">Taomlar</span>
    <div class="flex items-baseline gap-0.5">
      <span class="text-xs font-black text-slate-800 dark:text-slate-200 tracking-tighter">
        {{ formatPrice(cart.subtotal).split(' ')[0] }}
      </span>
      <span class="text-[8px] font-bold text-slate-400 uppercase">uzs</span>
    </div>
  </div>

  <div class="flex flex-col gap-0.5 items-center border-x border-slate-200/60 dark:border-white/10">
    <span class="text-[8px] font-black text-slate-400 uppercase tracking-[0.1em]">
      Xizmat <span class="text-indigo-500">{{ cart.serviceFeePercent }}%</span>
    </span>
    <div class="flex items-baseline gap-0.5">
      <span class="text-xs font-black text-indigo-600 dark:text-indigo-400 tracking-tighter">
        +{{ formatPrice(cart.serviceFeeAmount).split(' ')[0] }}
      </span>
      <span class="text-[8px] font-bold text-indigo-400/80 uppercase">uzs</span>
    </div>
  </div>

  <div class="flex flex-col gap-0.5 items-end">
    <span class="text-[8px] font-black text-slate-400 uppercase tracking-[0.1em]">
      Chegirma <span class="text-rose-500">{{ cart.discountPercent || 0 }}%</span>
    </span>
    <div class="flex items-baseline gap-0.5">
      <span class="text-xs font-black text-rose-600 dark:text-rose-400 tracking-tighter">
        -{{ formatPrice(cart.discountAmount || 0).split(' ')[0] }}
      </span>
      <span class="text-[8px] font-bold text-rose-400/80 uppercase">uzs</span>
    </div>
  </div>
</div>

    <div class="relative overflow-hidden bg-indigo-600 dark:bg-indigo-500 rounded-[32px] p-5 shadow-[0_20px_50px_rgba(79,70,229,0.3)] group">
  <div class="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-700"></div>
  <div class="absolute -left-10 -bottom-10 w-32 h-32 bg-indigo-400/20 rounded-full blur-3xl"></div>
  
  <i class="fa-solid fa- receipt absolute right-4 bottom-4 text-white/10 text-6xl rotate-12 group-hover:rotate-0 transition-transform duration-500"></i>

  <div class="relative z-10 flex flex-col gap-1">
    <div class="flex items-center gap-2">
      <div class="w-1.5 h-1.5 bg-indigo-200 rounded-full animate-pulse"></div>
      <p class="text-[10px] font-black text-indigo-100/80 uppercase tracking-[0.2em]">Jami hisob</p>
    </div>
    
    <div class="flex items-baseline gap-1.5">
      <h2 class="text-4xl font-black text-white tracking-tighter drop-shadow-sm">
        {{ formatPrice(grandTotal).split(' ')[0] }}
      </h2>
      <span class="text-sm font-bold text-indigo-100 uppercase opacity-80 tracking-widest">sum</span>
    </div>
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

  <div v-if="activeTab === 'mixed'" class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 fade-in">
  <div v-for="f in [
    {k:'cash', l:'Naqd Pul', i:'fa-wallet'}, 
    {k:'card', l:'Plastik Karta', i:'fa-credit-card'}, 
    {k:'terminal', l:'Terminal', i:'fa-print'}, 
    {k:'debt', l:'Nasiya', i:'fa-clock'}
  ]" 
    :key="f.k" 
    class="relative p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 focus-within:border-indigo-500/50 focus-within:bg-white dark:focus-within:bg-slate-900 transition-all duration-200 shadow-sm"
  >
    <div class="flex items-center gap-2 mb-1 text-slate-500 dark:text-slate-400">
      <i class="fa-solid text-[10px]" :class="f.i"></i>
      <label class="text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">
        {{ f.l }}
      </label>
    </div>

    <div class="relative flex items-center">
      <Input 
        v-model="model_payment[f.k]" 
        type="number" 
        size="small"
        placeholder="0.00"
        class="w-full bg-transparent border-none text-lg font-mono font-bold text-slate-800 dark:text-slate-100 p-0 shadow-none focus:ring-0" 
        @focus="$event.target.select()" 
        clearable
        suffix="sum"
      />
    </div>
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
    <span class="text-[8px] font-black text-slate-400 dark:text-slate-500  tracking-[2px] leading-none">
     Qoldiq
    </span>
    
    <div class="flex items-baseline gap-1.5">
      <span class="text-sm font-black tracking-tighter transition-colors duration-500" 
            :class="remaining <= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'">
        {{ remaining <= 0 ? '0' : formatPrice(remaining) }}
      </span>
      
      <span v-if="remaining > 0" class="flex h-1.5 w-1.5 rounded-full bg-rose-500 animate-bounce"></span>
    </div>
  </div>
</div>

        <div class="flex items-center gap-3">
          <!-- <Button size="sm" variant="danger" leftIcon="fas fa-xmark" @click="isPaymentModal = false" class="!rounded-xl !px-6">Yopish</Button> -->
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