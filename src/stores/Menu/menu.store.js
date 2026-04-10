import { defineStore } from "pinia";
import { useToast } from "../../UI/utils/useToast";
import { MenuService } from "../../ApiService/index.service";

export const MenuStore = defineStore('MenuStore', {
  state: () => ({
    model: {},
    isModal: false,
    isCartOpen: false,
    modalAction: '',
    menus: [],
    loading: false,

    // --- CART STATE ---
    cartItems: [], // Savatdagi mahsulotlar ro'yxati
    isServiceActive: true, // 10% xizmat haqi holati
    discountPercent: 0, // Chegirma foizi
    selectedTable: null,
    selectedStaff: null,
    orderType: 'table', // 'table' yoki 'takeaway'
    orderComment: '', // Buyurtma uchun izoh
  }),

  getters: {
    // Savatdagi jami mahsulotlar soni
    totalItemsCount: (state) => state.cartItems.reduce((sum, item) => sum + item.quantity, 0),
    
    // Asosiy summa (xizmat va chegirmasiz)
    currentSubtotal: (state) => state.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    
    // Xizmat haqi (10%)
    calculateServiceFee: (state) => state.isServiceActive ? state.currentSubtotal * 0.1 : 0,
    
    // Chegirma summasi
    calculateDiscountAmount: (state) => state.currentSubtotal * (state.discountPercent / 100),
    
    // Yakuniy jami summa
    finalTotal: (state) => (state.currentSubtotal + state.calculateServiceFee) - state.calculateDiscountAmount,

    // Tasdiqlashga tayyormi?
    isReadyToOrder: (state) => {
      const hasItems = state.cartItems.length > 0;
      const hasStaff = state.selectedStaff !== null;
      const hasTable = state.orderType === 'table' ? state.selectedTable !== null : true;
      return hasItems && hasStaff && hasTable;
    }
  },

  actions: {
    // --- CART ACTIONS ---
    
    // Savatga qo'shish yoki sonini o'zgartirish
    addToCart(product) {
      const { toast } = useToast();
      const existingItem = this.cartItems.find(item => item.id === product.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        this.cartItems.push({
          ...product,
          quantity: 1
        });
        toast.success(`${product.name} savatga qo'shildi`);
      }
    },

    updateCartQty(payload) {
      const { id, change } = payload;
      const item = this.cartItems.find(i => i.id === id);
      if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
          this.removeFromCart(id);
        }
      }
    },

    removeFromCart(id) {
      this.cartItems = this.cartItems.filter(i => i.id !== id);
    },

    clearCart() {
      this.cartItems = [];
      this.discountPercent = 0;
      this.orderComment = '';
    },

    toggleService() {
      this.isServiceActive = !this.isServiceActive;
    },

    // --- MODAL ACTIONS ---
    async ModalAction(payload) {
      this.modalAction = payload?.action;
      if (payload?.action === 'edit') {
        const response = await MenuService.GetById(payload.id);
        this.model = response.data.data.data;
      } else {
        this.model = {};
      }
      this.isModal = !this.isModal;
    },

    CardModalAction() {
      this.isCartOpen = !this.isCartOpen;
    },

    // --- API ACTIONS ---
    async Create(payload, action) {
      const { toast } = useToast();
      this.loading = true;
      try {
        const response = await MenuService.Create(payload, action);
        const message = response?.data?.message || "Muvaffaqiyatli!";
        toast.success(message);
        this.isModal = false;
      } catch (error) {
        toast.error(error.response?.data?.message || "Xatolik yuz berdi");
      } finally {
        this.loading = false;
        this.GetAll();
      }
    },

    async GetAll(payload) {
      this.loading = true;
      try {
        const response = await MenuService.GetAll(payload);
        this.menus = response.data.data.data;
      } catch (error) {
        const { toast } = useToast();
        toast.error(error.response?.data?.message || "Yuklashda xatolik");
      } finally {
        this.loading = false;
      }
    }
  }
});