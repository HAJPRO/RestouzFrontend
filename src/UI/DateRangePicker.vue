<template>
  <div class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px]" @mousedown.self="$emit('close')">
    <div ref="draggableContainer" :style="containerStyle" class="datepicker-card relative flex flex-col md:flex-row w-full max-w-[760px] bg-white dark:bg-[#1a1c23] border border-slate-200 dark:border-slate-800 shadow-2xl rounded-[32px] overflow-hidden select-none">
      
      <div class="w-full md:w-[200px] p-5 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800 flex md:flex-col gap-1.5 overflow-x-auto md:overflow-y-auto no-scrollbar bg-slate-50/50 dark:bg-slate-900/40 relative z-[11]">
        <h3 class="hidden md:block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[2px] mb-4 mt-2 px-3">Filtr</h3>
        <button v-for="filter in quickFilters" :key="filter.label"
                @click="handleFilterClick(filter.value)"
                class="filter-tab-btn"
                :class="activeFilter === filter.value ? 'active-tab' : 'inactive-tab'">
          <span>{{ filter.label }}</span>
          <i v-if="activeFilter === filter.value" class="fas fa-check-circle text-[11px] ml-1"></i>
        </button>
      </div>

      <div class="flex-1 flex flex-col h-full max-h-[85vh] md:max-h-[620px] bg-white dark:bg-[#1a1c23] relative z-[11]">
        <div class="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar p-6 lg:p-8 pt-10">
          
          <div v-if="activeFilter === 'thisYear'" class="mb-6 animate-in fade-in zoom-in-95 duration-300">
            <div class="flex items-center gap-3 mb-4 px-1">
              <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Yilni tanlang</span>
              <div class="h-px flex-1 bg-slate-100 dark:bg-slate-800"></div>
            </div>
            <div class="grid grid-cols-5 sm:grid-cols-6 gap-1.5 max-h-[130px] overflow-y-auto custom-scrollbar pr-1 py-1">
              <button v-for="y in extendedYears" :key="y" 
                      @click="updateSpecificYear(y)"
                      class="mini-grid-btn"
                      :class="selectedSpecificYear === y ? 'active-item' : 'inactive-item'">
                {{ y }}
              </button>
            </div>
          </div>

          <div v-if="activeFilter === 'thisMonth'" class="mb-6 animate-in fade-in zoom-in-95 duration-300">
            <div class="flex items-center gap-3 mb-4 px-1">
              <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Oyni tanlang ({{ viewDate.getFullYear() }})</span>
              <div class="h-px flex-1 bg-slate-100 dark:bg-slate-800"></div>
            </div>
            <div class="grid grid-cols-3 sm:grid-cols-4 gap-2">
              <button v-for="(m, i) in months" :key="m" 
                      @click="updateSpecificMonth(i)"
                      class="mini-grid-btn text-[11px]"
                      :class="selectedSpecificMonth === i ? 'active-item' : 'inactive-item'">
                {{ m }}
              </button>
            </div>
          </div>

          <div class="mt-4">
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

            <div class="grid grid-cols-7 gap-y-1 touch-none" @mouseup="onMouseUp" @touchend="onMouseUp">
              <div v-for="(date, index) in calendarDays" :key="index"
                   :data-date="date.toISOString()"
                   class="day-wrapper relative h-10 flex items-center justify-center cursor-pointer"
                   :class="getRangeClass(date, index)"
                   @mousedown="onMouseDown(date)"
                   @mouseenter="onMouseEnter(date)"
                   @touchstart.prevent="handleTouchStart(date)"
                   @touchmove.prevent="handleTouchMove($event)">
                <div class="day-content relative z-[1] w-8 h-8 flex items-center justify-center text-sm font-bold rounded-full transition-all"
                     :class="getDayStatusClass(date)">
                  {{ date.getDate() }}
                  <span v-if="isToday(date)" class="today-dot"></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="p-6 border-t border-slate-100 dark:border-slate-800/60">
          <div class="flex gap-3">
            <button @click="$emit('close')" class="btn-secondary">Bekor qilish</button>
            <button @click="confirmRange" :disabled="!range.end" class="btn-primary">Qo'llash</button>
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

const viewDate = ref(new Date());
const range = ref({ start: null, end: null });
const activeFilter = ref('today');
const selectedSpecificYear = ref(currentYear);
const selectedSpecificMonth = ref(new Date().getMonth());
const isDraggingRange = ref(false);

const months = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'];
const quickFilters = [{ label: 'Bugun', value: 'today' }, { label: 'Kecha', value: 'yesterday' }, { label: 'Hafta', value: 'thisWeek' }, { label: 'Oy', value: 'thisMonth' }, { label: 'Yil', value: 'thisYear' }];

// Mantiqiy qism: Oy tanlanganda ishlaydi
const updateSpecificMonth = (monthIndex) => {
  selectedSpecificMonth.value = monthIndex;
  const year = viewDate.value.getFullYear();
  
  // Kalendar oynasini o'zgartirish
  viewDate.value = new Date(year, monthIndex, 1);
  
  // Diapazonni avtomatik belgilash (oyning boshidan oxirigacha)
  const firstDay = new Date(year, monthIndex, 1);
  const lastDay = new Date(year, monthIndex + 1, 0, 23, 59, 59);
  range.value = { start: firstDay, end: lastDay };
};

// Yil tanlanganda ishlaydi
const updateSpecificYear = (year) => {
  selectedSpecificYear.value = year;
  viewDate.value = new Date(year, viewDate.value.getMonth(), 1);
  
  const firstDay = new Date(year, 0, 1);
  const lastDay = new Date(year, 11, 31, 23, 59, 59);
  range.value = { start: firstDay, end: lastDay };
};

const handleFilterClick = (type) => {
  activeFilter.value = type;
  const now = new Date();
  if (type === 'thisMonth') {
    updateSpecificMonth(now.getMonth());
  } else if (type === 'thisYear') {
    updateSpecificYear(now.getFullYear());
  } else {
    applyStandardFilter(type);
  }
};

// Qolgan standart mantiqlar (Touch, Mouse events va h.k.)
const applyStandardFilter = (type) => {
  const now = new Date();
  let start = new Date(); let end = new Date();
  start.setHours(0,0,0,0); end.setHours(23,59,59,999);
  if (type === 'yesterday') { start.setDate(now.getDate() - 1); end.setDate(now.getDate() - 1); }
  else if (type === 'thisWeek') { start.setDate(now.getDate() - now.getDay()); end.setDate(now.getDate() + (6 - now.getDay())); }
  range.value = { start, end }; viewDate.value = new Date(start);
};

const handleTouchStart = (date) => onMouseDown(date);
const handleTouchMove = (event) => {
  if (!isDraggingRange.value) return;
  const touch = event.touches[0];
  const element = document.elementFromPoint(touch.clientX, touch.clientY);
  const wrapper = element?.closest('.day-wrapper');
  if (wrapper) {
    const dateStr = wrapper.getAttribute('data-date');
    if (dateStr) onMouseEnter(new Date(dateStr));
  }
};
const onMouseDown = (date) => { isDraggingRange.value = true; activeFilter.value = 'custom'; range.value.start = new Date(date); range.value.end = null; };
const onMouseEnter = (date) => {
  if (!isDraggingRange.value || !range.value.start) return;
  const d = new Date(date);
  if (d < range.value.start) { range.value.end = range.value.start; range.value.start = d; }
  else range.value.end = d;
};
const onMouseUp = () => isDraggingRange.value = false;

const calendarDays = computed(() => {
  const start = new Date(viewDate.value.getFullYear(), viewDate.value.getMonth(), 1);
  start.setDate(start.getDate() - start.getDay());
  return Array.from({ length: 42 }, () => { const d = new Date(start); start.setDate(start.getDate() + 1); return d; });
});

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

const extendedYears = computed(() => {
  const start = 1990;
  return Array.from({ length: currentYear - start + 1 }, (_, i) => start + i).reverse();
});

const isToday = (date) => date.toDateString() === new Date().toDateString();
const prevMonth = () => viewDate.value = new Date(viewDate.value.getFullYear(), viewDate.value.getMonth() - 1, 1);
const nextMonth = () => viewDate.value = new Date(viewDate.value.getFullYear(), viewDate.value.getMonth() + 1, 1);
const confirmRange = () => emit('selected', range.value);

onMounted(() => handleFilterClick('today'));
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { @apply bg-slate-200 dark:bg-slate-700 rounded-full; }

.filter-tab-btn { @apply whitespace-nowrap md:w-full px-4 py-3 text-[12px] font-bold rounded-xl transition-all duration-200 text-left flex justify-between items-center outline-none; }
.active-tab { @apply bg-indigo-600 text-white shadow-lg translate-x-1; }
.inactive-tab { @apply text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800; }

.mini-grid-btn { @apply py-2.5 font-bold rounded-xl transition-all border outline-none text-center text-sm; }
.active-item { @apply bg-indigo-600 border-indigo-600 text-white shadow-md scale-105; }
.inactive-item { @apply bg-slate-50 dark:bg-slate-800/50 border-transparent text-slate-600 dark:text-slate-400 hover:border-indigo-300; }

.nav-btn { @apply h-9 w-9 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 hover:bg-slate-100 active:scale-90 transition-all; }
.in-range { @apply bg-indigo-600 !important; }
.range-start, .row-edge-left { border-top-left-radius: 999px; border-bottom-left-radius: 999px; }
.range-end, .row-edge-right { border-top-right-radius: 999px; border-bottom-right-radius: 999px; }
.is-start-only .day-content { @apply bg-indigo-600 text-white rounded-full shadow-lg; }
.today-dot { @apply absolute bottom-1.5 w-1 h-1 rounded-full bg-indigo-500; }
.out-of-month { @apply opacity-10 !important; }

.btn-secondary { @apply flex-1 py-3.5 text-xs font-black rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 hover:bg-slate-100 transition-all; }
.btn-primary { @apply flex-[1.2] py-3.5 text-xs font-black rounded-xl bg-indigo-600 text-white shadow-xl disabled:opacity-30 active:scale-95 transition-all; }

.no-scrollbar::-webkit-scrollbar { display: none; }
.touch-none { touch-action: none; }
</style>