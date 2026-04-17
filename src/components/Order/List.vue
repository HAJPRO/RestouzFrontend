<template>
  <ion-page class="bg-slate-50 dark:bg-[#020617]">
    <Header 
      title="Buyurtmalar" 
      searchable 
      v-model="searchQuery" 
      searchPlaceholder="ID, taom yoki izoh..."
    >
      <template #actions>
        <div class="flex gap-2">
                <Button @click="datePicter()"  icon="fas fa-list" size="sm" />
          <div class="relative">
            <Button @click="store_order.isCartOpen = true" icon="fas fa-shopping-basket" size="sm" />
            <span v-if="orders.length" class="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[9px] rounded-full flex items-center justify-center font-black animate-bounce">
              {{ orders.length }}
            </span>
          </div>
        </div>
      </template>
    </Header>

    <ion-content :fullscreen="true" class="ion-padding" id="order-content">
      <GlobalRefresher @refresh="refreshOrders" />
      <LoadingState v-if="loading" />
      <EmptyState 
        v-else-if="filteredOrders.length === 0" 
        title="Buyurtmalar topilmadi" 
        description="Hozircha hech qanday buyurtma mavjud emas."
      />

      <div v-else class="space-y-6 pb-10 mt-3">
        <div 
          v-for="(order, index) in filteredOrders" 
          :key="order._id" 
          class="animate-slide-up"
          :style="{ animationDelay: `${(index % 10) * 0.1}s` }"
        >
          <div class="bg-white dark:bg-slate-900 rounded-[35px] p-5 border border-slate-100 dark:border-white/5 shadow-sm relative overflow-hidden">
            
            <div :class="['absolute top-0 right-0 w-24 h-24 -mr-12 -mt-12 rounded-full opacity-5', order.orderType === 'takeaway' ? 'bg-rose-500' : 'bg-indigo-500']"></div>

            <div class="flex justify-between items-start mb-5 relative z-10">
              <div class="flex items-center gap-3">
                <div :class="['w-12 h-12 rounded-2xl flex items-center justify-center text-lg', order.orderType === 'takeaway' ? 'bg-rose-50 text-rose-600' : 'bg-indigo-50 text-indigo-600']">
                  <i :class="order.orderType === 'takeaway' ? 'fas fa-box-archive' : 'fas fa-utensils'"></i>
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <h3 class="text-sm font-black dark:text-white uppercase tracking-tighter">#{{ order._id.slice(-6) }}</h3>
                    <span v-if="order.tableId" class="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md text-[9px] font-black text-slate-500">STOL: {{ order.tableId.number || 'N/A' }}</span>
                  </div>
                  <p class="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{{ formatDate(order.createdAt) }}</p>
                </div>
              </div>
              <div :class="['px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider', getStatusClass(order.status)]">
                {{ order.status }}
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4 mb-5 border-b border-slate-50 dark:border-white/5 pb-4">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs text-slate-500">
                  <i class="fas fa-user-tie"></i>
                </div>
                <div class="truncate">
                  <p class="text-[8px] font-black text-slate-400 uppercase leading-none mb-1">Ofitsiant</p>
                  <p class="text-[11px] font-bold dark:text-slate-200 truncate">{{ order.staffId?.name || 'Admin' }}</p>
                </div>
              </div>
              <div class="flex items-center gap-2 border-l border-slate-50 dark:border-white/5 pl-4">
                <div class="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-xs text-emerald-600">
                  <i class="fas fa-user text-[10px]"></i>
                </div>
                <div class="truncate">
                  <p class="text-[8px] font-black text-slate-400 uppercase leading-none mb-1">Mijoz</p>
                  <p class="text-[11px] font-bold dark:text-slate-200 truncate">{{ order.clientId?.name || 'Mehmon' }}</p>
                </div>
              </div>
            </div>

            <div class="space-y-3 mb-5">
              <div v-for="item in order.items" :key="item._id" class="flex justify-between items-center">
                <div class="flex items-center gap-3">
                  <span class="w-6 h-6 flex items-center justify-center bg-indigo-50 dark:bg-indigo-500/10 rounded-lg text-[10px] font-black text-indigo-600">
                    {{ item.quantity }}
                  </span>
                  <span class="text-xs font-bold text-slate-700 dark:text-slate-300">{{ item.name }}</span>
                </div>
                <span class="text-xs font-black text-slate-400">{{ item.totalPrice.toLocaleString() }}</span>
              </div>
            </div>

            <div class="bg-slate-50 dark:bg-slate-800/40 rounded-[25px] p-4 space-y-2 mb-5">
              <div class="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <span>Buyurtma</span>
                <span>{{ order.subtotal.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between text-[10px] font-black text-indigo-500 uppercase tracking-widest">
                <span>Xizmat haqi</span>
                <span>+{{ order.serviceFeeAmount.toLocaleString() }}</span>
              </div>
              <div v-if="order.discountAmount > 0" class="flex justify-between text-[10px] font-black text-rose-500 uppercase tracking-widest italic">
                <span>Chegirma</span>
                <span>-{{ order.discountAmount.toLocaleString() }}</span>
              </div>
            </div>

            <div class="flex justify-between items-end">
              <div>
                <p class="text-[9px] font-black text-slate-400 uppercase mb-1">To'lov miqdori</p>
                <div class="flex items-baseline gap-1">
                  <span class="text-2xl font-black dark:text-white tracking-tighter">{{ order.finalTotal.toLocaleString() }}</span>
                  <span class="text-[10px] font-black text-indigo-600 uppercase">UZS</span>
                </div>
              </div>
              <div class="flex gap-2">
                <Button @click="handlePrint(order)" icon="fas fa-print" variant="secondary" class="!rounded-2xl !w-12 !h-12 shadow-sm" />
                <Button @click="handleDetail(order)" icon="fas fa-arrow-right" class="!rounded-2xl !px-6 !h-12 shadow-lg shadow-indigo-100" />
              </div>
            </div>

            <div v-if="order.comment" class="mt-4 pt-3 border-t border-slate-50 dark:border-white/5 italic text-[10px] text-slate-400 flex items-center gap-2">
              <i class="fas fa-comment-dots text-amber-500 text-xs"></i> "{{ order.comment }}"
            </div>
          </div>
        </div>
      </div>

      <ion-infinite-scroll @ionInfinite="loadMore" :disabled="!store_order.hasMore">
        <ion-infinite-scroll-content loading-spinner="crescent" loading-text="Yuklanmoqda..."></ion-infinite-scroll-content>
      </ion-infinite-scroll>
    </ion-content>

    <Footer class="z-50" />
    <div v-if="datePic">
      <DateRangePicker @selected="handleDateFilter" 
        @close="datePic = false" />
        </div>
  </ion-page>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { IonPage, IonContent, IonInfiniteScroll, IonInfiniteScrollContent } from "@ionic/vue";
import { OrderStore } from "../../stores/index.store";
import { storeToRefs } from "pinia";
import { Button, Header, GlobalRefresher, EmptyState, LoadingState,DateRangePicker} from "../../UI/UI";
import Footer from "../../partials/Footer.vue";
import { Haptics, ImpactStyle } from "@capacitor/haptics";

const store_order = OrderStore();
const { orders, loading } = storeToRefs(store_order);

const searchQuery = ref("");
const activeStatus = ref("all");
const datePic = ref(false)
const datePicter = ()=>{
  datePic.value=!datePic.value
}
// 1. Dastlabki yuklash va yangilash
const refreshOrders = async (event) => {
  await Haptics.impact({ style: ImpactStyle.Light });
  await store_order.GetAll(true); // true = listni tozalab qayta yuklash
  if (event) event.target.complete();
};

// 2. Status o'zgarganda filtr va yuklash
const changeStatus = async (status) => {
  activeStatus.value = status;
  await store_order.GetAll(true);
};

// 3. Pastga tushganda ko'proq yuklash (Pagination)
const loadMore = async (event) => {
  await store_order.GetAll(false); // false = mavjud listga qo'shish
  event.target.complete();
};

// Filtrlash (Qidiruv uchun)
const filteredOrders = computed(() => {
  let result = orders.value || [];
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    result = result.filter(o => 
      o._id.toLowerCase().includes(q) || 
      o.comment?.toLowerCase().includes(q) ||
      o.items.some(item => item.name.toLowerCase().includes(q))
    );
  }
  return result;
});

const getStatusClass = (status) => {
  switch (status) {
    case 'pending': return 'bg-amber-100 text-amber-600 border border-amber-200';
    case 'preparing': return 'bg-blue-100 text-blue-600 border border-blue-200';
    case 'completed': return 'bg-emerald-100 text-emerald-600 border border-emerald-200';
    case 'cancelled': return 'bg-rose-100 text-rose-600 border border-rose-200';
    default: return 'bg-slate-100 text-slate-600 border border-slate-200';
  }
};

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleString('uz-UZ', { 
    hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' 
  });
};



const handlePrint = async (orderData, userConfig = null, connectedDevice = null) => {
  const config = userConfig || { fields: { storeName: { value: 'SAFY MILK' } }, footerMessage: 'Rahmat!' };
  
  // 1. STRATEGIYA: Bluetooth yoki USB (Real qurilma ulangan bo'lsa)
  if (connectedDevice && connectedDevice.type) {
    console.log("Mobil Printer orqali chop etish...");
    
    // Sizning ishlayotgan printReceipt kodingizni bu yerga joylaymiz
    const ESC = "\x1B";
    const INIT_CODEPAGE = ESC + "t" + "\x12"; 
    const RESET = ESC + "@";
    const CENTER = ESC + "a" + "\x01";
    
    let printData = RESET + INIT_CODEPAGE + CENTER;
    printData += (config.fields.storeName.value || "SAFY MILK").toUpperCase() + "\n";
    // ... (qolgan mahsulotlar logikasi sizniki bilan bir xil) ...
    printData += "\n\n\n\n\n";

    const encoder = new TextEncoder();
    const uint8res = encoder.encode(printData);

    if (connectedDevice.type === 'Bluetooth' && window.bluetoothSerial) {
      window.bluetoothSerial.write(uint8res, 
        () => console.log("Bluetooth: Chop etildi"), 
        (err) => alert("Bluetooth xatosi: " + err)
      );
      return; // Ishni yakunlash
    } else if (connectedDevice.type === 'USB' && window.UsbSerial) {
      await window.UsbSerial.write({ data: printData });
      return;
    }
  }

  // 2. STRATEGIYA: Web Brauzer (Iframe orqali)
  // Agar printer ulanmagan bo'lsa yoki Webda bo'lsak, shu ishlaydi
  console.log("Brauzer orqali chop etish...");
  
  const printHtml = `
    <html>
      <head>
        <style>
          @page { size: 58mm auto; margin: 0; }
          body { font-family: 'Arial', sans-serif; width: 54mm; padding: 2mm; font-size: 12px; }
          .center { text-align: center; }
          .bold { font-weight: bold; }
          .hr { border-top: 1px dashed #000; margin: 5px 0; }
          .row { display: flex; justify-content: space-between; }
        </style>
      </head>
      <body>
        <div class="center bold">${config.fields.storeName.value}</div>
        <div class="hr"></div>
        ${orderData.items.map(item => `
          <div class="bold">${item.name.toUpperCase()}</div>
          <div class="row">
            <span>${item.quantity} x ${item.price.toLocaleString()}</span>
            <span>${(item.quantity * item.price).toLocaleString()}</span>
          </div>
        `).join('')}
        <div class="hr"></div>
        <div class="row bold">
          <span>JAMI:</span>
          <span>${(orderData.finalTotal || 0).toLocaleString()} UZS</span>
        </div>
        <div class="center" style="margin-top: 15px;">${config.footerMessage}</div>
      </body>
    </html>
  `;

  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  document.body.appendChild(iframe);
  iframe.contentWindow.document.write(printHtml);
  iframe.contentWindow.document.close();

  iframe.onload = () => {
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
    setTimeout(() => iframe.remove(), 1000);
  };
};

/**
 * Termal printerlar uchun Raw Data (ESC/POS) yuborish
 */
const executeRawMobilePrint = async (order, config, device) => {
  const ESC = "\x1B";
  const encoder = new TextEncoder();
  
  let p = ESC + "@"; // Reset
  p += ESC + "t" + "\x12"; // Codepage PC852 (O'zbek/Lotin)
  p += ESC + "a" + "\x01"; // Center
  p += ESC + "E" + "\x01"; // Bold ON
  p += (config.fields?.storeName?.value || "SAFY MILK").toUpperCase() + "\n";
  p += ESC + "E" + "\x00" + "\n"; // Bold OFF
  
  p += ESC + "a" + "\x00"; // Left
  order.items.forEach(item => {
    const name = item.name.toUpperCase().substring(0, 32);
    const details = `${item.quantity} x ${item.price.toLocaleString()}`;
    const total = (item.quantity * item.price).toLocaleString();
    const spaces = " ".repeat(Math.max(1, 32 - details.length - total.length));
    p += `${name}\n${details}${spaces}${total}\n`;
  });
  
  p += "--------------------------------\n";
  p += ESC + "a" + "\x02" + ESC + "E" + "\x01"; // Right + Bold
  p += `JAMI: ${(order.finalTotal || 0).toLocaleString()} UZS\n`;
  p += "\n" + ESC + "a" + "\x01" + config.footerMessage + "\n\n\n\n\n";

  const binary = encoder.encode(p);

  if (device.type === 'Bluetooth' && window.bluetoothSerial) {
    return new Promise((resolve, reject) => {
      window.bluetoothSerial.write(binary, resolve, reject);
    });
  } else if (device.type === 'USB' && window.UsbSerial) {
    return await window.UsbSerial.write({ data: binary });
  }
};

/**
 * Tizim darajasidagi Print oynasini ochish (Web/Mobile)
 */
const executeSystemPrint = (order, config, isMobile) => {
  const html = `
    <html>
      <head>
        <style>
          @page { size: 58mm auto; margin: 0; }
          body { 
            font-family: 'Courier New', monospace; 
            width: 54mm; padding: 4mm 2mm; margin: 0; 
            font-size: 11px; line-height: 1.2;
          }
          .center { text-align: center; }
          .bold { font-weight: bold; }
          .flex { display: flex; justify-content: space-between; }
          .divider { border-top: 1px dashed #000; margin: 5px 0; }
        </style>
      </head>
      <body>
        <div class="center bold" style="font-size: 14px;">${config.fields.storeName.value}</div>
        <div class="divider"></div>
        <div>CHEK: #${order._id?.slice(-6).toUpperCase() || 'YANGI'}</div>
        <div>SANA: ${new Date().toLocaleString('uz-UZ')}</div>
        <div class="divider"></div>
        ${order.items.map(i => `
          <div class="bold">${i.name.toUpperCase()}</div>
          <div class="flex">
            <span>${i.quantity} x ${i.price.toLocaleString()}</span>
            <span>${(i.quantity * i.price).toLocaleString()}</span>
          </div>
        `).join('')}
        <div class="divider"></div>
        <div class="flex bold" style="font-size: 13px;">
          <span>JAMI:</span>
          <span>${(order.finalTotal || 0).toLocaleString()} UZS</span>
        </div>
        <div class="center" style="margin-top: 15px;">${config.footerMessage}</div>
      </body>
    </html>
  `;

  // APK muhiti uchun maxsus tekshiruv
  if (isMobile && window.cordova?.plugins?.printer) {
    window.cordova.plugins.printer.print(html, { name: 'OrderPrint' });
  } else {
    // Web brauzer yoki standart WebView uchun
    const iframe = document.createElement('iframe');
    iframe.style.cssText = "position:fixed;visibility:hidden;bottom:0;right:0;width:0;height:0;";
    document.body.appendChild(iframe);
    
    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(html);
    doc.close();

    iframe.onload = () => {
      // WebView ichida setTimeout juda muhim
      setTimeout(() => {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
        setTimeout(() => iframe.remove(), 2000);
      }, 500);
    };
  }
};

onMounted(() => {
  store_order.GetAll(true);
});
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

.animate-slide-up {
  animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes slideUp {
  from { transform: translateY(50px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
</style>