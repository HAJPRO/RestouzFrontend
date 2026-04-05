<template>
  <div class="w-full bg-transparent transition-colors duration-300">
    
    <div v-if="!isMobile" class="w-full">
      <div class="flex items-center gap-4 border-b border-slate-200 dark:border-slate-700 px-1 relative">
        <button
          v-for="tab in props.tabs"
          :key="tab.id"
          @click="handleTabClick(tab.id)"
          class="group relative flex items-center gap-2 py-3 px-1 text-[13px] font-medium transition-all duration-300 outline-none"
          :class="[modelValue === tab.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800']"
        >
          <i v-if="tab.icon" :class="[tab.icon, modelValue === tab.id ? 'scale-110' : 'opacity-70']"></i>
          <span>{{ tab.label }}</span>
          <span v-if="counts[tab.key]" class="ml-1 text-[10px] opacity-60">({{ counts[tab.key] }})</span>
          
          <span 
            class="absolute bottom-0 left-0 w-full h-[2px] bg-indigo-600 transition-all duration-300"
            :class="modelValue === tab.id ? 'scale-x-100' : 'scale-x-0'"
          ></span>
        </button>
      </div>
    </div>

    <div v-else class="px-2 mobile-dropdown-container">
      <button 
        @click.stop="isDropdownOpen = !isDropdownOpen"
        class="w-full flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl px-4 py-3 shadow-sm active:scale-[0.98] transition-all"
        :class="{'ring-2 ring-indigo-500/20 border-indigo-500/50': isDropdownOpen}"
      >
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600">
            <i :class="currentTab?.icon || 'fa-solid fa-grid-2'"></i>
          </div>
          <div class="text-left">
            <span class="block text-[10px] text-slate-400 uppercase font-black tracking-widest">Bo'lim</span>
            <span class="block text-sm font-bold text-slate-700 dark:text-slate-200">{{ currentTab?.label }}</span>
          </div>
        </div>
        
        <div class="flex items-center gap-3">
          <span v-if="counts[currentTab?.key]" class="bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-black px-2 py-1 rounded-lg">
            {{ counts[currentTab?.key] }}
          </span>
          <ion-icon :icon="chevronDownOutline" class="text-slate-400 transition-transform duration-300" :class="{'rotate-180': isDropdownOpen}" />
        </div>
      </button>

      <transition name="dropdown-slide">
        <div v-if="isDropdownOpen" class="absolute top-full left-2 right-2 mt-2 bg-white dark:bg-slate-900 rounded-[24px] shadow-2xl border border-slate-100 dark:border-white/5 z-[100] overflow-hidden flex flex-col max-h-[60vh]">
          
          <div class="p-3 border-b border-slate-50 dark:border-white/5">
            <div class="relative">
              <ion-icon :icon="searchOutline" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                v-model="search" 
                type="text" 
                :placeholder="searchPlaceholder"
                class="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium outline-none focus:ring-1 ring-indigo-500/30"
              />
            </div>
          </div>

          <div class="overflow-y-auto p-2 space-y-1 custom-scrollbar">
            <button 
              v-for="tab in filteredTabs" 
              :key="tab.id"
              @click="selectTabMobile(tab.id)"
              class="w-full flex items-center justify-between p-3 rounded-xl transition-all"
              :class="modelValue === tab.id ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600' : 'text-slate-600 dark:text-slate-400 active:bg-slate-50'"
            >
              <div class="flex items-center gap-3">
                <i :class="[tab.icon, 'w-5 text-center text-base', modelValue === tab.id ? 'text-indigo-600' : 'text-slate-400']"></i>
                <span class="text-sm font-bold">{{ tab.label }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span v-if="counts[tab.key]" class="text-[10px] font-bold opacity-60">{{ counts[tab.key] }}</span>
                <ion-icon v-if="modelValue === tab.id" :icon="checkmarkCircleOutline" class="text-lg" />
              </div>
            </button>
          </div>
        </div>
      </transition>

      <transition name="fade">
        <div v-if="isDropdownOpen" class="fixed inset-0 bg-slate-950/20 backdrop-blur-[2px] z-[90]" @click="isDropdownOpen = false"></div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useScreen } from "@/utils/TableOptions/useTableOptions";
import { chevronDownOutline, searchOutline, checkmarkCircleOutline } from 'ionicons/icons';

const props = defineProps({
  tabs: { type: Array, required: true },
  modelValue: { type: [Number, String], required: true },
  counts: { type: Object, default: () => ({}) },
  searchPlaceholder: { type: String, default: "Qidirish..." }
});

const emit = defineEmits(['update:modelValue', 'change']);
const { isMobile } = useScreen();
const search = ref("");
const isDropdownOpen = ref(false);

const handleTabClick = (id) => {
  if (props.modelValue !== id) {
    emit('update:modelValue', id);
    emit('change', id);
  }
};

const selectTabMobile = (id) => {
  handleTabClick(id);
  isDropdownOpen.value = false;
  search.value = "";
};

const currentTab = computed(() => 
  props.tabs.find(t => t.id === props.modelValue) || props.tabs[0]
);

const filteredTabs = computed(() =>
  props.tabs.filter((t) =>
    t.label.toLowerCase().includes(search.value.toLowerCase())
  )
);
</script>

<style scoped>
.dropdown-slide-enter-active, .dropdown-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.dropdown-slide-enter-from, .dropdown-slide-leave-to {
  opacity: 0;
  transform: translateY(-12px) scale(0.98);
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
</style>