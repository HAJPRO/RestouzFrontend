<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  title: { type: String, default: 'Ma\'lumot oynasi' },
  subtitle: { type: String, default: '' },
  icon: { type: String, default: 'fa-solid fa-layer-group' },
  // Standart kenglik % yoki px da, lekin biz buni aqlli qilamiz
  width: { type: String, default: '80%' }, 
  height: { type: String, default: '75vh' },
  showClose: { type: Boolean, default: true },
  closeOnBackdrop: { type: Boolean, default: true }
});

const emit = defineEmits(['update:modelValue', 'close']);

const modalRef = ref(null);
const isDragging = ref(false);
const isResizing = ref(false);

const position = ref({ x: 0, y: 0 });
const size = ref({ width: '0px', height: '0px' });

const close = () => {
  emit('update:modelValue', false);
  emit('close');
};

// --- AQLLI MOSLASHUV FUNKSIYASI ---
const adjustToScreen = () => {
  const vh = window.innerHeight;
  const vw = window.innerWidth;

  // Agar ekran kichik bo'lsa (Mobile), modalni to'liqroq qilamiz
  if (vw < 768) {
    size.value = { width: '95vw', height: '80vh' };
  } else {
    // Katta ekranlarda props qiymatiga yoki optimal o'lchamga qaytamiz
    size.value = { width: props.width, height: props.height };
  }
  position.value = { x: 0, y: 0 };
};

// --- DRAG & RESIZE LOGIKASI (Sizning kodingiz saqlandi) ---
let startX, startY;
const initDrag = (e) => {
  if (e.target.closest('.drag-handle') && !e.target.closest('button')) {
    isDragging.value = true;
    const ev = e.type.includes('touch') ? e.touches[0] : e;
    startX = ev.clientX - position.value.x;
    startY = ev.clientY - position.value.y;
    document.addEventListener(e.type.includes('touch') ? 'touchmove' : 'mousemove', doDrag, { passive: false });
    document.addEventListener(e.type.includes('touch') ? 'touchend' : 'mouseup', stopDrag);
  }
};

const doDrag = (e) => {
  if (!isDragging.value) return;
  if (e.cancelable) e.preventDefault(); 
  const ev = e.type.includes('touch') ? e.touches[0] : e;
  position.value = { x: ev.clientX - startX, y: ev.clientY - startY };
};

const stopDrag = () => {
  isDragging.value = false;
  document.removeEventListener('mousemove', doDrag);
  document.removeEventListener('mouseup', stopDrag);
};

const initResize = (e) => {
  isResizing.value = true;
  // Touch yoki Mouse ekanligini aniqlash
  const isTouch = e.type.includes('touch');
  const ev = isTouch ? e.touches[0] : e;
  
  const initialWidth = modalRef.value.offsetWidth;
  const initialHeight = modalRef.value.offsetHeight;
  const initialX = ev.clientX;
  const initialY = ev.clientY;

  const doResize = (rev) => {
    if (!isResizing.value) return;
    
    // Mobil brauzerda sahifa surilib ketmasligi uchun
    if (rev.cancelable) rev.preventDefault(); 

    const rEv = rev.type.includes('touch') ? rev.touches[0] : rev;
    
    size.value = { 
      width: `${Math.max(320, initialWidth + (rEv.clientX - initialX))}px`, 
      height: `${Math.max(200, initialHeight + (rEv.clientY - initialY))}px` 
    };
  };

  const stopResize = () => {
    isResizing.value = false;
    // Mouse hodisalarini o'chirish
    document.removeEventListener('mousemove', doResize);
    document.removeEventListener('mouseup', stopResize);
    // Touch hodisalarini o'chirish
    document.removeEventListener('touchmove', doResize);
    document.removeEventListener('touchend', stopResize);
  };

  if (isTouch) {
    document.addEventListener('touchmove', doResize, { passive: false });
    document.addEventListener('touchend', stopResize);
  } else {
    document.addEventListener('mousemove', doResize);
    document.addEventListener('mouseup', stopResize);
  }
};

// --- MODAL OCHILGANDA MOSLASHTIRISH ---
watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    adjustToScreen();
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});

onMounted(() => {
  window.addEventListener('resize', adjustToScreen);
});

onUnmounted(() => {
  window.removeEventListener('resize', adjustToScreen);
});
</script>

<template>
  <Transition name="modal-luxe">
    <div v-if="modelValue" class="modal-root fixed inset-0 flex items-center justify-center p-2">
      
      <div 
        class="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-all duration-500"
        @click="closeOnBackdrop && close()"
      ></div>

      <div 
        ref="modalRef"
        class="modal-card relative bg-slate-50 dark:bg-slate-950 flex flex-col border border-slate-200 dark:border-slate-800"
        :class="{ 'is-active': isDragging || isResizing }"
        :style="{ 
          transform: `translate(${position.x}px, ${position.y}px)`,
          width: size.width,
          height: size.height,
          maxWidth: '98vw',
          maxHeight: '98vh'
        }"
      >
        
        <div 
          @mousedown="initDrag" 
          @touchstart="initDrag"
          class="drag-handle px-6 py-2 flex justify-between items-center select-none shrink-0 border-b border-slate-200 bg-white dark:bg-slate-950 dark:border-slate-800 rounded-t-2xl"
        >
          <div class="flex items-center gap-4">
            <div class="w-11 h-11 rounded-full bg-indigo-600 dark:bg-indigo-600 text-white flex items-center justify-center shadow-lg">
              <i :class="[icon, 'text-lg']"></i>
            </div>
            <div class="overflow-hidden">
              <h3 class="text-lg font-black text-slate-800 dark:text-white truncate uppercase tracking-tight">{{ title }}</h3>
              <p v-if="subtitle" class="text-[10px] text-indigo-500 font-black uppercase tracking-widest mt-0.5 truncate">{{ subtitle }}</p>
            </div>
          </div>
          
          <button @click="close" class="close-btn group">
            <i class="fa-solid fa-xmark text-xl text-slate-400 group-hover:text-rose-500 transition-colors"></i>
          </button>
        </div>

        <div class="flex-1 overflow-y-auto custom-scrollbar p-4">
          <slot />
        </div>

        <div v-if="$slots.footer" class="px-6 py-2 bg-white dark:bg-slate-950  border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3 rounded-b-2xl">
          <slot name="footer" :close="close" />
        </div>

        <div @mousedown="initResize" @touchstart="initResize" class="resize-handle">
          <div class="w-4 h-4 border-r-2 border-b-2 border-slate-300 dark:border-slate-700 rounded-br-md group-hover:border-indigo-500 transition-colors"></div>
        </div>

      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-root { z-index: 99999; }

.modal-card {
  border-radius: 28px;
  transition: box-shadow 0.3s ease, border-color 0.3s ease;
  will-change: transform, width, height;
}

.modal-card.is-active {
  box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.4);
  border-color: #6366f1;
}

.drag-handle { cursor: grab; }
.drag-handle:active { cursor: grabbing; }

.close-btn {
  @apply w-10 h-10 rounded-full flex items-center justify-center hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all;
}

.resize-handle {
  @apply absolute bottom-0 right-0 w-8 h-8 cursor-nwse-resize flex items-end justify-end p-1.5 z-50;
}

/* Custom Scrollbar */
.custom-scrollbar::-webkit-scrollbar { width: 5px; }
.custom-scrollbar::-webkit-scrollbar-thumb { 
  background-color: #e2e8f0; 
  border-radius: 20px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #1e293b; }

/* LUXE ANIMATION */
.modal-luxe-enter-active {
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.modal-luxe-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.modal-luxe-enter-from {
  opacity: 0;
  transform: scale(0.9) translateY(30px);
  filter: blur(10px);
}
.modal-luxe-leave-to {
  opacity: 0;
  transform: scale(0.95);
  filter: blur(5px);
}
</style>