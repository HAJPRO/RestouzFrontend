import { defineStore } from "pinia";
import { useToast } from "../../UI/utils/useToast"; // To'g'ri yo'l ekanligini tekshiring
import { MenuService } from "../../ApiService/index.service"

export const MenuStore = defineStore('MenuStore', {
  state: () => ({
    model : {},
    isModal: false,
    modalAction:'',
    menus: [], // Ma'lumotlarni saqlash uchun
    loading: false
  }),

  actions: {
    async ModalAction(payload) {
      this.modalAction = payload?.action; 
      if(payload?.action === 'edit') {
        const response = await MenuService.GetById(payload.id);
        this.model = response.data.data.data;
        
      }else {
        this.model = {}
      }
      this.isModal = !this.isModal
    },
   

    async Create(payload,action) {
      
      const { toast } = useToast();
      this.loading = true;
      try {
        const response = await MenuService.Create(payload,action);
        const message = response?.data?.message || response?.data?.msg || "Muvaffaqiyatli!";
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
        this.GetAll();

      }
    },
     async GetAll(payload) {
      const { toast } = useToast();
      this.loading = true;
      try {
        const response = await MenuService.GetAll(payload);
        this.menus = response.data.data.data; 
        // Olingan ma'lumotlarni state'ga saqlaymiz
        const message = response?.data?.message || response?.data?.msg || "Muvaffaqiyatli!";
        // toast.success(message);
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
    },
  }
});