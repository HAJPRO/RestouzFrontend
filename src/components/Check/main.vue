<template>
  <ion-page >
    
   <ion-header class="ion-no-border">
  <div class="bg-whit dark:bg-slate-950/70 backdrop-blur-xl pt-safe border-b border-slate-100 dark:border-white/5">
    
    <div class="max-w-full mx-auto px-3 h-12 flex items-center justify-between pt-14 mb-6">
      <div class="flex items-center gap-2"> <button 
          @click="$router.back()" 
          class="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 flex items-center justify-center active:scale-95 transition-all"
        >
          <ion-icon :icon="arrowBackOutline" class="text-lg" />
        </button>

        <h1 class="text-base font-bold text-slate-900 dark:text-white tracking-tight mt-3">
          Xarid cheki sozlamalari 
        </h1>
      </div>
<div class="flex gap-2">
      <button class="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-500 flex items-center justify-center active:scale-95 transition-all">
        <ion-icon :icon="searchOutline" class="text-base" />
      </button>
       <button class="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-500 flex items-center justify-center active:scale-95 transition-all">
        <ion-icon :icon="addCircleOutline" class="text-base" />
      </button>
      </div>
    </div>

    <div class="max-w-md mx-auto px-3 pb-3 mt-1 overflow-x-auto no-scrollbar flex gap-2">
      <button 
        v-for="cat in categories" :key="cat.id"
        @click="activeCategory = cat.id"
        :class="[
          'px-4 py-2 rounded-xl text-[12px] font-semibold whitespace-nowrap transition-all duration-300',
          activeCategory === cat.id 
            ? 'bg-indigo-600 text-white shadow-md' 
            : 'bg-white dark:bg-slate-900 text-slate-400 border border-slate-100 dark:border-white/5'
        ]"
      >
        {{ cat.name }}
      </button>
    </div>
  </div>
    <div class="px-6 pb-4 bg-white dark:bg-slate-950 transition-colors">
        <div class="flex p-1.5 rounded-2xl shadow-inner bg-slate-100 dark:bg-slate-900">
          <button v-for="tab in ['Printer', 'Sozlamalar', 'Preview']" :key="tab" @click="activeTab = tab"
            :class="activeTab === tab ? 'bg-white text-indigo-600 shadow-md dark:bg-slate-800 dark:text-indigo-400' : 'text-slate-500'"
            class="flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
            {{ tab }}
          </button>
        </div>
      </div>
</ion-header>

    <ion-content :fullscreen="true" class="bg-[#F8FAFC] dark:bg-slate-950">
      <div class="p-5 pb-40 space-y-6">

        <div v-if="activeTab === 'Printer'" class="space-y-6 animate__animated animate__fadeIn">
          <div class="flex items-center justify-between px-2">
            <div>
              <h2 class="text-lg font-black dark:text-white text-slate-900">Printerlar</h2>
              <p class="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em]">Qurilmalarni boshqarish</p>
            </div>
            <button @click="startDiscovery" :disabled="isScanning"
              class="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white font-black text-[10px] uppercase shadow-lg shadow-blue-500/30 active:scale-95 disabled:opacity-50 transition-all">
              <ion-icon :icon="refreshOutline" :class="isScanning ? 'animate-spin' : ''"></ion-icon>
              {{ isScanning ? 'Qidirilmoqda' : 'Yangilash' }}
            </button>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div v-for="device in devices" :key="device.id" @click="handleConnection(device)"
              class="relative p-5 rounded-[2.2rem] border-2 transition-all active:scale-95 flex flex-col items-center text-center gap-3 overflow-hidden group"
              :class="connectedDevice?.id === device.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-500' : 'bg-white border-slate-50 dark:bg-slate-900 dark:border-slate-800'">
              
              <div v-if="connectedDevice?.id === device.id" class="absolute top-3 right-3 flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </div>

              <div :class="connectedDevice?.id === device.id ? 'bg-blue-600 text-white shadow-blue-500/40' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'" 
                   class="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-lg transition-all group-hover:scale-110">
                <ion-icon :icon="device.type === 'Bluetooth' ? bluetoothOutline : printOutline"></ion-icon>
              </div>

              <div class="min-w-0 w-full px-1">
                <h4 class="font-black text-[10px] truncate uppercase dark:text-white">{{ device.name || 'Printer' }}</h4>
                <p class="text-[8px] font-bold mt-1 opacity-50 uppercase tracking-widest">{{ device.type }}</p>
              </div>

              <span v-if="isConnecting === device.id" class="text-[8px] font-black text-amber-500 uppercase animate-pulse">Ulanmoqda...</span>
              <span v-else-if="connectedDevice?.id === device.id" class="text-[8px] font-black text-blue-600 uppercase tracking-widest">Ulangan</span>
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'Sozlamalar'" class="space-y-6 animate__animated animate__fadeIn">
          
          <div class="rounded-[2.5rem] p-6 border bg-white border-slate-50 shadow-sm dark:bg-slate-900 dark:border-slate-800">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Logotip</h3>
              <ion-toggle v-model="config.showLogo" mode="ios" color="success"></ion-toggle>
            </div>
            <div @click="triggerLogo" 
              class="border-2 border-dashed rounded-[2rem] p-8 flex flex-col items-center justify-center gap-3 transition-all active:scale-95 bg-slate-50 border-slate-100 dark:bg-slate-950/50 dark:border-slate-800"
              :class="!config.showLogo ? 'opacity-30 grayscale' : ''">
              <template v-if="!config.logo">
                <ion-icon :icon="cloudUploadOutline" class="text-3xl text-blue-500"></ion-icon>
                <span class="text-[9px] font-black text-slate-400 uppercase">Logo Yuklash</span>
              </template>
              <img v-else :src="config.logo" class="max-h-16 object-contain rounded-lg">
            </div>
          </div>

          <div class="rounded-[2.5rem] p-6 border bg-white border-slate-50 shadow-sm dark:bg-slate-900 dark:border-slate-800 space-y-3">
            <div v-for="(label, key) in systemToggles" :key="key" 
              class="flex items-center justify-between p-2 rounded-2xl border bg-slate-50 border-slate-100 dark:bg-slate-800 dark:border-slate-700">
              <span class="text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-300">{{ label }}</span>
              <ion-toggle v-model="config[key]" mode="ios" color="success"></ion-toggle>
            </div>
          </div>

          <div class="rounded-[2.5rem] p-6 border bg-white border-slate-50 shadow-sm dark:bg-slate-900 dark:border-slate-800 space-y-6">
            <div v-for="(field, key) in config.fields" :key="key" class="space-y-2">
              <div class="flex justify-between items-center px-2">
                <label class="text-[9px] font-black uppercase tracking-widest text-slate-500">{{ field.label }}</label>
                 <ion-toggle v-model="field.visible" mode="ios" color="success"></ion-toggle>
              </div>
              
             <Input 
    v-model="field.value" 
    :label="field.label" 
    :disabled="!field.visible" 
    :icon-pre="field.icon" 
    clearable

  />

            </div>
          </div>
        </div>

        <div v-if="activeTab === 'Preview'" class="flex justify-center animate__animated animate__fadeIn">
          <div class="receipt-paper w-full max-w-[340px] bg-white p-6 text-slate-900 font-mono text-[11px] relative shadow-2xl">
             <div class="absolute top-0 left-0 w-full h-1 bg-blue-600"></div>
             
             <div v-if="config.fields.receiptId.visible" class="flex justify-center mb-4 pt-2">
                <span class="bg-slate-900 text-white px-4 py-1 rounded-full text-[8px] font-black">
                  №: {{ config.fields.receiptId.value }}
                </span>
             </div>

             <div v-if="config.showLogo && config.logo" class="flex justify-center mb-4"><img :src="config.logo" class="max-h-12 grayscale"></div>

             <div class="text-center space-y-1">
                <h3 v-if="config.fields.storeName.visible" class="font-black uppercase text-[15px]">{{ config.fields.storeName.value }}</h3>
                <p v-if="config.fields.address.visible" class="text-[9px] opacity-70">{{ config.fields.address.value }}</p>
                
                <div class="flex justify-center gap-4 py-2 border-y border-slate-100 my-2" v-if="config.fields.instagram.visible || config.fields.telegram.visible">
                  <span v-if="config.fields.instagram.visible" class="text-[8px] font-bold">IG: {{ config.fields.instagram.value }}</span>
                  <span v-if="config.fields.telegram.visible" class="text-[8px] font-bold">TG: {{ config.fields.telegram.value }}</span>
                </div>
             </div>

             <div v-if="config.showLines" class="border-b border-dashed border-slate-300 my-4"></div>

       <div class="space-y-3 mb-6 border-b border-slate-100 pb-4">
  <div v-for="item in cartItems" :key="item.id" 
  class="group flex justify-between items-center py-3 border-b border-slate-50 last:border-0 transition-colors hover:bg-slate-50/50">
  
  <div class="flex items-center gap-3 min-w-0">
    <span class="text-[13px] font-semibold text-slate-800 tracking-tight leading-none truncate">
      {{ item.name }}
    </span>
    
    <span class="w-1 h-1 rounded-full bg-slate-200"></span>

    <span class="text-[11px] text-slate-400 font-medium whitespace-nowrap">
      {{ item.quantity }} × {{ formatPrice(item.price) }}
    </span>
  </div>

  <span class="text-[13px] font-bold text-slate-900 tabular-nums">
    {{ formatPrice(item.quantity * item.price) }}
  </span>
</div>
</div>
          <div class="pt-4 border-t-2 border-slate-900">
  <div class="flex justify-between font-black text-[18px]">
    <span>JAMI:</span>
    <span>{{ formatPrice(cartItems.reduce((a, b) => a + (b.price * b.quantity), 0)) }} UZS</span>
  </div>
</div>

             <div v-if="config.showQR" class="mt-8 flex flex-col items-center gap-2 opacity-30">
                <ion-icon :icon="qrCodeOutline" class="text-6xl"></ion-icon>
             </div>

             <div v-if="config.showFiskal" class="mt-6 pt-4 border-t border-slate-100 text-[8px] opacity-40 font-bold uppercase space-y-1">
                <div class="flex justify-between"><span>Soliq ID:</span><span>987654321</span></div>
                <div class="flex justify-between"><span>Fiskal Belgi:</span><span>A1B2C3D4</span></div>
             </div>

             <p class="text-center text-[9px] font-black mt-8 uppercase opacity-30 tracking-widest">{{ config.footerMessage }}</p>
             <div class="absolute bottom-[-10px] left-0 w-full h-[10px] bg-[#F8FAFC] dark:bg-slate-950" style="clip-path: polygon(0 0, 5% 100%, 10% 0, 15% 100%, 20% 0, 25% 100%, 30% 0, 35% 100%, 40% 0, 45% 100%, 50% 0, 55% 100%, 60% 0, 65% 100%, 70% 0, 75% 100%, 80% 0, 85% 100%, 90% 0, 95% 100%, 100% 0);"></div>
          </div>
        </div>
      </div>

    

      <input type="file" ref="fileInput" class="hidden" @change="handleFile" accept="image/*">
    </ion-content>
    <footer>
   <div class="fixed bottom-8 left-0 w-full px-8 z-50">


  <Button 
          class="w-full"            variant="primary" 
            left-icon="fa-solid fa-print" 
            :disabled="!connectedDevice"
           @click="printReceipt"
          >
             {{ connectedDevice ? 'Hozir Chop Etish' : 'Printer Tanlanmagan' }}
          </Button>
</div>
    </footer>
  </ion-page>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonIcon, IonToggle } from '@ionic/vue';
import { moonOutline, sunnyOutline, refreshOutline, bluetoothOutline, printOutline, cloudUploadOutline, qrCodeOutline, searchOutline, addCircleOutline, arrowBackOutline, imageOutline } from 'ionicons/icons';
import {Input,Button} from "../../UI/UI"
// --- STATE ---
const activeTab = ref('Printer');
const isScanning = ref(false);
const isConnecting = ref(null);
const connectedDevice = ref(null);
const devices = ref([]);
const fileInput = ref(null);

const systemToggles = {
  showLines: 'Ajratuvchi chiziqlar',
  showQR: 'QR-Kod ko\'rinishi',
  showFiskal: 'Fiskal ma\'lumotlar'
};

const config = reactive({
  showLogo: true, showLines: true, showQR: true, showFiskal: true,
  logo: null, footerMessage: 'Xaridingiz uchun rahmat!',
  fields: {
    receiptId: { 
        label: 'Chek №', 
        value: '000542', 
        visible: true, 
        icon: 'fa-solid fa-receipt' // Chek ikonkani anglatadi
    },
    storeName: { 
        label: 'Do\'kon nomi', 
        value: 'SAFY MILK EXCLUSIVE', 
        visible: true, 
        icon: 'fa-solid fa-store' // Do'kon binosi
    },
    address: { 
        label: 'Manzil', 
        value: 'Buxoro vil., G\'ijduvon t.', 
        visible: true, 
        icon: 'fa-solid fa-location-dot' // Lokatsiya belgisi
    },
    phone: { 
        label: 'Telefon', 
        value: '+998 90 440 00 00', 
        visible: true, 
        icon: 'fa-solid fa-phone' // Telefon trubkasi
    },
    instagram: { 
        label: 'Instagram', 
        value: '@safy.milk', 
        visible: true, 
        icon: 'fa-brands fa-instagram' // Instagram logosi (brand klassi bilan)
    },
    telegram: { 
        label: 'Telegram', 
        value: '@safymilk_bot', 
        visible: true, 
        icon: 'fa-brands fa-telegram' // Telegram logosi (brand klassi bilan)
    },
}
});

// --- PRINTER LOGIC ---
// --- PRINTER DISCOVERY LOGIC ---
const startDiscovery = async () => {
  if (isScanning.value) return;
  
  isScanning.value = true;
  devices.value = []; // Ro'yxatni tozalash

  // 1. Bluetooth qurilmalarni qidirish (Paired/Juftlangan qurilmalar)
  if (window.bluetoothSerial) {
    window.bluetoothSerial.list((pairedDevices) => {
      pairedDevices.forEach(d => {
        devices.value.push({ 
          id: d.address, // MAC Address
          name: d.name || 'Noma\'lum Printer', 
          type: 'Bluetooth',
          class: d.class 
        });
      });
    }, (err) => console.error("Bluetooth list error:", err));

    // 2. Atrofdagi yangi (Unpaired) qurilmalarni qidirish
    window.bluetoothSerial.discoverUnpaired((unpairedDevices) => {
      unpairedDevices.forEach(d => {
        // Dublikat bo'lmasligi uchun tekshiramiz
        if (!devices.value.find(x => x.id === d.address)) {
          devices.value.push({ 
            id: d.address, 
            name: d.name || 'Yangi qurilma', 
            type: 'Bluetooth' 
          });
        }
      });
    }, (err) => console.error("Discovery error:", err));
  }

  // 3. USB qurilmalarni tekshirish (Capacitor orqali)
  try {
    const usbDevices = await UsbSerial.connectedDevices();
    if (usbDevices && usbDevices.devices) {
      usbDevices.devices.forEach(d => {
        devices.value.push({ 
          id: d.deviceId.toString(), 
          name: d.productName || 'USB Printer', 
          type: 'USB' 
        });
      });
    }
  } catch (e) {
    console.log("USB support not available or no devices");
  }

  // Skanerlashni 5 soniyadan keyin to'xtatamiz
  setTimeout(() => { isScanning.value = false; }, 5000);
};

// --- ULANISH MANTIQI ---
const handleConnection = (device) => {
  isConnecting.value = device.id;

  if (device.type === 'Bluetooth') {
    window.bluetoothSerial.connect(device.id, () => {
      // Muvaffaqiyatli ulanish
      connectedDevice.value = device;
      isConnecting.value = null;
      // Ulangan zahoti sozlamalar oynasiga o'tkazish
      activeTab.value = 'Sozlamalar';
      console.log("Printerga ulanish muvaffaqiyatli!");
    }, (err) => {
      // Xatolik
      isConnecting.value = null;
      alert("Printerga ulanib bo'lmadi: " + err);
    });
  } else if (device.type === 'USB') {
    // USB ulanish kodi
    UsbSerial.openDevice({ deviceId: parseInt(device.id), baudRate: 9600 })
      .then(() => {
        connectedDevice.value = device;
        isConnecting.value = null;
        activeTab.value = 'Sozlamalar';
      })
      .catch(err => {
        isConnecting.value = null;
        alert("USB xatosi: " + err);
      });
  }
}



const triggerLogo = () => fileInput.value.click();
const handleFile = (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (ev) => config.logo = ev.target.result;
    reader.readAsDataURL(file);
  }
};

const printReceipt = async () => {
  if (!connectedDevice.value) {
    alert("Iltimos, avval printerga ulaning!");
    activeTab.value = 'Printer';
    return;
  }

  // ESC/POS Buyruqlari
  const ESC = "\x1B";
  const GS = "\x1D";
  const RESET = ESC + "@";
  const CENTER = ESC + "a" + "\x01";
  const LEFT = ESC + "a" + "\x00";
  const BOLD_ON = ESC + "E" + "\x01";
  const BOLD_OFF = ESC + "E" + "\x00";
  const DOUBLE_SIZE = ESC + "!" + "\x10"; // Balandlikni oshirish, lekin enini me'yorda saqlash
  const NORMAL_SIZE = ESC + "!" + "\x00";
  
  // Xitoycha yozuvni oldini olish uchun (Cyrillic/Latin PC852 yoki CP1251)
  const INIT_CODEPAGE = ESC + "t" + "\x12"; 

  try {
    let printData = RESET + INIT_CODEPAGE;

    // 1. LOGOTIP VA DO'KON NOMI
    printData += CENTER;
    if (config.fields.storeName.visible) {
      // Sarlavha sig'ishi uchun uzunlikni tekshiramiz
      let storeName = config.fields.storeName.value.toUpperCase();
      printData += BOLD_ON + DOUBLE_SIZE + storeName + "\n" + NORMAL_SIZE + BOLD_OFF;
    }

    if (config.fields.address.visible) printData += config.fields.address.value + "\n";
    if (config.fields.phone.visible) printData += "Tel: " + config.fields.phone.value + "\n";
    
    const lineSeparator = "--------------------------------\n"; 
    if (config.showLines) printData += lineSeparator;

    // 2. CHEK MA'LUMOTLARI
    printData += LEFT;
    if (config.fields.receiptId.visible) printData += "CHEK NO: #" + config.fields.receiptId.value + "\n";
    printData += "SANA: " + new Date().toLocaleString('uz-UZ').replace(',', '') + "\n";
    if (config.showLines) printData += lineSeparator;

    // 3. MAHSULOTLAR RO'YXATI
    let subtotal = 0;
    cartItems.value.forEach(item => {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;
      
      // Mahsulot nomi 20 belgidan oshsa, qolganini kesamiz (sig'ishi uchun)
      let name = item.name.toUpperCase();
      if (name.length > 20) name = name.substring(0, 19) + ".";
      
      const priceStr = formatPrice(itemTotal);
      // 32 belgi - nom uzunligi - narx uzunligi = kerakli bo'shliqlar
      const spacesCount = 32 - name.length - priceStr.length;
      const spaces = " ".repeat(Math.max(1, spacesCount));
      
      printData += BOLD_ON + name + spaces + priceStr + "\n" + BOLD_OFF;
      // Miqdori va donasining narxi (kichikroq ko'rinishda pastdan)
      printData += `   ${item.quantity} x ${formatPrice(item.price)}\n`;
    });

    if (config.showLines) printData += lineSeparator;

    // 4. MOLIYAVIY HISOB-KITOB
    let serviceAmt = config.showService ? (subtotal * config.serviceValue) / 100 : 0;
    let discountAmt = config.showDiscount ? (subtotal * config.discountValue) / 100 : 0;
    let grandTotal = subtotal + serviceAmt - discountAmt;

    if (config.showService) {
      const sLabel = `Xizmat (${config.serviceValue}%):`;
      const sVal = formatPrice(serviceAmt);
      printData += sLabel + " ".repeat(Math.max(1, 32 - sLabel.length - sVal.length)) + sVal + "\n";
    }
    if (config.showDiscount) {
      const dLabel = `Chegirma (${config.discountValue}%):`;
      const dVal = "-" + formatPrice(discountAmt);
      printData += dLabel + " ".repeat(Math.max(1, 32 - dLabel.length - dVal.length)) + dVal + "\n";
    }

    // 5. JAMI (Katta va qalin)
    printData += "\n" + CENTER + BOLD_ON + DOUBLE_SIZE;
    printData += "JAMI: " + formatPrice(grandTotal) + " UZS\n";
    printData += NORMAL_SIZE + BOLD_OFF;

    // 6. FOOTER
    printData += "\n" + CENTER + (config.footerMessage || "Xaridingiz uchun rahmat!") + "\n\n\n\n\n";

    // --- YUBORISH ---
    // TextEncoder ishlatamiz, lekin stringni toza ekaniga ishonch hosil qilamiz
    const encoder = new TextEncoder();
    const uint8res = encoder.encode(printData);

    if (connectedDevice.value.type === 'Bluetooth') {
      window.bluetoothSerial.isConnected(() => {
        window.bluetoothSerial.write(uint8res, 
          () => console.log("Chop etildi"), 
          (err) => alert("Bluetooth xatosi: " + err)
        );
      }, () => {
        alert("Printer bilan aloqa uzildi!");
      });
    } else if (connectedDevice.value.type === 'USB') {
      await UsbSerial.write({ data: printData }); 
    }
  } catch (e) {
    alert("Xatolik yuz berdi: " + e.message);
  }
};
const cartItems = ref([
  { id: 1, name: 'Olma', quantity: 1, price: 15000 },
  { id: 2, name: 'Nok', quantity: 2, price: 15000 },
  { id: 3, name: 'Sut Safy 1L', quantity: 5, price: 12000 }
]);

const formatPrice = (value) => {
  return new Intl.NumberFormat('uz-UZ').format(value);
};
onMounted(() => startDiscovery());
</script>

<style scoped>
.dark ion-content { --background: #020617; }
.animate-spin { animation: spin 1s linear infinite; }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.receipt-paper { filter: drop-shadow(0 20px 30px rgba(0,0,0,0.15)); }
</style>