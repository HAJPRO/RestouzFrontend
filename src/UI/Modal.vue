<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue';

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  title: { type: String, default: 'Ma\'lumot oynasi' },
  subtitle: { type: String, default: '' },
  icon: { type: String, default: 'fa-solid fa-layer-group' },
  width: { type: String, default: '800px' }, // Default: 800px
  height: { type: String, default: '600px' }, // Height qo'shildi
  showClose: { type: Boolean, default: true },
  closeOnBackdrop: { type: Boolean, default: true }
});

const emit = defineEmits(['update:modelValue', 'close']);

const modalRef = ref(null);
const isDragging = ref(false);
const isResizing = ref(false);

const position = ref({ x: 0, y: 0 });
// Boshlang'ich o'lchamlarni propsdan olish
const size = ref({ width: props.width, height: props.height });

const close = () => {
  emit('update:modelValue', false);
  emit('close');
};

// --- DRAG AND DROP ---
let startX, startY;
const initDrag = (e) => {
  if (e.target.closest('.drag-handle') && !e.target.closest('button')) {
    isDragging.value = true;
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
    
    startX = clientX - position.value.x;
    startY = clientY - position.value.y;

    document.addEventListener(e.type.includes('touch') ? 'touchmove' : 'mousemove', doDrag, { passive: false });
    document.addEventListener(e.type.includes('touch') ? 'touchend' : 'mouseup', stopDrag);
  }
};

const doDrag = (e) => {
  if (!isDragging.value) return;
  if (e.cancelable) e.preventDefault(); 

  const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
  const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
  
  position.value = {
    x: clientX - startX,
    y: clientY - startY
  };
};

const stopDrag = () => {
  isDragging.value = false;
  document.removeEventListener('mousemove', doDrag);
  document.removeEventListener('mouseup', stopDrag);
  document.removeEventListener('touchmove', doDrag);
  document.removeEventListener('touchend', stopDrag);
};

// --- RESIZE ---
const initResize = (e) => {
  isResizing.value = true;
  e.preventDefault();
  
  const initialX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
  const initialY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
  const initialWidth = modalRef.value.offsetWidth;
  const initialHeight = modalRef.value.offsetHeight;

  const doResize = (ev) => {
    const currentX = ev.type.includes('touch') ? ev.touches[0].clientX : ev.clientX;
    const currentY = ev.type.includes('touch') ? ev.touches[0].clientY : ev.clientY;
    
    const newWidth = Math.max(380, initialWidth + (currentX - initialX));
    const newHeight = Math.max(250, initialHeight + (currentY - initialY));
    
    size.value = { width: `${newWidth}px`, height: `${newHeight}px` };
  };

  const stopResize = () => {
    isResizing.value = false;
    document.removeEventListener('mousemove', doResize);
    document.removeEventListener('mouseup', stopResize);
    document.removeEventListener('touchmove', doResize);
    document.removeEventListener('touchend', stopResize);
  };

  document.addEventListener(e.type.includes('touch') ? 'touchmove' : 'mousemove', doResize, { passive: false });
  document.addEventListener(e.type.includes('touch') ? 'touchend' : 'mouseup', stopResize);
};

// MODAL OCHILGANDA O'LCHAMLARNI QAYTA TIKLASH
watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    position.value = { x: 0, y: 0 };
    size.value = { width: props.width, height: props.height };
    // Scrollni bloklash (ixtiyoriy)
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
}, { immediate: true });

const handleKeydown = (e) => {
  if (e.key === 'Escape' && props.modelValue) close();
};

onMounted(() => document.addEventListener('keydown', handleKeydown));
onUnmounted(() => document.removeEventListener('keydown', handleKeydown));
</script>

<template>
  <Transition name="modal-spring">
    <div v-if="modelValue" class="custom-super-modal fixed inset-0 flex items-center justify-center p-4 overflow-hidden">
      
      <div 
        class="absolute inset-0 bg-slate-900/60 backdrop-blur-[4px] transition-opacity"
        style="z-index: 10;"
        @click="closeOnBackdrop && close()"
      ></div>

      <div 
        ref="modalRef"
        class="relative bg-white dark:bg-slate-900 rounded-3xl shadow-[0_40px_100px_-20px_rgba(0,0,0,0.6)] flex flex-col border border-slate-200 dark:border-slate-700 overflow-hidden transition-shadow"
        :class="{ 'ring-4 ring-indigo-500/30': isDragging || isResizing }"
        :style="{ 
          transform: `translate(${position.x}px, ${position.y}px)`,
          width: size.width,
          height: size.height,
          minWidth: '380px',
          minHeight: '250px',
          maxWidth: '95vw',
          maxHeight: '95vh',
          zIndex: 20
        }"
      >
        
        <div 
          @mousedown="initDrag" 
          @touchstart="initDrag"
          class="drag-handle cursor-grab active:cursor-grabbing px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center select-none shrink-0 bg-white dark:bg-slate-900 z-[30]"
        >
          <div class="flex items-center gap-4 pointer-events-none">
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white flex items-center justify-center shadow-lg shadow-indigo-500/40">
              <i :class="[icon, 'text-2xl']"></i>
            </div>
            <div>
              <h3 class="text-xl font-black text-slate-800 dark:text-white leading-tight">{{ title }}</h3>
              <p v-if="subtitle" class="text-[10px] text-indigo-500 font-black uppercase tracking-[2px] mt-1">{{ subtitle }}</p>
            </div>
          </div>
          
          <button 
            v-if="showClose"
            @click="close" 
            class="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all active:scale-90 border border-transparent hover:border-rose-100 dark:hover:bg-rose-900/20"
          >
            <i class="fa-solid fa-xmark text-2xl"></i>
          </button>
        </div>

        <div class="flex-1 overflow-y-auto custom-scrollbar p-8 bg-white dark:bg-slate-900">
          <slot />
        </div>

        <div v-if="$slots.footer" class="px-6 py-4 bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 shrink-0">
          <slot name="footer" :close="close" />
        </div>

        <div 
          @mousedown="initResize"
          @touchstart="initResize"
          class="absolute bottom-0 right-0 w-8 h-8 cursor-nwse-resize flex items-end justify-end p-1 group z-[40]"
        >
          <div class="w-3 h-3 border-r-2 border-b-2 border-slate-300 dark:border-slate-600 group-hover:border-indigo-500 transition-colors rounded-br-sm"></div>
        </div>

      </div>
    </div>
  </Transition>
</template>

<style scoped>
.custom-super-modal {
  z-index: 9999;
}

/* Spring Animatsiyasi */
.modal-spring-enter-active {
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.modal-spring-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 1, 1);
}
.modal-spring-enter-from, .modal-spring-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(40px);
}

/* Scrollbar */
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-thumb { 
  background-color: #e2e8f0; 
  border-radius: 10px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #334155; }

.drag-handle { touch-action: none; }
</style>