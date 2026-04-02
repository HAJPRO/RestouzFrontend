// src/utils/useDialogWidth.js
import { ref } from 'vue';

export const dialogWidth = ref("");

// Default breakpoints
const breakpoints = [
  { width: 1600, dialog: 1400 },
  { width: 1200, dialog: 1150 },
  { width: 992,  dialog: 980 },
  { width: 768,  dialog: 750 },
  { width: 480,  dialog: 470 },
  { width: 0,    dialog: 350 }
];

function updateDialogWidth() {
  const w = window.innerWidth;
  for (let bp of breakpoints) {
    if (w > bp.width) {
      dialogWidth.value = bp.dialog;
      break;
    }
  }
}

// Modul yuklanganda bir marta ishga tushadi
updateDialogWidth();
window.addEventListener('resize', updateDialogWidth);

