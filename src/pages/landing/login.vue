<!-- <template>
  <ion-page>
    <ion-content class="ion-padding" style="--background: #020617;">
      
      <div class="flex flex-col items-center justify-center min-h-full py-10 px-6">
        
        <div class="mb-12 text-center">
          <div class="inline-block p-4 bg-indigo-600 rounded-2xl shadow-[0_0_20px_rgba(79,70,229,0.5)] mb-6">
            <ion-icon :icon="flame" class="text-4xl text-white"></ion-icon>
          </div>
          <h1 class="text-3xl font-black text-white tracking-tight">
            Resto<span class="text-indigo-500">.uz</span>
          </h1>
          <div class="h-1 w-10 bg-indigo-500 mx-auto mt-2 rounded-full text-center"></div>
        </div>

        <div class="w-full max-w-sm space-y-6">
          
          <div class="space-y-2">
            <label class="text-[10px] font-bold text-indigo-500 uppercase ml-4 tracking-widest text-left block">Login</label>
            <div class="relative group">
              <ion-icon :icon="personOutline" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xl"></ion-icon>
              <input 
                v-model="loginForm.username"
                type="text" 
                placeholder="Loginni kiriting"
                class="w-full py-4 pl-12 pr-4 bg-[#0f172a] border border-slate-800 rounded-2xl text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-inner"
              >
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-[10px] font-bold text-indigo-500 uppercase ml-4 tracking-widest text-left block">Parol</label>
            <div class="relative group">
              <ion-icon :icon="lockClosedOutline" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xl"></ion-icon>
              <input 
                v-model="loginForm.password"
                type="password" 
                placeholder="•••••"
                class="w-full py-4 pl-12 pr-12 bg-[#0f172a] border border-slate-800 rounded-2xl text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-inner"
              >
              <ion-icon :icon="eyeOutline" class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-xl cursor-pointer hover:text-white"></ion-icon>
            </div>
          </div>

          <button 
            @click="handleManualLogin"
            class="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-[0_10px_20px_-5px_rgba(79,70,229,0.6)] active:scale-[0.96] transition-all flex items-center justify-center space-x-2 border-none outline-none cursor-pointer"
          >
            <span>Tizimga kirish</span>
            <ion-icon :icon="arrowForwardOutline"></ion-icon>
          </button>

          <div class="relative flex items-center py-2">
            <div class="flex-grow border-t border-slate-800"></div>
            <span class="flex-shrink mx-4 text-slate-600 text-[10px] font-bold uppercase tracking-widest">yoki</span>
            <div class="flex-grow border-t border-slate-800"></div>
          </div>

          <button 
            @click="handleBiometricLogin" 
            :disabled="isLoading"
            class="w-full py-4 bg-[#1e293b]/50 border border-slate-700 text-white font-bold rounded-2xl hover:bg-[#1e293b] active:scale-[0.96] transition-all flex items-center justify-center space-x-3 backdrop-blur-sm shadow-lg border-none outline-none cursor-pointer"
          >
            <template v-if="!isLoading">
              <ion-icon :icon="fingerPrintOutline" class="text-2xl text-indigo-400"></ion-icon>
              <span>Barmoq izi orqali kirish</span>
            </template>
            <ion-spinner v-else name="crescent" color="primary"></ion-spinner>
          </button>

        </div>

        <div class="mt-auto pt-10 text-center space-y-8">
          <button class="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] hover:text-indigo-400 transition-colors">
            Parolni unutdingizmi????
          </button>

          <div class="flex items-center justify-center space-x-2">
            <div class="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_10px_#10b981]"></div>
            <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Server: Online</span>
          </div>

          <p class="text-[9px] text-slate-700 font-medium uppercase tracking-tighter">
            © 2026 RESTO GLOBAL VERSION 1.0.0
          </p>
        </div>

      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
// Ionic komponentlarini majburiy import qilish
import { IonPage, IonContent, IonIcon, IonSpinner } from '@ionic/vue';
// Ikonkalarni to'g'ri nom bilan import qilish
import { 
  flame, 
  personOutline, 
  lockClosedOutline, 
  eyeOutline, 
  arrowForwardOutline, 
  fingerPrintOutline 
} from 'ionicons/icons';
// Biometrika plagini
import { NativeBiometric } from 'capacitor-native-biometric';

const router = useRouter();
const isLoading = ref(false);

// Input ma'lumotlari uchun obyekt
const loginForm = reactive({
  username: '',
  password: ''
});

// 1. Oddiy login funksiyasi
const handleManualLogin = () => {
  console.log("Oddiy kirish urinishi:", loginForm);
  // Statik ravishda Home sahifasiga o'tkazish
  router.push('/home');
};

// 2. Biometrik login funksiyasi
const handleBiometricLogin = async () => {
  isLoading.value = true;
  try {
    // Telefonda biometrik oynani chiqarish
    const result = await NativeBiometric.verify({
      reason: "RestoApp tizimiga xavfsiz kirish",
      title: "Identifikatsiya",
      subtitle: "Barmoq izingizni tasdiqlang",
      description: "Datchikka teging"
    });

    if (result) {
      console.log("Biometrika muvaffaqiyatli!");
      router.push('/home');
    }
  } catch (error) {
    console.error("Biometrika xatosi (Brauzerda ishlamaydi):", error);
    // TEST UCHUN: Brauzerda xato bersa ham Home-ga o'tkazishni xohlasangiz pastdagini yoqing:
    // router.push('/home');
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* Tugmalar bosilganda vizual effekt */
button:active {
  transform: scale(0.96);
}

/* Chrome va Safari uchun input autofill rangini tozalash */
input:-webkit-autofill,
input:-webkit-autofill:hover, 
input:-webkit-autofill:focus {
  -webkit-text-fill-color: white;
  -webkit-box-shadow: 0 0 0px 1000px #0f172a inset;
  transition: background-color 5000s ease-in-out 0s;
}
</style> -->