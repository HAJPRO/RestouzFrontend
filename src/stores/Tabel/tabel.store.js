import { defineStore } from "pinia";
import { useToast } from "../../UI/utils/useToast"; // To'g'ri yo'l ekanligini tekshiring
import { TabelService } from "../../ApiService/index.service";

export const TabelStore = defineStore('TabelStore', {
  state: () => ({
    model : {},
    isModal: false,
    modalAction:'',
    isBookingModal: false,
    bookingModel: {},
    tableBookings: [],
    tabels: [], // Ma'lumotlarni saqlash uchun
    loading: false,

    selectedTableNumber : "",
    model_payment:{},
    activeTable : {},
    isPaymentModal:false
  }),

  actions: {
    async ModalAction(payload) {
      this.modalAction = payload?.action; 
      if(payload?.action === 'edit') {
        const response = await TabelService.GetById(payload.id);
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
        const response = await TabelService.Create(payload,action);
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
//Payment Modal
  PaymentModalAction(table) {
    this.activeTable = table;
    const cart = table.cartId;

    // Modelni obyekt strukturasiga moslab tozalaymiz
    this.model_payment = {
      cash: 0,
      card: 0,
      terminal: 0,
      debt: 0,
      note: '',
      // Backend uchun qo'shimcha ma'lumotlar
      tableId: table._id,
      cartId: cart?._id,
      customerId: cart?.customerId?._id || null,
      totalAmount: cart?.finalTotal || 0
    };

    this.isPaymentModal = true;
  },

  async SubmitPayment() {
    try {
      // Backend kutilayotgan formatda payload yuboramiz
      const payload = {
        ...this.model_payment,
        paidAt: new Date(),
      };

      const res = await axios.post('/api/orders/pay', payload);
      
      // Muvaffaqiyatli bo'lsa, stolni stateda tozalaymiz
      if (res.data.success) {
        this.isPaymentModal = false;
        // Stollar ro'yxatini qayta yuklash yoki local o'zgartirish
        await this.fetchTables(); 
      }
    } catch (err) {
      console.error("To'lov xatosi:", err);
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