<script setup>
import { ref, computed, nextTick, onBeforeUnmount, onMounted } from 'vue';

const props = defineProps({
  items: { type: Array, required: true },
  title: { type: String, default: 'Amallar' }
});

const isOpen = ref(false);
const triggerRef = ref(null);
const menuRef = ref(null);
const isMobile = ref(false);
const menuStyles = ref({ top: '0px', left: '0px', transformOrigin: 'top right' });

// Ekran hajmini tekshirish
const checkScreen = () => {
  isMobile.value = window.innerWidth < 768;
};

const visibleItems = computed(() => props.items.filter(item => item.show !== false));

const calculatePosition = async () => {
  if (!triggerRef.value || isMobile.value) return;

  const rect = triggerRef.value.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  await nextTick();
  const menuRect = menuRef.value ? menuRef.value.getBoundingClientRect() : { width: 256, height: 200 };

  let top = rect.bottom + 10;
  let left = rect.left + rect.width - menuRect.width;
  let originY = 'top';
  let originX = 'right';

  // Pastga sig'masa, tepaga chiqarish
  if (top + menuRect.height > viewportHeight) {
    top = rect.top - menuRect.height - 10;
    originY = 'bottom';
  }

  // Chapga chiqib ketsa
  if (left < 10) {
    left = 10;
    originX = 'left';
  }

  menuStyles.value = {
    top: `${top}px`,
    left: `${left}px`,
    transformOrigin: `${originY} ${originX}`
  };
};

const toggleMenu = async () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    await nextTick();
    if (!isMobile.value) calculatePosition();
    setupEventListeners();
    document.body.style.overflow = 'hidden'; // Scrollni bloklash
  } else {
    closeMenu();
  }
};

const closeMenu = () => {
  isOpen.value = false;
  removeEventListeners();
  document.body.style.overflow = '';
};

const handleAction = (item) => {
  if (item.onClick) item.onClick();
  closeMenu();
};

const handleKeyDown = (e) => {
  if (e.key === 'Escape') closeMenu();
};

const setupEventListeners = () => {
  window.addEventListener('resize', () => {
    checkScreen();
    calculatePosition();
  });
  window.addEventListener('keydown', handleKeyDown);
};

const removeEventListeners = () => {
  window.removeEventListener('resize', checkScreen);
  window.removeEventListener('keydown', handleKeyDown);
};

onMounted(() => {
  checkScreen();
  window.addEventListener('resize', checkScreen);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkScreen);
  removeEventListeners();
});
</script>

<template>
  <div class="inline-block">
    <button
      ref="triggerRef"
      @click.stop="toggleMenu"
      type="button"
      :class="[
        'w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 active:scale-90',
        isOpen 
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
          : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400'
      ]"
    >
      <i :class="['fa-solid fa-ellipsis-vertical text-lg transition-transform', isOpen ? 'rotate-90' : '']"></i>
    </button>

    <Teleport to="body">
      <Transition name="fade">
        <div v-if="isOpen" @click="closeMenu" class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9998]"></div>
      </Transition>

      <Transition :name="isMobile ? 'slide-up' : 'premium-dropdown'">
        <div
          v-if="isOpen"
          ref="menuRef"
          :style="!isMobile ? menuStyles : {}"
          :class="[
            'fixed z-[9999] overflow-hidden bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800',
            isMobile 
              ? 'inset-x-0 bottom-0 rounded-t-[2.5rem] p-6 pb-10' 
              : 'w-72 rounded-3xl p-2'
          ]"
        >
          <div v-if="isMobile" class="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-6"></div>

          <div class="px-4 py-2 mb-2 flex justify-between items-center">
            <h4 class="text-xs font-black text-slate-400 uppercase tracking-widest">{{ title }}</h4>
            <button v-if="isMobile" @click="closeMenu" class="text-slate-400 hover:text-slate-600">
               <i class="fa-solid fa-xmark text-xl"></i>
            </button>
          </div>

          <div class="grid gap-2">
            <button
              v-for="(item, index) in visibleItems"
              :key="index"
              @click.stop="handleAction(item)"
              class="w-full group flex items-center gap-4 p-3 rounded-2xl transition-all duration-200 active:scale-[0.98] text-left"
              :class="[
                item.variant === 'danger'
                  ? 'hover:bg-red-50 dark:hover:bg-red-950/30'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800'
              ]"
            >
              <div 
                class="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors"
                :class="[
                  item.variant === 'danger'
                    ? 'bg-red-100 text-red-600 dark:bg-red-900/40'
                    : 'bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-indigo-600 dark:bg-slate-800'
                ]"
              >
                <i :class="[item.icon, 'text-lg']"></i>
              </div>

              <div class="flex flex-col min-w-0">
                <span :class="[
                  'text-[15px] font-bold leading-tight',
                  item.variant === 'danger' ? 'text-red-600' : 'text-slate-700 dark:text-slate-200'
                ]">
                  {{ item.label }}
                </span>
                <span v-if="item.description" class="text-xs text-slate-400 dark:text-slate-500 truncate">
                  {{ item.description }}
                </span>
              </div>
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
/* Desktop Animation */
.premium-dropdown-enter-active { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.premium-dropdown-leave-active { transition: all 0.2s ease-in; }
.premium-dropdown-enter-from { opacity: 0; transform: scale(0.8) translateY(-10px); }
.premium-dropdown-leave-to { opacity: 0; transform: scale(0.95); }

/* Mobile Bottom Sheet Animation */
.slide-up-enter-active, .slide-up-leave-active { transition: transform 0.4s cubic-bezier(0.32, 0.72, 0, 1); }
.slide-up-enter-from { transform: translateY(100%); }
.slide-up-leave-to { transform: translateY(100%); }

/* Background Fade */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* Responsive Adjustments */
@media (max-width: 767px) {
  .fixed {
    max-height: 85vh;
    overflow-y: auto;
  }
}
</style>