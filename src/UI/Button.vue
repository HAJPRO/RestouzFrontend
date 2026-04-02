<script setup>
import { computed } from 'vue';

const props = defineProps({
  // 1. Asosiy turlari
  variant: {
    type: String,
    default: 'primary',
    validator: (v) => ['primary', 'info', 'secondary', 'success', 'danger', 'warning', 'dark'].includes(v),
  },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(v),
  },
  // 2. Dizayn
  outline: { // YANGI: Fonsiz, lekin chegarali qilish uchun
    type: Boolean,
    default: false,
  },
  rounded: {
    type: Boolean,
    default: false,
  },
  
  // 3. Funksional
  loading: Boolean,
  disabled: Boolean,
  block: Boolean,
  
  // 4. Link logikasi
  href: String,
  to: [String, Object],
  type: {
    type: String,
    default: 'button',
  },
  
  // 5. Iconlar
  leftIcon: String,
  rightIcon: String,
});

const emit = defineEmits(['click']);

// --- MANTIQ ---
const componentTag = computed(() => {
  if (props.to) return 'router-link';
  if (props.href) return 'a';
  return 'button';
});

// --- STILLAR ---

// 1. Bazaviy (Border default 1px, transparent)
const baseClasses = `
  group relative inline-flex items-center justify-center 
  font-semibold tracking-wide cursor-pointer select-none
  transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]
  focus:outline-none focus:ring-2 focus:ring-offset-2
  disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none disabled:active:scale-100
  active:scale-[0.96] border shadow-sm overflow-hidden
`;

// 2. O'lchamlar
const sizeClasses = {
  sm:  'h-[38px] px-4 text-xs gap-x-1.5 rounded-lg',      // Input small: 38px
  md: 'h-[48px] px-6 text-[13px] gap-x-2 rounded-xl',    // Input middle: 48px
  lg:  'h-[58px] px-8 text-sm gap-x-2.5 rounded-2xl',
};

// 3. RANG PALITRASI (Solid vs Outline)
const getVariantClasses = () => {
  // Agar outline bo'lsa, maxsus stillar, bo'lmasa solid stillar
  const isOutline = props.outline;

  const palettes = {
    primary: {
      solid: `
        border-transparent text-white
        bg-gradient-to-r from-indigo-600 to-indigo-500
        hover:from-indigo-500 hover:to-indigo-600
        shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:shadow-md
        focus:ring-indigo-500
      `,
      outline: `
        bg-transparent border-indigo-600 text-indigo-600
        hover:bg-indigo-50 hover:border-indigo-700 hover:text-indigo-700
        focus:ring-indigo-500 shadow-none
      `
    },
    info: {
      solid: `
        border-transparent text-white
        bg-gradient-to-r from-blue-500 to-blue-400
        hover:from-blue-400 hover:to-blue-500
        shadow-blue-500/30 hover:shadow-blue-500/50 hover:shadow-md
        focus:ring-blue-500
      `,
      outline: `
        bg-transparent border-blue-500 text-blue-500
        hover:bg-blue-50 hover:border-blue-600 hover:text-blue-600
        focus:ring-blue-500 shadow-none
      `
    },
    // DARK VARIANT (Siz so'ragan o'zgarish)
    dark: {
      solid: `
        border-transparent text-white
        bg-slate-900 hover:bg-slate-800
        shadow-slate-900/20 hover:shadow-slate-900/40
        focus:ring-slate-900
      `,
      outline: `
        bg-transparent border-slate-700 text-slate-700
        hover:bg-slate-900 hover:text-white hover:border-slate-900
        focus:ring-slate-900 shadow-none
      `
    },
    success: {
      solid: `
        border-transparent text-white
        bg-gradient-to-r from-emerald-500 to-emerald-400
        hover:from-emerald-400 hover:to-emerald-500
        shadow-emerald-500/30 hover:shadow-emerald-500/50
        focus:ring-emerald-500
      `,
      outline: `
        bg-transparent border-emerald-500 text-emerald-600
        hover:bg-emerald-50 hover:border-emerald-600 hover:text-emerald-700
        focus:ring-emerald-500 shadow-none
      `
    },
    danger: {
      solid: `
        border-transparent text-white
        bg-gradient-to-r from-rose-500 to-rose-400
        hover:from-rose-400 hover:to-rose-500
        shadow-rose-500/30 hover:shadow-rose-500/50
        focus:ring-rose-500
      `,
      outline: `
        bg-transparent border-rose-500 text-rose-600
        hover:bg-rose-50 hover:border-rose-600 hover:text-rose-700
        focus:ring-rose-500 shadow-none
      `
    },
    // Secondary har doim "ghost-like" bo'ladi, shuning uchun solid/outline bir xil bo'lishi mumkin
    secondary: {
      solid: `
        bg-white text-slate-700 border-slate-200 
        hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-200
        focus:ring-slate-200 shadow-slate-200/50
      `,
      outline: `
        bg-transparent border-slate-300 text-slate-600
        hover:bg-slate-100 hover:text-slate-900
        focus:ring-slate-200 shadow-none
      `
    }
  };

  return isOutline ? palettes[props.variant]?.outline : palettes[props.variant]?.solid;
};

// Yakuniy klass yig'uvchi
const buttonClasses = computed(() => {
  return [
    baseClasses,
    sizeClasses[props.size],
    getVariantClasses(), // Yangi funksiya chaqiruvi
    props.rounded ? 'rounded-full' : 'rounded-lg',
    props.block ? 'w-full flex' : '',
    props.loading ? 'cursor-wait' : ''
  ].join(' ');
});

const leftIconAnim = 'transition-transform duration-300 group-hover:-translate-x-0.5';
const rightIconAnim = 'transition-transform duration-300 group-hover:translate-x-0.5';
</script>

<template>
  <component
    :is="componentTag"
    :href="href"
    :to="to"
    :type="!href && !to ? type : undefined"
    :class="buttonClasses"
    :disabled="disabled || loading"
    @click="$emit('click', $event)"
  >
    <i 
      v-if="loading" 
      class="fa-solid fa-circle-notch fa-spin text-[1.1em]"
    ></i>

    <i 
      v-else-if="leftIcon" 
      :class="[leftIcon, 'text-[1.1em]', leftIconAnim]"
    ></i>

    <span :class="{ 'opacity-100': !loading, 'opacity-80': loading }">
      <slot />
    </span>

    <i 
      v-if="rightIcon && !loading" 
      :class="[rightIcon, 'text-[1.1em]', rightIconAnim]"
    ></i>
  </component>
</template>