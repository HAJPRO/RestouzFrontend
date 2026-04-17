<template>
  <div class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px] overflow-hidden"
       @mousedown.self="$emit('close')">
    
    <div 
      ref="draggableContainer"
      :style="containerStyle"
      class="datepicker-card relative flex flex-col md:flex-row w-full max-w-[760px] 
             bg-white dark:bg-[#1a1c23] border border-slate-200 dark:border-slate-800 
             shadow-[0_25px_70px_-15px_rgba(0,0,0,0.4)] rounded-[32px] overflow-hidden select-none"
    >
      
      <div @mousedown="startDragging" 
           class="absolute top-0 left-0 right-0 h-10 cursor-move z-[10] group" 
           title="Sudrash uchun ushlang">
        <div class="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-slate-200 dark:bg-slate-700 rounded-full opacity-40 group-hover:opacity-100 transition-opacity"></div>
      </div>

      <div class="w-full md:w-[200px] p-5 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800 
                  flex md:flex-col gap-1.5 overflow-x-auto md:overflow-y-auto no-scrollbar 
                  bg-slate-50/50 dark:bg-slate-900/40 relative z-[11]">
        <h3 class="hidden md:block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[2px] mb-4 mt-2 px-3">
          Filtr
        </h3>
        <button v-for="filter in quickFilters" :key="filter.label"
                @click="handleFilterClick(filter.value)"
                class="filter-tab-btn"
                :class="activeFilter === filter.value ? 'active-tab' : 'inactive-tab'">
          <span>{{ filter.label }}</span>
          <i v-if="activeFilter === filter.value" class="fas fa-check-circle text-[11px] ml-1"></i>
        </button>
      </div>

      <div class="flex-1 flex flex-col h-full max-h-[90vh] md:max-h-[620px] bg-white dark:bg-[#1a1c23] relative z-[11]">
        
        <div class="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar p-6 lg:p-8 pt-10">
          
          <div v-if="activeFilter === 'thisYear'" class="mb-6 animate-in fade-in zoom-in-95 duration-300">
            <div class="flex items-center gap-3 mb-4 px-1">
              <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Yilni tanlang</span>
              <div class="h-px flex-1 bg-slate-100 dark:bg-slate-800"></div>
              <span class="text-[11px] font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded-md">{{ selectedSpecificYear }}</span>
            </div>

            <div class="relative">
              <div class="grid grid-cols-5 sm:grid-cols-6 gap-1.5 max-h-[140px] overflow-y-auto custom-scrollbar pr-1 py-1">
                <button v-for="y in extendedYears" :key="y" 
                        @click="updateSpecificYear(y)"
                        class="year-mini-btn"
                        :class="selectedSpecificYear === y ? 'active-year' : 'inactive-year'">
                  {{ y }}
                </button>
              </div>
              <div class="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white dark:from-[#1a1c23] to-transparent pointer-events-none opacity-80"></div>
            </div>
          </div>

          <div v-if="activeFilter === 'thisMonth'" class="mb-6 animate-in fade-in zoom-in-95 duration-300">
            <div class="grid grid-cols-4 gap-1.5">
              <button v-for="(m, i) in shortMonths" :key="m" 
                      @click="updateSpecificMonth(i)"
                      class="year-mini-btn text-[11px]"
                      :class="selectedSpecificMonth === i ? 'active-year' : 'inactive-year'">
                {{ m }}
              </button>
            </div>
          </div>

          <div v-show="activeFilter !== 'allTime'">
            <div class="flex justify-between items-center mb-6">
              <button @click="prevMonth" class="nav-btn"><i class="fas fa-chevron-left"></i></button>
              <div class="flex flex-col items-center">
                <span class="text-lg font-black text-slate-800 dark:text-slate-100 leading-none">{{ months[viewDate.getMonth()] }}</span>
                <span class="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{{ viewDate.getFullYear() }}</span>
              </div>
              <button @click="nextMonth" class="nav-btn"><i class="fas fa-chevron-right"></i></button>
            </div>

            <div class="grid grid-cols-7 mb-4">
              <span v-for="day in ['Ya', 'Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh']" :key="day" 
                    class="text-[10px] font-black text-slate-300 dark:text-slate-600 text-center uppercase tracking-widest">{{ day }}</span>
            </div>

            <div class="grid grid-cols-7 gap-y-1" @mouseup="onMouseUp">
              <div v-for="(date, index) in calendarDays" :key="index"
                   class="relative h-10 flex items-center justify-center cursor-pointer"
                   :class="getRangeClass(date, index)"
                   @mousedown="onMouseDown(date)"
                   @mouseenter="onMouseEnter(date)">
                <div class="day-content relative z-[1] w-8 h-8 flex items-center justify-center text-sm font-bold rounded-full transition-all"
                     :class="getDayStatusClass(date)">
                  {{ date.getDate() }}
                  <span v-if="isToday(date)" class="today-dot"></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="p-6 border-t border-slate-100 dark:border-slate-800/60 bg-white dark:bg-[#1a1c23]">
          <div class="flex gap-3">
            <button @click="$emit('close')" class="btn-secondary">Yopish</button>
            <button @click="confirmRange" :disabled="!range.end" class="btn-primary">Tanlash</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const emit = defineEmits(['selected', 'close']);
const currentYear = new Date().getFullYear();

// --- Draggable Logic ---
const position = ref({ x: 0, y: 0 });
const isDragging = ref(false);
const offset = ref({ x: 0, y: 0 });

const containerStyle = computed(() => ({
  transform: `translate(${position.value.x}px, ${position.value.y}px)`,
  transition: isDragging.value ? 'none' : 'transform 0.2s cubic-bezier(0.2, 0, 0, 1)'
}));

const startDragging = (e) => {
  if (e.button !== 0) return;
  isDragging.value = true;
  offset.value = { x: e.clientX - position.value.x, y: e.clientY - position.value.y };
  window.addEventListener('mousemove', onDrag);
  window.addEventListener('mouseup', stopDragging);
};
const onDrag = (e) => { if (isDragging.value) position.value = { x: e.clientX - offset.value.x, y: e.clientY - offset.value.y }; };
const stopDragging = () => { isDragging.value = false; window.removeEventListener('mousemove', onDrag); window.removeEventListener('mouseup', stopDragging); };

// --- Calendar Logic ---
const viewDate = ref(new Date());
const range = ref({ start: null, end: null });
const isDraggingRange = ref(false);
const activeFilter = ref('today');
const selectedSpecificYear = ref(currentYear);
const selectedSpecificMonth = ref(new Date().getMonth());

const months = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'];
const shortMonths = ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyun', 'Iyul', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek'];
const quickFilters = [
  { label: 'Bugun', value: 'today' },
  { label: 'Kecha', value: 'yesterday' },
  { label: 'Hafta', value: 'thisWeek' },
  { label: 'Oy', value: 'thisMonth' },
  { label: 'Yil', value: 'thisYear' }
];

const extendedYears = computed(() => {
  const start = 1990;
  return Array.from({ length: currentYear - start + 1 }, (_, i) => start + i).reverse();
});

const handleFilterClick = (type) => {
  activeFilter.value = type;
  if (type === 'thisYear') updateSpecificYear(selectedSpecificYear.value);
  else if (type === 'thisMonth') updateSpecificMonth(selectedSpecificMonth.value);
  else applyStandardFilter(type);
};

const updateSpecificYear = (year) => {
  selectedSpecificYear.value = year;
  range.value = { start: new Date(year, 0, 1), end: new Date(year, 11, 31, 23, 59, 59) };
  viewDate.value = new Date(year, 0, 1);
};

const updateSpecificMonth = (monthIndex) => {
  selectedSpecificMonth.value = monthIndex;
  const year = viewDate.value.getFullYear();
  range.value = { start: new Date(year, monthIndex, 1), end: new Date(year, monthIndex + 1, 0, 23, 59, 59) };
  viewDate.value = new Date(year, monthIndex, 1);
};

const applyStandardFilter = (type) => {
  const now = new Date();
  let start = new Date(); let end = new Date();
  start.setHours(0,0,0,0); end.setHours(23,59,59,999);
  if (type === 'yesterday') { start.setDate(now.getDate() - 1); end.setDate(now.getDate() - 1); }
  else if (type === 'thisWeek') { start.setDate(now.getDate() - now.getDay()); end.setDate(now.getDate() + (6 - now.getDay())); }
  range.value = { start, end }; viewDate.value = new Date(start);
};

// Range Selection logic
const onMouseDown = (date) => { isDraggingRange.value = true; activeFilter.value = 'custom'; range.value.start = new Date(date); range.value.end = null; };
const onMouseEnter = (date) => {
  if (!isDraggingRange.value || !range.value.start) return;
  const d = new Date(date);
  if (d < range.value.start) { range.value.end = range.value.start; range.value.start = d; }
  else range.value.end = d;
};
const onMouseUp = () => isDraggingRange.value = false;

const getRangeClass = (date, index) => {
  if (!range.value.start || !range.value.end) return range.value.start?.toDateString() === date.toDateString() ? 'is-start-only' : '';
  const d = new Date(date).setHours(0,0,0,0);
  const s = range.value.start.getTime(); const e = range.value.end.getTime();
  if (d < s || d > e) return '';
  let classes = ['in-range'];
  if (d === s) classes.push('range-start'); if (d === e) classes.push('range-end');
  if (index % 7 === 0) classes.push('row-edge-left'); if (index % 7 === 6) classes.push('row-edge-right');
  return classes.join(' ');
};

const getDayStatusClass = (date) => {
  const d = new Date(date).setHours(0,0,0,0);
  const isInRange = range.value.start && range.value.end && d >= range.value.start.getTime() && d <= range.value.end.getTime();
  return { 'out-of-month': date.getMonth() !== viewDate.value.getMonth(), 'text-white': isInRange, 'text-slate-700 dark:text-slate-200': !isInRange && date.getMonth() === viewDate.value.getMonth() };
};

const calendarDays = computed(() => {
  const start = new Date(viewDate.value.getFullYear(), viewDate.value.getMonth(), 1);
  start.setDate(start.getDate() - start.getDay());
  return Array.from({ length: 42 }, () => { const d = new Date(start); start.setDate(start.getDate() + 1); return d; });
});

const isToday = (date) => date.toDateString() === new Date().toDateString();
const prevMonth = () => viewDate.value = new Date(viewDate.value.getFullYear(), viewDate.value.getMonth() - 1, 1);
const nextMonth = () => viewDate.value = new Date(viewDate.value.getFullYear(), viewDate.value.getMonth() + 1, 1);
const confirmRange = () => emit('selected', range.value);

onMounted(() => handleFilterClick('today'));
</script>

<style scoped>
/* Scrollbar */
.custom-scrollbar { scrollbar-width: thin; scrollbar-color: #6366f1 transparent; scroll-behavior: smooth; overscroll-behavior: contain; }
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { @apply bg-slate-200 dark:bg-slate-700 rounded-full; }

/* Buttons & Elements */
.filter-tab-btn { @apply whitespace-nowrap md:w-full px-4 py-3 text-[12px] font-bold rounded-xl transition-all duration-200 text-left flex justify-between items-center outline-none; }
.active-tab { @apply bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none translate-x-1; }
.inactive-tab { @apply text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800; }

.year-mini-btn { @apply py-2 text-[12px] font-black rounded-lg transition-all border outline-none text-center; }
.active-year { @apply bg-indigo-600 border-indigo-600 text-white shadow-sm scale-105; }
.inactive-year { @apply bg-white dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-indigo-200; }

.nav-btn { @apply h-8 w-8 flex items-center justify-center rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-500 hover:bg-slate-100 active:scale-90 transition-all; }
.in-range { @apply bg-indigo-600 !important; }
.range-start, .row-edge-left { border-top-left-radius: 999px; border-bottom-left-radius: 999px; }
.range-end, .row-edge-right { border-top-right-radius: 999px; border-bottom-right-radius: 999px; }
.is-start-only .day-content { @apply bg-indigo-600 text-white rounded-full; }
.today-dot { @apply absolute bottom-1.5 w-1 h-1 rounded-full bg-indigo-500; }
.out-of-month { @apply opacity-10 !important; }

.btn-secondary { @apply flex-1 py-3 text-xs font-black rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 hover:bg-slate-100; }
.btn-primary { @apply flex-[1.2] py-3 text-xs font-black rounded-xl bg-indigo-600 text-white shadow-xl shadow-indigo-100 dark:shadow-none disabled:opacity-30 active:scale-95 transition-all; }

.no-scrollbar::-webkit-scrollbar { display: none; }
</style>