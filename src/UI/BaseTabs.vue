<template>
  <div class="inline-block select-none">
   <div class="relative inline-flex">
  <Button 
    icon="fas fa-filter"
    size="sm"
    @click="openDrawer"
    :class="isSelected ? 'text-red-500' : ''"
  />
  
  <span 
    v-if="isSelected && !isOpen" 
    class="absolute -top-0.5 -right-0.5 flex h-3 w-3"
  >
    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
    <span class="relative inline-flex rounded-full h-3 w-3 bg-red-600 border border-white dark:border-slate-900"></span>
  </span>
</div>
     
   
    <Teleport to="body">
      <transition name="drawer-fade">
        <div v-if="isOpen" class="fixed inset-0 z-[10000] flex items-end justify-center">
          
          <div 
            class="absolute inset-0 bg-slate-900/60 backdrop-blur-[4px] transition-opacity" 
            @click="closeDrawer"
          ></div>
          
          <transition name="drawer-slide">
            <div 
              v-if="isOpen"
              class="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col max-h-[85vh]"
            >
              <div class="w-full flex justify-center py-4 cursor-pointer" @click="closeDrawer">
                <div class="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full transition-colors active:bg-slate-300"></div>
              </div>

              <div class="px-6 mb-4 flex justify-between items-center">
                <h4 class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Bo'limni tanlang</h4>
                <button @click="closeDrawer" class="text-slate-300 active:text-rose-500 transition-colors">
                  <i class="fas fa-times-circle text-xl"></i>
                </button>
              </div>

              <div class="flex-1 overflow-y-auto px-4 pb-12 custom-scrollbar">
                <div class="flex flex-col gap-2">
                  <button
                    v-for="tab in tabs"
                    :key="tab.id"
                    @click="selectTab(tab.id)"
                    class="flex items-center justify-between p-4 rounded-[24px] transition-all duration-200 active:scale-[0.96]"
                    :class="modelValue === tab.id 
                      ? 'bg-indigo-50 dark:bg-indigo-500/10 border-2 border-indigo-500/20 shadow-sm' 
                      : 'bg-slate-50/50 dark:bg-slate-800/30 border-2 border-transparent'"
                  >
                    <div class="flex items-center gap-4">
                      <div 
                        class="w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-500"
                        :class="modelValue === tab.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 rotate-6' : 'bg-white dark:bg-slate-800 text-slate-400'"
                      >
                        <i :class="tab.icon || 'fas fa-layer-group'" class="text-base"></i>
                      </div>
                      <span class="font-black text-[15px]" :class="modelValue === tab.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'">
                        {{ tab.label }}
                      </span>
                    </div>
                    <i v-if="modelValue === tab.id" class="fas fa-check text-indigo-600"></i>
                  </button>
                </div>
              </div>
            </div>
          </transition>

        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Button } from '../UI/UI';

const props = defineProps({
  tabs: { type: Array, required: true },
  modelValue: { type: [String, Number], required: true }
});

const emit = defineEmits(['update:modelValue', 'change']);
const isOpen = ref(false);

const isSelected = computed(() => props.modelValue !== props.tabs[0]?.id);

const openDrawer = async () => {
  isOpen.value = true;
  document.body.style.overflow = 'hidden';
  try { await Haptics.impact({ style: ImpactStyle.Medium }); } catch (e) {}
};

const closeDrawer = () => {
  isOpen.value = false;
  document.body.style.overflow = '';
};

const selectTab = async (id) => {
  if (props.modelValue !== id) {
    emit('update:modelValue', id);
    emit('change', id);
    try { await Haptics.impact({ style: ImpactStyle.Light }); } catch (e) {}
  }
  setTimeout(closeDrawer, 150);
};

onUnmounted(() => {
  document.body.style.overflow = '';
});
</script>

<style scoped>
/* Orqa fon animatsiyasi */
.drawer-fade-enter-active, .drawer-fade-leave-active {
  transition: opacity 0.3s ease;
}
.drawer-fade-enter-from, .drawer-fade-leave-to {
  opacity: 0;
}

/* Pastdan chiquvchi drawer animatsiyasi */
.drawer-slide-enter-active {
  transition: transform 0.5s cubic-bezier(0.32, 0.72, 0, 1);
}
.drawer-slide-leave-active {
  transition: transform 0.3s ease-in;
}
.drawer-slide-enter-from, .drawer-slide-leave-to {
  transform: translateY(100%);
}

.custom-scrollbar::-webkit-scrollbar { display: none; }
</style>