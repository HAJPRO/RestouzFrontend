<script setup>
import { ref } from "vue";
import {  storeToRefs } from "pinia";
import { TabelStore } from "../../stores/index.store";
import { Button, Select, Modal, Input,TextArea } from "../../UI/UI";

const store_tabel = TabelStore();
const { isModal,model,modalAction } = storeToRefs(store_tabel);

// Statik optionlar (Select uchun)
const roomOptions = [
  { label: "Asosiy Zal", value: "main" },
  { label: "VIP Xona", value: "vip" },
  { label: "Ayvon (Terrasa)", value: "terrace" }
];

const statusOptions = [
  { label: "Bo'sh", value: "0" },
  { label: "Band", value: "1" },
  { label: "Bron", value: "2" },
  { label: "Hisob kutilmoqda", value: "3" },
  { label: "Ta'mirda", value: "-1" },
];




// Komponentlar massivi (Validatsiya uchun)
const formRefs = ref([]);
const Save = async () => {
  
  const results = formRefs.value.map(refItem => refItem?.validate());
  if (results.includes(false)) {
    const firstError = document.querySelector('.border-rose-500');
    firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }
  try {
    
  const data = await store_tabel.Create(model.value, modalAction.value);
    
  } catch (err) {
    // 3. Server validatsiyasi (Backend'dan kelgan xatolar)
    if (err.response?.data?.errors) {
      // Masalan: { number: ["Bu raqam band"] }
    }
  } finally {
  }
};
</script>

<template>
  <Modal
    v-model="isModal"
    :title="modalAction === 'edit' ? 'Stolni tahrirlash' : 'Yangi stol'"
    :icon="modalAction === 'edit' ? 'fa-solid fa-edit' : 'fa-solid fa-plus'"
  >
    <!-- <div class="sticky top-[-24px] z-50 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 p-4 mb-6 -mx-2">
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
    </div> -->

    <div class="space-y-5 pb-4 px-1 mt-3">
      
      <div class="grid grid-cols-2 gap-4">
        <div class="flex flex-col gap-1.5">
          <Input 
         :ref="el => formRefs[0] = el"
          required
          :error="!model.number && touched ? 'Stol raqamini kiriting' : false"
         :rules="[v => !!v || 'Stol raqamini kiriting']"
          v-model="model.number"
          clearable
          label="Stol raqami"
          placeholder="Masalan: 12" 
          />
        </div>
        <div class="flex flex-col gap-1.5">
          <Input 
          :ref="el => formRefs[1] = el"
            required
           v-model="model.capacity"
            :error="!model.number && touched ? 'Stol raqamini kiriting' : false"
         :rules="[v => !!v || `Stol sig'imini kiriting`]"
           clearable
          label="Sig'imi (Kishi)"
            type="number" 
            placeholder="Masalan: 4" 
            class="!rounded-2xl border-slate-200 shadow-sm"
          />
        </div>
      </div>

      <div class="flex flex-col gap-1.5">
        <Select 
       :ref="el => formRefs[2] = el"
       clearable
        v-model="model.position"
        label="Joylashgan joyi (Zal)"
          :options="roomOptions" 
          placeholder="Joylashuvni tanlang..."
          class="w-full"
          required
    :rules="[v => !!v || 'Iltimos, stolni joylashuvini tanlang']"
        />
      </div>

      <div class="flex flex-col gap-1.5">
        <!-- <label class="text-[10px] font-black text-slate-400 uppercase ml-1">Dastlabki holati</label> -->
        <Select 
       :ref="el => formRefs[3] = el"
        v-model="model.status"
        label="Dastlabki holati"
          :options="statusOptions" 
          placeholder="Holatni tanlang..."
          class="w-full"
          required
          clearable
    :rules="[v => !!v || 'Iltimos, holatni tanlang']"
        />
      </div>

      <div class="flex flex-col gap-1.5">
       <TextArea 
             :ref="el => formRefs[4] = el"

  v-model="model.note"
  clearable
  label="Qo'shimcha ma'lumot"
  placeholder="Batafsil yozing..."
  counter
  maxlength="500"
  :rules="[v => v.length > 10 || 'Kamida 10 ta belgi yozing']"
  required
/>
      </div>

      
    </div>

    <template #footer>
      <div class="py-1 px-4 flex gap-2">
        <Button 
        leftIcon="fa-solid fa-xmark"
        variant="danger"
        size="sm"
          @click="isModal = false"
        >
          Bekor qilish
        </Button>
        <Button 
        @click="Save()"
        size="sm"
        leftIcon="fas fa-check"
        >
          {{ modalAction === 'edit' ? 'O\'zgartirish' : 'Saqlash' }}
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