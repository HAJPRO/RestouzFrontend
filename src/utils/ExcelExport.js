/**
 * Universal Excel yuklab olish funksiyasi
 * @param {Object} response - Axios'dan qaytgan response obyekti
 * @param {String} defaultName - Agar serverdan nom kelmasa, ishlatiladigan nom
 */
export const downloadExcelFile = (response, defaultName = "Hisobot") => {
  if (!response || !response.data) {
    throw new Error("Eksport qilish uchun ma'lumot mavjud emas");
  }

  // 1. Blob yaratish
  const blob = new Blob([response.data], { 
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" 
  });

  // 2. Fayl nomini aniqlash (Content-Disposition dan yoki default)
  let filename = `${defaultName}_${new Date().getTime()}.xlsx`;
  const disposition = response.headers["content-disposition"];
  
  if (disposition && disposition.includes("filename=")) {
    filename = disposition.split("filename=")[1].replace(/["']/g, "").trim();
  }

  // 3. Yuklab olish jarayoni
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();

  // 4. Tozalash
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};