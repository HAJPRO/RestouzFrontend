<script setup>
/**
 * LoadingState.vue - Ma'lumotlar serverdan yuklanayotgan vaqtdagi premium holat.
 */
const props = defineProps({
  title: { type: String, default: "Ma'lumotlar yuklanmoqda..." },
  description: { type: String, default: "Iltimos, biroz kutib turing, server bilan aloqa o'rnatilmoqda." }
});
</script>

<template>
  <div class="loading-state-container">
    <div class="relative z-10 w-full max-w-2xl mx-auto flex flex-col items-center">
      
      <div class="visual-wrapper group">
        <div class="loader-ring"></div>
        <div class="loader-ring-reverse"></div>
        
        <div class="main-card animate-pulse-fast">
          <i class="fa-solid fa-cloud-arrow-down text-5xl md:text-6xl text-indigo-600 dark:text-indigo-400"></i>
        </div>

        <div class="absolute -top-4 -right-4 animate-bounce-slow">
           <div class="w-4 h-4 bg-amber-400 rounded-full blur-[2px]"></div>
        </div>
        <div class="absolute -bottom-4 -left-4 animate-bounce-delayed">
           <div class="w-3 h-3 bg-indigo-400 rounded-full blur-[2px]"></div>
        </div>
      </div>

      <div class="content-wrapper">
        <h3 class="title-text animate-text-shimmer">
          {{ title }}
        </h3>
        
        <p class="description-text">
          {{ description }}
        </p>

        <div class="w-64 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mt-6 border border-white/10">
          <div class="progress-fill"></div>
        </div>

        <div class="mt-4 flex items-center gap-2 text-indigo-500/60 dark:text-indigo-400/60 font-bold text-[10px] uppercase tracking-[0.3em]">
           <span class="dot-loading">Tizim tayyorlanmoqda</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.loading-state-container {
  @apply relative flex items-center justify-center w-full overflow-hidden;
  min-height: clamp(400px, 60vh, 700px);
}

.visual-wrapper {
  @apply relative flex items-center justify-center mb-10;
  width: clamp(160px, 25vw, 240px);
  height: clamp(160px, 25vw, 240px);
}

/* Aylanuvchi xalqalar */
.loader-ring {
  @apply absolute inset-0 border-[3px] border-transparent border-t-indigo-600 border-r-indigo-600 rounded-full;
  animation: spin 1.5s linear infinite;
}

.loader-ring-reverse {
  @apply absolute inset-4 border-[2px] border-transparent border-b-purple-500 border-l-purple-500 rounded-full opacity-40;
  animation: spin-reverse 2s linear infinite;
}

.main-card {
  @apply relative z-10 flex items-center justify-center w-[60%] h-[60%] 
         bg-white/50 dark:bg-slate-900/50 backdrop-blur-2xl 
         rounded-[35px] border border-white dark:border-white/10 
         shadow-2xl;
}

/* Yuklanish chizig'i animatsiyasi */
.progress-fill {
  @apply h-full bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-600;
  width: 50%;
  animation: progress-move 2s infinite ease-in-out;
}

/* Typography */
.content-wrapper {
  @apply text-center px-4 flex flex-col items-center;
}

.title-text {
  @apply font-black text-slate-800 dark:text-white leading-tight mb-3 tracking-tighter;
  font-size: clamp(1.25rem, 3vw, 2rem);
}

.animate-text-shimmer {
  background: linear-gradient(90deg, #4f46e5, #a855f7, #4f46e5);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer-text 3s linear infinite;
}

.description-text {
  @apply text-slate-400 dark:text-slate-500 max-w-xs mx-auto text-sm font-medium;
}

/* Custom Animations */
@keyframes spin { 100% { transform: rotate(360deg); } }
@keyframes spin-reverse { 100% { transform: rotate(-360deg); } }

@keyframes progress-move {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(200%); }
}

@keyframes shimmer-text {
  to { background-position: 200% center; }
}

.animate-pulse-fast {
  animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(0.95); }
}

.animate-bounce-delayed {
  animation: bounce 3s ease-in-out 1.5s infinite;
}
</style>