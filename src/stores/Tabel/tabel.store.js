import { defineStore } from "pinia";
import { useToast } from "../../UI/utils/useToast"; // To'g'ri yo'l ekanligini tekshiring
import { TabelService } from "../../ApiService/index.service";

export const TabelStore = defineStore('TabelStore', {
  state: () => ({
    model : {},
    isModal: false,
    isBookingModal: false,
    bookingModel: {},
    tableBookings: [],
    tabels: [], // Ma'lumotlarni saqlash uchun
    loading: false
  }),

  actions: {
    async ModalAction() {
      this.isModal = !this.isModal
      console.log("modal")
    },
   

    async Create(payload) {
      const { toast } = useToast();
      this.loading = true;
      try {
        const response = await TabelService.Create(payload);
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
        this.GetAll()

      }
    },
     async GetAll(payload) {
      const { toast } = useToast();
      this.loading = true;
      try {
        const response = await TabelService.GetAll(payload);
        this.tabels = response.data.data.data; // Olingan ma'lumotlarni state'ga saqlaymiz
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


    // / Booking Modal uchun action
     async BookingModalAction(tabel) {
      this.bookingModel = tabel
      this.isBookingModal = !this.isBookingModal
      console.log("booking modal",tabel)
    },
     async CreateBooking(payload) {
      const { toast } = useToast();
      this.loading = true;
      try {
const respons = await TabelService.CreateBooking(payload);  
        const message = respons?.data?.message || respons?.data?.msg || "Muvaffaqiyatli!";
        // 3. Toast chiqarish
        toast.success(message);
        // Modalni yopish (ixtiyoriy)
        this.isBookingModal = false;
      } catch (error) {
        console.error("Xatolik:", error);

        // Xato xabarini ham toast orqali ko'rsatish
        const errorMsg = error.response?.data?.message || "Xatolik yuz berdi";
        toast.error(errorMsg);
        
      } finally {
        this.loading = false;
        await this.GetAll()

      }
     
  },
  async GetTableBookings(id) {
    try {
      const response = await TabelService.GetTableBookings(id);
      this.tableBookings = response.data.data.data; // Olingan ma'lumotlarni state'ga saqlaymiz
    } catch (error) {
      console.error("Xatolik:", error);
    }
  }

  }
});