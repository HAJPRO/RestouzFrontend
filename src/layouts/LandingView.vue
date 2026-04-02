<template>
  <ion-page>
    <ion-content :force-overscroll="false" class="ion-padding" style="--background: #020617;">
      
      <ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)">
        <ion-refresher-content refreshing-spinner="crescent"></ion-refresher-content>
      </ion-refresher>

      <div class="absolute top-0 left-0 right-0 px-6 z-[100] flex justify-between items-center pt-safe h-24 bg-transparent transition-colors duration-500">
  
  <div class="flex items-center">
    <button 
      id="lang-trigger"
      class="flex items-center space-x-3 px-4 py-2.5 rounded-2xl 
             bg-white/10 dark:bg-white/5 
             backdrop-blur-2xl border 
             border-slate-200 dark:border-white/10 
             shadow-xl dark:shadow-2xl 
             active:scale-95 transition-all duration-300 group"
    >
      <div class="w-5 h-5 rounded-full overflow-hidden border border-slate-300 dark:border-white/20 shadow-inner flex-shrink-0">
        <img :src="getSelectedFlag(currentLang)" class="w-full h-full object-cover" />
      </div>
      
     
      
      <ion-icon :icon="chevronDownOutline" class="text-[10px] text-slate-400 dark:text-slate-500 group-hover:translate-y-0.5 transition-transform"></ion-icon>
    </button>

    <ion-popover trigger="lang-trigger" trigger-action="click" dismiss-on-select="true" mode="ios" class="language-popover">
      <div class="p-2 bg-white/95 dark:bg-[#020617]/95 backdrop-blur-3xl border border-slate-200 dark:border-white/10 rounded-[22px] shadow-3xl space-y-1">
        <button 
          v-for="lang in languages" 
          :key="lang.code"
          @click="setLanguage(lang.code)"
          :class="currentLang === lang.code 
            ? 'bg-indigo-50 dark:bg-indigo-600/20 border-indigo-200 dark:border-indigo-500/30' 
            : 'hover:bg-slate-50 dark:hover:bg-white/5 border-transparent'"
          class="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl border transition-all duration-200"
        >
          <div class="w-6 h-6 rounded-full overflow-hidden border border-slate-200 dark:border-white/10 shadow-md flex-shrink-0">
            <img :src="lang.flag" class="w-full h-full object-cover" />
          </div>
          <div class="flex flex-col items-start flex-grow">
            <span :class="currentLang === lang.code ? 'text-indigo-600 dark:text-white' : 'text-slate-600 dark:text-slate-300'" class="text-[11px] font-bold tracking-wide">
              {{ lang.label }}
            </span>
            <span class="text-[8px] text-slate-400 dark:text-slate-500 uppercase tracking-tighter">{{ lang.native }}</span>
          </div>
          <div v-if="currentLang === lang.code" class="w-5 h-5 flex items-center justify-center bg-indigo-600 dark:bg-indigo-500 rounded-full shadow-lg shadow-indigo-500/40 scale-90">
            <ion-icon :icon="checkmarkOutline" class="text-[10px] text-white"></ion-icon>
          </div>
        </button>
      </div>
    </ion-popover>
  </div>

  <button 
    @click="toggleTheme" 
    class="w-11 h-11 flex items-center justify-center rounded-2xl 
           bg-white/10 dark:bg-white/5 
           backdrop-blur-2xl border 
           border-slate-200 dark:border-white/10 
           shadow-xl dark:shadow-2xl 
           active:scale-90 transition-all duration-500 
           hover:bg-slate-50 dark:hover:bg-white/10"
  >
    <div class="relative w-5 h-5 flex items-center justify-center">
      <transition name="icon-rotate" mode="out-in">
        <ion-icon 
          v-if="isDarkMode" 
          :key="'sun'"
          :icon="sunny" 
          class="text-2xl text-amber-500 dark:text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]"
        ></ion-icon>
        <ion-icon 
          v-else 
          :key="'moon'"
          :icon="moon" 
          class="text-2xl text-indigo-600 dark:text-indigo-400 drop-shadow-[0_0_10px_rgba(129,140,248,0.3)]"
        ></ion-icon>
      </transition>
    </div>
  </button>
</div>

      <div class="flex flex-col items-center justify-center min-h-full py-4 px-6">
        
        <div class="mb-4 text-center animate-fade-in-down">
          <div class="inline-block p-6 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-[2.5rem] shadow-[0_25px_60px_rgba(79,70,229,0.45)] mb-6 transform hover:rotate-6 transition-transform duration-500">
            <ion-icon :icon="restaurant" class="text-6xl text-white"></ion-icon>
          </div>
          <!-- <h1 class="text-4xl font-black text-white tracking-tighter">
            Resto<span class="text-indigo-500">.uz</span>
          </h1> -->
          <!-- <div class="h-1.5 w-12 bg-indigo-500 mx-auto mt-4 rounded-full opacity-60"></div> -->
        </div>

        <div class="w-full max-w-sm space-y-5 animate-slide-up">
          
       <div class="space-y-2.5">
  <label class="text-[10px] font-black text-indigo-500 dark:text-indigo-400 uppercase ml-5 tracking-[0.25em]">
    Foydalanuvchi
  </label>
  <div class="relative group">
    <ion-icon 
      :icon="personOutline" 
      class="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-xl group-focus-within:text-indigo-500 transition-colors"
    ></ion-icon>
    <input 
      v-model="loginForm.username"
      type="text" 
      placeholder="Loginni kiriting"
      class="w-full py-4 pl-14 pr-5 
             bg-slate-100 dark:bg-slate-900/60 
             border border-slate-200 dark:border-slate-800 
             text-slate-900 dark:text-white 
             rounded-[22px] outline-none 
             focus:ring-2 focus:ring-indigo-500/30 dark:focus:ring-indigo-500/50 
             focus:border-indigo-500 transition-all shadow-inner 
             placeholder:text-slate-400 dark:placeholder:text-slate-700"
    >
  </div>
</div>

<div class="space-y-2.5">
  <label class="text-[10px] font-black text-indigo-500 dark:text-indigo-400 uppercase ml-5 tracking-[0.25em]">
Parol
  </label>
  <div class="relative group">
    <ion-icon 
      :icon="lockClosedOutline" 
      class="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-xl group-focus-within:text-indigo-500 transition-colors"
    ></ion-icon>
    <input 
      v-model="loginForm.password"
      :type="showPassword ? 'text' : 'password'" 
      placeholder="••••••••"
      class="w-full py-4 pl-14 pr-14 
             bg-slate-100 dark:bg-slate-900/60 
             border border-slate-200 dark:border-slate-800 
             text-slate-900 dark:text-white 
             rounded-[22px] outline-none 
             focus:ring-2 focus:ring-indigo-500/30 dark:focus:ring-indigo-500/50 
             focus:border-indigo-500 transition-all shadow-inner 
             placeholder:text-slate-400 dark:placeholder:text-slate-700"
    >
    <button 
      @click="showPassword = !showPassword" 
      type="button"
      class="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-indigo-500 dark:hover:text-white transition-colors"
    >
      <ion-icon :icon="showPassword ? eyeOffOutline : eyeOutline" class="text-xl"></ion-icon>
    </button>
  </div>
</div>

          <button 
  @click="handleManualLogin"
  :disabled="isProcessing"
  class="w-full py-5 
         bg-indigo-600 hover:bg-indigo-700 
         text-white font-black rounded-[22px] 
         shadow-[0_20px_40px_-10px_rgba(79,70,229,0.5)] 
         dark:shadow-[0_20px_40px_-10px_rgba(79,70,229,0.7)] 
         active:scale-[0.97] transition-all flex items-center justify-center space-x-3 overflow-hidden"
>
  <template v-if="!isProcessing">
    <span class="tracking-[0.2em] uppercase text-sm">Tizimga kirish</span>
    <ion-icon :icon="arrowForwardOutline" class="text-lg"></ion-icon>
  </template>
  <ion-spinner v-else name="crescent" color="light"></ion-spinner>
</button>

<div class="relative flex items-center py-6 px-2">
  <div class="flex-grow border-t border-slate-200 dark:border-slate-800/60 transition-colors"></div>
  <span class="flex-shrink mx-5 text-slate-400 dark:text-slate-600 text-[10px] font-black uppercase tracking-[0.4em] transition-colors">
    Xavfsiz kirish
  </span>
  <div class="flex-grow border-t border-slate-200 dark:border-slate-800/60 transition-colors"></div>
</div>

<button 
  @click="handleBiometricLogin" 
  :disabled="isLoadingBiometric"
  class="w-full py-4
         bg-slate-100 dark:bg-white/5 
         border border-slate-200 dark:border-white/10 
         text-slate-900 dark:text-white 
         font-bold rounded-[22px] 
         bg-slate-200 dark:hover:bg-white/10 
         active:scale-[0.97] transition-all flex items-center justify-center space-x-3 
         backdrop-blur-xl group"
>
  <template v-if="!isLoadingBiometric">
    <ion-icon 
      :icon="fingerPrintOutline" 
      class="text-2xl text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-300"
    ></ion-icon>
    <span class="text-sm tracking-wide text-slate-700 dark:text-white/80">
      Barmoq izi orqali
    </span>
  </template>
  <ion-spinner v-else name="dots" color="primary"></ion-spinner>
</button>
        </div>

     

      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { 
  IonPage, IonContent, IonIcon, IonSpinner, IonPopover,
  IonRefresher, IonRefresherContent, alertController 
} from '@ionic/vue';
import { 
  restaurant, personOutline, lockClosedOutline, 
  eyeOutline, eyeOffOutline, arrowForwardOutline, 
  fingerPrintOutline, sunny, moon, chevronDownOutline, checkmarkOutline 
} from 'ionicons/icons';

// Native Plugins
import { NativeBiometric } from 'capacitor-native-biometric';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

const router = useRouter();
const isProcessing = ref(false);
const isLoadingBiometric = ref(false);
const showPassword = ref(false);
const isDarkMode = ref(true);
const currentLang = ref('UZ');

// --- Tillar va Bayroqlar logikasi ---
const getFlagPath = (code) => {
  // Vite uchun local assets yo'lini to'g'ri generatsiya qilish
  return new URL(`../../assets/${code.toLowerCase()}.png`, import.meta.url).href;
};

const languages = [
  { code: 'UZ', label: "O'zbekcha", native: 'Uzbekistan', flag: getFlagPath('uz') },
  { code: 'RU', label: 'Русский', native: 'Russia', flag: getFlagPath('ru') },
  { code: 'EN', label: 'English', native: 'United States', flag: getFlagPath('us') }
];

// Tanlangan tilning bayrog'ini olish uchun yordamchi funksiya
const getSelectedFlag = (code) => {
  return languages.find(l => l.code === code)?.flag || '';
};

const loginForm = reactive({
  username: '',
  password: ''
});

// --- Helpers ---
const triggerHaptic = async (style = ImpactStyle.Light) => {
  try { await Haptics.impact({ style }); } catch (e) {
    console.log('Haptics not available');
  }
};

const showAlert = async (header, message, status = 'success') => {
  const alert = await alertController.create({
    header,
    message,
    mode: 'ios',
    buttons: [{
      text: 'OK',
      cssClass: status === 'error' ? 'text-red-500' : 'text-indigo-500'
    }],
  });
  await alert.present();
};

const handleRefresh = (event) => {
  setTimeout(() => { event.target.complete(); }, 1500);
};

// --- Actions ---
const setLanguage = async (lang) => {
  await triggerHaptic();
  currentLang.value = lang;
};

const toggleTheme = async () => {
  await triggerHaptic();
  isDarkMode.value = !isDarkMode.value;
  document.documentElement.classList.toggle('dark', isDarkMode.value);
};

const handleManualLogin = async () => {
  if (!loginForm.username || !loginForm.password) {
    await triggerHaptic(ImpactStyle.Medium);
    return showAlert("Xatolik", "Barcha maydonlarni to'ldiring", 'error');
  }
  
  isProcessing.value = true;
  await triggerHaptic(ImpactStyle.Medium);
  
  // API Call Simulation
  setTimeout(() => {
    isProcessing.value = false;
    router.push('/explore/home');
  }, 1500);
};

const handleBiometricLogin = async () => {
  isLoadingBiometric.value = true;
  await triggerHaptic(ImpactStyle.Light);
  
  try {
    const result = await NativeBiometric.isAvailable();
    if (!result.isAvailable) throw new Error("Biometrika mavjud emas");

    const verified = await NativeBiometric.verify({
      reason: "Xavfsiz kirish uchun shaxsingizni tasdiqlang",
      title: "Resto.uz Xavfsizlik",
      subtitle: "Biometrik kirish",
      description: "Barmog'ingizni datchikka qo'ying"
    });

    if (verified) {
      await triggerHaptic(ImpactStyle.Heavy);
      router.push('/explore/home');
    }
  } catch (error) {
    // Web muhitda test qilish uchun fallback
    if (error.message?.includes("not implemented") || error.message?.includes("web")) {
      console.warn("Biometrika faqat real qurilmada ishlaydi");
      setTimeout(() => { router.push('/explore/home'); }, 1000);
    } else {
      await showAlert("Xato", "Biometrik identifikatsiya amalga oshmadi.", 'error');
    }
  } finally {
    setTimeout(() => { isLoadingBiometric.value = false; }, 500);
  }
};
</script>

<style scoped>
/* 🎨 UI Animations */
.animate-slide-up {
  animation: slideUp 0.8s cubic-bezier(0.2, 1, 0.2, 1) forwards;
}

.animate-fade-in-down {
  animation: fadeInDown 0.7s ease-out forwards;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-25px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 🌓 Icon Rotate Animation */
.icon-rotate-enter-active,
.icon-rotate-leave-active {
  transition: all 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.icon-rotate-enter-from { opacity: 0; transform: rotate(-120deg) scale(0.4); }
.icon-rotate-leave-to { opacity: 0; transform: rotate(120deg) scale(0.4); }

/* 📱 Popover (Dropdown) Customizing */
.language-popover {
  --background: transparent;
  --box-shadow: none;
  --width: 190px;
}

.language-popover::part(content) {
  border-radius: 28px;
  background: rgba(2, 6, 23, 0.88);
  backdrop-filter: blur(25px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.8);
  overflow: hidden;
}

/* 🛠 Utility */
.pt-safe {
  padding-top: env(safe-area-inset-top);
}

input:-webkit-autofill {
  -webkit-text-fill-color: white !important;
  -webkit-box-shadow: 0 0 0px 1000px #0f172a inset !important;
  transition: background-color 5000s ease-in-out 0s;
}

button:active {
  transform: scale(0.96);
}
</style>