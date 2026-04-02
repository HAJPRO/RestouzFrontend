// src/utils/TableOptions/useTableOptions.js
import { ref, onMounted, onBeforeUnmount, computed, reactive, } from "vue";

export const currentTheme = ref(localStorage.getItem("theme") || "light");

window.addEventListener("theme-changed", () => {
  currentTheme.value = localStorage.getItem("theme") || "light";
});

// computed funksiyalar — avtomatik yangilanadi///
export function TableHeaderStyle(options = {}) {
  const darkMode = currentTheme.value === 'dark';

  return {
    background: options.background || (darkMode ? '#C9D4E0' : '#cde7f5'),
    border: options.border || '1px solid #fff',
    color: options.color || '#1E3A8A',
    fontWeight: options.fontWeight || '600',
    textAlign: options.textAlign || 'center',
    fontSize: options.fontSize || '10px',
    ...options.extraStyles, // qo‘shimcha style qo‘shish uchun
  };
}


// Jadval umumiy style
export function TableStyle(options = {}) {
  const darkMode = currentTheme.value === 'dark';

  return {
    width: '100%',
    fontSize: '12px',
    background: options.background || (darkMode ? '#C9D4E0' : '#cde7f5'),
    color: options.color || (darkMode ? '#1E3A8A' : '#ffffff'),
    ...options.extraStyles,
  };
}

// src/utils/formatPrice.js
export const formatPrice = (price) => {
  if (price == null || price === "") return "0"; // null yoki bo'sh bo'lsa

  const num = Number(price);
  if (isNaN(num)) return "0"; // noto‘g‘ri qiymat bo‘lsa

  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};


// Barcha collapsible state'lar
// 🔹 Barcha collapsible state'lar — reactive bo'lishi uchun reactive()
export const opened = reactive({
  comRows: {},
  timeRows: {},
  docTypesRows: {},
  notesRows: {}
});

// 🔹 Universal toggle
export function toggle(section, rowId) {
  if (!opened[section]) {
    console.warn(`Section "${section}" mavjud emas`);
    return;
  }
  const id = String(rowId);
  opened[section][id] = !opened[section][id];
}

// 🔹 Animatsiya funksiyalari
export function enter(el) {
  el.style.height = "0";
  el.style.opacity = "0";
  requestAnimationFrame(() => {
    el.style.transition = "height 0.25s ease, opacity 0.25s ease";
    el.style.height = el.scrollHeight + "px";
    el.style.opacity = "1";
  });
}

export function leave(el) {
  el.style.height = el.scrollHeight + "px";
  el.style.opacity = "1";
  requestAnimationFrame(() => {
    el.style.transition = "height 0.25s ease, opacity 0.25s ease";
    el.style.height = "0";
    el.style.opacity = "0";
  });
}

// composables/useScreen.js

export function useScreen() {
  const width = ref(window.innerWidth);

  const isMobile = ref(false);
  const isTablet = ref(false);
  const isDesktop = ref(false);

  const checkScreen = () => {
    width.value = window.innerWidth;

    if (width.value <= 768) {
      isMobile.value = true;
      isTablet.value = false;
      isDesktop.value = false;
    } else if (width.value > 768 && width.value <= 1024) {
      isMobile.value = false;
      isTablet.value = true;
      isDesktop.value = false;
    } else {
      isMobile.value = false;
      isTablet.value = false;
      isDesktop.value = true;
    }
  };

  onMounted(() => {
    checkScreen();
    window.addEventListener("resize", checkScreen);
  });

  onBeforeUnmount(() => {
    window.removeEventListener("resize", checkScreen);
  });

  return {
    width,
    isMobile,
    isTablet,
    isDesktop,
  };
}




