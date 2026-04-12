import { defineStore } from "pinia";
import { useToast } from "../../UI/utils/useToast";
import { OrderService } from "../../ApiService/index.service";

export const OrderStore = defineStore('OrderStore', {
  state: () => ({
    // --- FOOD (TAOM) STATE ---
    model: {},
    isModal: false,
    modalAction: '',
    orders: [],
    loading: false,

    
  }),

  getters: {
    
  },

  actions: {
   
    // --- API ACTIONS (FOOD) ---
    async Create(payload, action) {
      const { toast } = useToast();
      this.loading = true;
      try {
        await OrderService.Create(payload, action);
        toast.success("Muvaffaqiyatli!");
        this.isModal = false;
        this.GetAll();
      } catch (error) {
        toast.error(error.response?.data?.message || "Xatolik yuz berdi");
      } finally {
        this.loading = false;
      }
    },

    async GetAll(payload) {
      this.loading = true;
      try {
        const response = await OrderService.GetAll(payload);
        this.orders = response.data.data.data;
      } catch (error) {
        const { toast } = useToast();
        toast.error("Yuklashda xatolik");
      } finally {
        this.loading = false;
      }
    }
  }
});