<script setup>
import { ref, computed, nextTick, onBeforeUnmount, onMounted, watch } from 'vue';
import draggable from 'vuedraggable';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

const props = defineProps({
  items: { type: Array, required: true },
  title: { type: String, default: 'Amallar' },
  draggable: { type: Boolean, default: false },
  // Yangi props: 'vertical' yoki 'horizontal'
  direction: { type: String, default: 'vertical' },
  // Minimalistik ko'rinish uchun
  minimal: { type: Boolean, default: false }
});

const emit = defineEmits(['reorder']);

const isOpen = ref(false);
const triggerRef = ref(null);
const menuRef = ref(null);
const isMobile = ref(false);
const menuStyles = ref({ top: '0px', left: '0px', transformOrigin: 'top right' });

const localItems = ref([...props.items]);
watch(() => props.items, (newVal) => { localItems.value = [...newVal]; }, { deep: true });

const checkScreen = () => { isMobile.value = window.innerWidth < 768; };

// Pozitsiyani hisoblash kodi o'zgarishsiz qoladi...
const calculatePosition = async () => {
  if (!triggerRef.value || isMobile.value) return;
  const rect = triggerRef.value.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  await nextTick();
  const menuRect = menuRef.value ? menuRef.value.getBoundingClientRect() : { width: 256, height: 200 };

  let top = rect.bottom + 8;
  let left = rect.left + rect.width - menuRect.width;
  
  if (top + menuRect.height > viewportHeight) top = rect.top - menuRect.height - 8;
  if (left < 10) left = 10;

  menuStyles.value = { top: `${top}px`, left: `${left}px` };
};

const toggleMenu = async () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    await nextTick();
    if (!isMobile.value) calculatePosition();
    document.body.style.overflow = 'hidden';
  } else {
    closeMenu();
  }
};

const closeMenu = () => {
  isOpen.value = false;
  document.body.style.overflow = '';
};

const handleAction = (item) => {
  if (item.onClick) item.onClick();
  closeMenu();
};
</script>

<template>
  <div class="inline-block">
    <button
      ref="triggerRef"
      @click.stop="toggleMenu"
      type="button"
      :class="[
        'flex items-center justify-center transition-all duration-300 active:scale-75',
        minimal 
          ? 'w-8 h-8 rounded-full bg-transparent hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400' 
          : 'w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 shadow-sm'
      ]"
    >
      <i :class="[
        'fa-solid transition-transform duration-300',
        direction === 'vertical' ? 'fa-ellipsis-vertical' : 'fa-ellipsis',
        isOpen ? (direction === 'vertical' ? 'rotate-90 text-indigo-500' : 'scale-125 text-indigo-500') : ''
      ]"></i>
    </button>

    <Teleport to="body">
      <Transition name="fade">
        <div v-if="isOpen" @click="closeMenu" class="fixed inset-0 bg-slate-900/20 backdrop-blur-[2px] z-[9998]"></div>
      </Transition>

      <Transition :name="isMobile ? 'slide-up' : 'premium-dropdown'">
        <div
          v-if="isOpen"
          ref="menuRef"
          :style="!isMobile ? menuStyles : {}"
          :class="[
            'fixed z-[9999] bg-white dark:bg-slate-900 shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-slate-100 dark:border-slate-800',
            isMobile 
              ? 'inset-x-0 bottom-0 rounded-t-[2.5rem] p-6 pb-12' 
              : 'w-64 rounded-[2rem] p-2'
          ]"
        >
          <div v-if="isMobile" class="w-10 h-1 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-6"></div>

          <div class="px-4 py-2 mb-1 flex justify-between items-center">
            <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-[2px]">{{ title }}</h4>
          </div>

          <draggable 
            v-model="localItems" 
            item-key="label"
            :disabled="!props.draggable"
            handle=".drag-handle"
            @start="Haptics.impact({ style: ImpactStyle.Light })"
            @end="emit('reorder', localItems)"
            ghost-class="ghost-item"
            class="space-y-1"
          >
            <template #item="{ element: item }">
              <div 
                class="group flex items-center rounded-2xl transition-all duration-200"
                :class="item.variant === 'danger' ? 'hover:bg-red-50 dark:hover:bg-red-950/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800'"
              >
                <div v-if="props.draggable" class="drag-handle pl-3 pr-1 py-4 cursor-grab active:cursor-grabbing text-slate-300">
                  <i class="fa-solid fa-grip-vertical text-[10px]"></i>
                </div>

                <button @click.stop="handleAction(item)" class="flex-1 flex items-center gap-3 p-2.5 text-left outline-none">
                  <div :class="[
                    'w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform group-active:scale-90',
                    item.variant === 'danger' ? 'bg-red-100 text-red-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  ]">
                    <i :class="[item.icon, 'text-sm']"></i>
                  </div>

                  <div class="flex flex-col min-w-0">
                    <span :class="['text-sm font-bold', item.variant === 'danger' ? 'text-red-600' : 'text-slate-700 dark:text-slate-200']">
                      {{ item.label }}
                    </span>
                  </div>
                </button>
              </div>
            </template>
          </draggable>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.ghost-item { opacity: 0.3; background: #6366f1 !important; }

.premium-dropdown-enter-active { transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1); }
.premium-dropdown-enter-from { opacity: 0; transform: translateY(-10px) scale(0.95); }

.slide-up-enter-active, .slide-up-leave-active { transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-up-enter-from, .slide-up-leave-to { transform: translateY(100%); }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>