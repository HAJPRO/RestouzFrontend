<script setup>
import { ref, computed, watch } from "vue";
import { storeToRefs } from "pinia";
import { TabelStore } from "../../stores/index.store"; 
import { Button, Modal, Input, TextArea, Select } from "../../UI/UI"; 

const store_tabel = TabelStore();
const { isPaymentModal, model_payment, activeTable } = storeToRefs(store_tabel);

const activeTab = ref('single'); 
const selectedMethod = ref('cash');

const formatPrice = (v) => new Intl.NumberFormat('uz-UZ').format(v || 0) + " so'm";
const cart = computed(() => activeTable.value?.cartId || {});
const grandTotal = computed(() => cart.value.finalTotal || 0);

const totalPaid = computed(() => {
  return (Number(model_payment.value.cash) || 0) + 
         (Number(model_payment.value.card) || 0) + 
         (Number(model_payment.value.terminal) || 0) + 
         (Number(model_payment.value.debt) || 0);
});

const remaining = computed(() => grandTotal.value - totalPaid.value);

watch([activeTab, selectedMethod], () => {
  if (activeTab.value === 'single') {
    ['cash', 'card', 'terminal', 'debt'].forEach(m => {
      model_payment.value[m] = (m === selectedMethod.value) ? grandTotal.value : 0;
    });
  }
}, { immediate: true });

const isReady = computed(() => remaining.value <= 0 && (model_payment.value.debt > 0 ? !!model_payment.value.customerId : true));

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
    <div class="bg-white dark:bg-slate-950 p-6 sm:p-8 space-y-8">
      
      <div class="space-y-6">
        <div class="flex justify-between items-start">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center border border-slate-100 dark:border-slate-800">
              <i class="fa-solid fa-user-tie text-[11px] text-slate-400"></i>
            </div>
            <div>
              <p class="text-[8px] font-black text-slate-400 uppercase tracking-tighter leading-none">Ofitsiant</p>
              <p class="text-[11px] font-bold text-slate-700 dark:text-slate-300">{{ activeTable?.waiterName || 'Tayinlanmagan' }}</p>
            </div>
          </div>

          <div v-if="cart?.customerName || model_payment.customerId" class="flex items-center gap-2.5 text-right">
            <div>
              <p class="text-[8px] font-black text-indigo-400 uppercase tracking-tighter leading-none">Mijoz</p>
              <p class="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">{{ cart?.customerName || 'Doimiy mijoz' }}</p>
            </div>
            <div class="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/20">
              <i class="fa-solid fa-star text-[11px] text-indigo-500"></i>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-4 border-y border-slate-50 dark:border-slate-900 py-4 px-1">
          <div class="space-y-1">
            <p class="text-[8px] font-black text-slate-400 uppercase tracking-widest">Taomlar</p>
            <p class="text-[11px] font-bold text-slate-600 dark:text-slate-300 font-mono">{{ formatPrice(cart.subtotal) }}</p>
          </div>
          <div class="space-y-1 text-center border-x border-slate-50 dark:border-slate-900">
            <p class="text-[8px] font-black text-slate-400 uppercase tracking-widest">Xizmat ({{ cart.serviceFeePercent }}%)</p>
            <p class="text-[11px] font-bold text-indigo-500 font-mono">+{{ formatPrice(cart.serviceFeeAmount) }}</p>
          </div>
          <div class="space-y-1 text-right">
            <p class="text-[8px] font-black text-slate-400 uppercase tracking-widest">Chegirma</p>
            <p class="text-[11px] font-bold text-rose-500 font-mono">-{{ formatPrice(cart.discountAmount || 0) }}</p>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="space-y-1">
            <p class="text-[9px] font-black text-slate-400 uppercase tracking-[2px]">Jami To'lov</p>
            <h2 class="text-3xl font-light text-slate-900 dark:text-white font-mono leading-none tracking-tighter">
              {{ formatPrice(grandTotal) }}
            </h2>
          </div>
         
        </div>
      </div>

      <div class="space-y-6">
        <div class="flex p-1 bg-slate-50 dark:bg-slate-900 rounded-xl">
          <button 
            v-for="t in [{id:'single', n:'Tezkor'}, {id:'mixed', n:'Aralash'}]" :key="t.id"
            @click="activeTab = t.id"
            class="flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all"
            :class="activeTab === t.id ? 'bg-white dark:bg-slate-800 shadow-sm text-slate-900 dark:text-white' : 'text-slate-400'"
          >
            {{ t.n }}
          </button>
        </div>

        <div v-if="activeTab === 'single'" class="grid grid-cols-4 gap-2">
          <button 
            v-for="(label, m) in {cash: 'Naqd', card: 'Karta', terminal: 'Term', debt: 'Qarz'}" :key="m"
            @click="selectedMethod = m"
            class="flex flex-col items-center gap-2 py-3 transition-all"
            :class="selectedMethod === m ? 'text-slate-900 dark:text-white' : 'text-slate-200 hover:text-slate-400'"
          >
            <div class="w-10 h-10 flex items-center justify-center rounded-full border transition-all"
                 :class="selectedMethod === m ? 'border-slate-900 dark:border-white' : 'border-slate-100 dark:border-slate-800'">
              <i class="fa-solid text-xs" :class="{'fa-wallet': m==='cash', 'fa-credit-card': m==='card', 'fa-print': m==='terminal', 'fa-clock': m==='debt'}"></i>
            </div>
            <span class="text-[8px] font-black uppercase tracking-tighter">{{ label }}</span>
          </button>
        </div>

        <div v-if="activeTab === 'mixed'" class="grid grid-cols-2 gap-x-6 gap-y-4 animate-in fade-in">
          <div v-for="f in ['cash', 'card', 'terminal', 'debt']" :key="f" class="space-y-1 border-b border-slate-50 dark:border-slate-900 pb-1">
            <label class="text-[8px] font-black text-slate-400 uppercase tracking-widest">{{ f }}</label>
            <input v-model="model_payment[f]" type="number" class="w-full bg-transparent border-none focus:ring-0 text-sm font-mono font-bold p-0" @focus="$event.target.select()" />
          </div>
        </div>

        <div v-if="model_payment.debt > 0" class="animate-in slide-in-from-top-2">
          <Select v-model="model_payment.customerId" placeholder="Nasiya uchun mijozni tanlang..." class="!border-none !bg-slate-50 dark:!bg-slate-900 !rounded-xl !text-[11px]" />
        </div>
      </div>

      <div class="pt-6 border-t border-slate-50 dark:border-slate-900 flex items-center justify-between">
        <div class="space-y-0.5">
          <p class="text-[8px] font-black text-slate-300 uppercase tracking-widest">Qoldiq</p>
          <p class="text-sm font-mono font-bold" :class="remaining <= 0 ? 'text-emerald-500' : 'text-slate-900 dark:text-white'">
            {{ remaining <= 0 ? 'TO\'LANDI' : formatPrice(remaining) }}
          </p>
        </div>

        <div class="flex gap-3">
          <Button size="sm" variant="secondary" class="!rounded-full !px-6 !text-[10px] font-black uppercase tracking-widest" @click="isPaymentModal = false">Yopish</Button>
          <Button 
            size="sm"
            @click="onFinish"
            :variant="isReady ? 'primary' : 'disabled'"
            class="!rounded-full !px-8 !text-[10px] font-black uppercase tracking-widest transition-all"
            :class="isReady ? 'shadow-lg shadow-indigo-100 dark:shadow-none' : ''"
          >
            {{ isReady ? 'Yakunlash' : 'To\'ldiring' }}
          </Button>
        </div>
      </div>

    </div>
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
@keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
</style>