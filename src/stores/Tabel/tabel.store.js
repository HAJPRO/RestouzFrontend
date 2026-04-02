import { defineStore } from "pinia";
import { useToast } from "../../UI/utils/useToast"; // To'g'ri yo'l ekanligini tekshiring
import { TabelService } from "../../ApiService/Tabel/tabel.service";

export const TabelStore = defineStore('TabelStore', {
  state: () => ({
    isModal: false,
    tabels: [], // Ma'lumotlarni saqlash uchun
    loading: false
  }),

  actions: {
    async Create() {
      // 1. Toast'ni aynan action ichida chaqiramiz
      const { toast } = useToast();
      
      this.loading = true;
      try {
        const response = await TabelService.Create();
        
        // 2. Natijani tekshirish (Backend res.json({ message: "..." }) qaytaryapti)
        // Odatda axios natijani response.data ichida qaytaradi
        const message = response?.data?.message || response?.data?.msg || "Muvaffaqiyatli!";
        
        console.log("Server javobi:", response.data);
        
        // 3. Toast chiqarish
        toast.success(message);

        // Modalni yopish (ixtiyoriy)
        this.isModal = false;

      } catch (error) {
        console.error("Xatolik:", error);
        
        // Xato xabarini ham toast orqali ko'rsatish
        const errorMsg = error.response?.data?.message || "Xatolik yuz berdi";
        toast.error(errorMsg);
      } finally {
        this.loading = false;
      }
    }
  }
});