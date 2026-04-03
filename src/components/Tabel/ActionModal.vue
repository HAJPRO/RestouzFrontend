<script setup>
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { TabelStore } from "../../stores/index.store";
import { Button, Select, Modal, Input } from "../../UI/UI";

const store_tabel = TabelStore();
const { isModal } = storeToRefs(store_tabel);

// Statik optionlar (Select uchun)
const roomOptions = [
  { label: "Asosiy Zal", value: "main" },
  { label: "VIP Xona", value: "vip" },
  { label: "Ayvon (Terrasa)", value: "terrace" }
];

const statusOptions = [
  { label: "Bo'sh", value: "active" },
  { label: "Band", value: "busy" },
  { label: "Ta'mirda", value: "repair" }
];
</script>

<template>
  <Modal
    v-model="isModal"
    title="Yangi stol qo'shish"
    icon="fa-solid fa-plus-circle"
    width="max-w-[450px]"
  >
    <div class="sticky top-[-24px] z-50 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 p-4 mb-6 -mx-2">
      <div class="flex items-center justify-between gap-4">
        <div class="flex flex-col">
          <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Mavjud stollar</span>
          <span class="text-xl font-black text-slate-900 dark:text-white font-mono">24 <small class="text-[10px] text-slate-400 font-sans">ta</small></span>
        </div>
        <div class="w-px h-8 bg-slate-200 dark:bg-slate-800"></div>
        <div class="flex flex-col items-end">
          <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Oxirgi ID</span>
          <span class="text-xl font-black text-indigo-600 font-mono">T-0125</span>
        </div>
      </div>
    </div>

    <div class="space-y-5 pb-28 px-1">
      
      <div class="grid grid-cols-2 gap-4">
        <div class="flex flex-col gap-1.5">
          <Input 
          clearable
          label="Stol raqami"
            placeholder="Masalan: 12" 
          />
        </div>
        <div class="flex flex-col gap-1.5">
          <Input 
           clearable
          label="Sig'imi (Kishi)"
            type="number" 
            placeholder="Masalan: 4" 
            class="!rounded-2xl border-slate-200 shadow-sm"
          />
        </div>
      </div>

      <div class="flex flex-col gap-1.5">
        <!-- <label class="text-[10px] font-black text-slate-400 uppercase ml-1">Joylashgan joyi (Zal)</label> -->
        <Select 
        label="Joylashgan joyi (Zal)"
          :options="roomOptions" 
          placeholder="Zalni tanlang..."
          class="w-full"
        />
      </div>

      <div class="flex flex-col gap-1.5">
        <!-- <label class="text-[10px] font-black text-slate-400 uppercase ml-1">Dastlabki holati</label> -->
        <Select 
        label="Dastlabki holati"
          :options="statusOptions" 
          placeholder="Holatni tanlang..."
          class="w-full"
        />
      </div>

      <div class="flex flex-col gap-1.5">
        <label class="text-[10px] font-black text-slate-400 uppercase ml-1">Stol haqida izoh (ixtiyoriy)</label>
        <textarea 
          placeholder="Deraza yonidagi stol..." 
          class="w-full min-h-[80px] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
        ></textarea>
      </div>

      <div class="p-4 bg-indigo-50/50 dark:bg-indigo-500/5 rounded-2xl border border-indigo-100 dark:border-indigo-500/20">
        <div class="flex items-start gap-3">
          <div class="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center text-white">
            <i class="fa-solid fa-chair text-lg"></i>
          </div>
          <div>
            <p class="text-xs font-black text-slate-700 dark:text-slate-200">Stol-12 (Asosiy Zal)</p>
            <p class="text-[10px] text-slate-400 font-bold italic">4 kishilik, aktiv holatda yaratiladi</p>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="py-1 px-4 flex gap-2">
        <Button 
        variant="danger"
        size="sm"
          @click="isModal = false"
        >
          Bekor qilish
        </Button>
        <Button 
        size="sm"
        >
          Saqlash
        </Button>
      </div>
    </template>
  </Modal>
</template>

<style scoped>
/* Mobil qurilmalar uchun moslashuvchanlik */
@media (max-width: 640px) {
  :deep(.modal-content) {
    border-radius: 0 !important;
    min-height: 100vh !important;
  }
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>