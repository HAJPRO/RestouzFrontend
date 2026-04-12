import { defineStore } from "pinia";
import { useToast } from "../../UI/utils/useToast";
import { MenuService } from "../../ApiService/index.service";

export const MenuStore = defineStore('MenuStore', {
  state: () => ({
    // --- FOOD (TAOM) STATE ---
    model: {},
    isModal: false,
    modalAction: '',
    menus: [],
    loading: false,

    // --- CATEGORY STATE ---
    isCategoryOpen: false, // Kategoriyalar ro'yxati modali (ion-modal)
    isCategoryEditModal: false, // Kategoriya qo'shish/tahrirlash modali
    categoryModalAction: 'create', // 'add' yoki 'edit'
    categoryModel: {
      name: '',
      image: null,
      icon: 'fa-solid fa-utensils'
    },
    categories: [], // API'dan keladigan kategoriyalar

    // --- CART STATE ---
    isCartOpen: false,
    cartItems: [],
    isServiceActive: true,
    discountPercent: 0,
    selectedTable: null,
    selectedStaff: null,
    orderType: 'table',
    orderComment: '',
  }),

  getters: {
    totalItemsCount: (state) => state.cartItems.reduce((sum, item) => sum + item.quantity, 0),
    currentSubtotal: (state) => state.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    calculateServiceFee: (state) => state.isServiceActive ? state.currentSubtotal * 0.1 : 0,
    calculateDiscountAmount: (state) => state.currentSubtotal * (state.discountPercent / 100),
    finalTotal: (state) => (state.currentSubtotal + state.calculateServiceFee) - state.calculateDiscountAmount,
    isReadyToOrder: (state) => {
      const hasItems = state.cartItems.length > 0;
      const hasStaff = state.selectedStaff !== null;
      const hasTable = state.orderType === 'table' ? state.selectedTable !== null : true;
      return hasItems && hasStaff && hasTable;
    }
  },

  actions: {
    // --- CATEGORY ACTIONS ---
    
    // Kategoriya qo'shish yoki tahrirlash modalini ochish
    async openCategoryForm(payload = null) {
      if (payload && payload.id) {
        this.categoryModalAction = 'edit';
        // Agar API'dan olish kerak bo'lsa:
        // const res = await MenuService.GetCategoryById(payload.id);
        // this.categoryModel = res.data;
        this.categoryModel = { ...payload }; // Hozircha borini yuklaymiz
      } else {
        this.categoryModalAction = 'create';
        this.categoryModel = { name: '', image: null, icon: 'fa-solid fa-utensils' };
      }
      this.isCategoryEditModal = true;
    },

    async CreateCategory(payload) {
      const { toast } = useToast();
      this.loading = true;
      try {
        // MenuService ichida CreateCategory metodini ochgan bo'lishingiz kerak
        const response = await MenuService.CreateCategory(payload);
        toast.success(this.categoryModalAction === 'edit' ? "Kategoriya yangilandi" : "Kategoriya qo'shildi");
        this.isCategoryEditModal = false;
        this.GetCategories(); // Ro'yxatni yangilash
      } catch (error) {
        toast.error("Kategoriyani saqlashda xatolik");
      } finally {
        this.loading = false;
        this.GetAllCategories(); 
        this.isCategoryOpen = true; // Kategoriyalar ro'yxatini yangilash
      }
    },

    async GetAllCategories() {
      try {
        const response = await MenuService.GetAllCategories();
        this.categories = response.data.data;
      } catch (error) {
        console.error("Kategoriyalarni yuklashda xatolik");
      }
    },

    async DeleteCategory(id) {
      const { toast } = useToast();
      try {
        await MenuService.DeleteCategory(id);
        toast.success("Kategoriya o'chirildi");
        this.GetCategories();
      } catch (error) {
        toast.error("O'chirishda xatolik yuz berdi");
      }
    },

    // --- FOOD MODAL ACTIONS ---
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
    // --- CART ACTIONS ---
    addToCart(product) {
      const { toast } = useToast();
      const existingItem = this.cartItems.find(item => item.id === product.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        this.cartItems.push({ ...product, quantity: 1 });
        toast.success(`${product.name} savatga qo'shildi`);
      }
    },

    updateCartQty(payload) {
      const { id, change } = payload;
      const item = this.cartItems.find(i => i.id === id);
      if (item) {
        item.quantity += change;
        if (item.quantity <= 0) this.removeFromCart(id);
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
async CreateOrder() {
      const { toast } = useToast();
      
      // 1. Validatsiya: isReadyToOrder getteridan foydalanamiz
      // if (!this.isReadyToOrder) {
      //   toast.error("Iltimos, stol va mas'ul xodimni tanlang!");
      //   return;
      // }

      this.loading = true; // Global loading yoqish

      try {
        // 2. Ma'lumotlarni API formatiga tayyorlash
        const orderData = {
          orderType: this.orderType,
          items: this.cartItems.map(item => ({
            foodId: item.id || item._id, // API-ga qarab
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            totalPrice: item.price * item.quantity
          })),
          subtotal: this.currentSubtotal,
          serviceFee: this.calculateServiceFee,
          discountAmount: this.calculateDiscountAmount,
          finalTotal: this.finalTotal,
          comment: this.orderComment,
          staffId: this.selectedStaff?.id || this.selectedStaff, // Tanlangan ofitsiant
          status: 'pending', // Yangi buyurtma holati
        };

        // 3. Buyurtma turiga qarab qo'shimcha ma'lumotlar
        if (this.orderType === 'table') {
          orderData.tableId = this.selectedTable?.id || this.selectedTable;
        }
console.log(orderData);

        // 4. API-ga yuborish
        const response = await MenuService.CreateOrder(orderData);

        if (response.status === 200 || response.status === 201) {
          toast.success("Buyurtma muvaffaqiyatli qabul qilindi!");
          
          // 5. Muvaffaqiyatli yakundan so'ng tozalash
          this.clearCart();
          this.isCartOpen = false;
          
          // Agar kerak bo'lsa orders ro'yxatini yangilash funksiyasini chaqirish
          // await this.FetchOrders(); 
        }
      } catch (error) {
        // 6. Xatolikni boshqarish
        console.error("Order Submit Error:", error);
        const errorMessage = error.response?.data?.message || "Buyurtmani yuborishda xatolik yuz berdi";
        toast.error(errorMessage);
      } finally {
        this.loading = false; // Loadingni o'chirish
      }
    },
    // --- API ACTIONS (FOOD) ---
    async Create(payload, action) {
      const { toast } = useToast();
      this.loading = true;
      try {
        await MenuService.Create(payload, action);
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
        const response = await MenuService.GetAll(payload);
        this.menus = response.data.data.data;
      } catch (error) {
        const { toast } = useToast();
        toast.error("Yuklashda xatolik");
      } finally {
        this.loading = false;
      }
    }
  }
});