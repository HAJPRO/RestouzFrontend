import { defineStore } from "pinia";
import { StatisticsService } from "../../../ApiService/index.service";

export const StatisticsStore = defineStore('StatisticsStore', {
  state: () => ({
    loading: false,
    activeFilter: 'Hafta',
    
    // Dashboard asosiy ma'lumotlari
    totalRevenue: 0,
    totalOrders: 0,
    averageCheck: 0,
    
    // To'lov turlari ulushi
    payments: [],
    
    // Grafik ma'lumotlari
    chartData: [],
    
    // Top ro'yxatlar
    topProducts: [],
    topCustomers: [],
    
    lastUpdated: null
  }),

  getters: {
    // Buyurtmalar mavjudligini tekshirish
    hasData: (state) => state.chartData.length > 0,
    
    // Grafik uchun maksimal qiymatni hisoblash (percent uchun kerak bo'lsa)
    maxChartValue: (state) => {
      return state.chartData.length ? Math.max(...state.chartData.map(d => d.value)) : 0;
    }
  },

  actions: {
    /**
     * Barcha statistika ma'lumotlarini parallel yuklash
     */
    async fetchAllStats() {
      this.loading = true;
      try {
        // Bir vaqtning o'zida barcha so'rovlarni yuboramiz (Performance uchun)
        const [dashRes, topSalesRes, topCustRes] = await Promise.all([
          StatisticsService.GetDashboardStats({ period: this.activeFilter }),
          StatisticsService.GetTopSales({ limit: 5 }),
          StatisticsService.GetTopCustomers({ limit: 10 })
        ]);

        // 1. Dashboard va to'lov turlari
        if (dashRes.data.success) {
          const d = dashRes.data.data;
          this.totalRevenue = d.totalRevenue;
          this.totalOrders = d.totalOrders;
          this.averageCheck = d.averageCheck;
          this.payments = d.payments; // Backenddan kelayotgan array
          this.chartData = d.chartData;
        }

        // 2. Top taomlar
        if (topSalesRes.data.success) {
          this.topProducts = topSalesRes.data.data;
        }

        // 3. Top mijozlar
        if (topCustRes.data.success) {
          this.topCustomers = topCustRes.data.data;
        }

        this.lastUpdated = new Date();
      } catch (error) {
        console.error("Statistikalarni yuklashda xatolik:", error);
      } finally {
        this.loading = false;
      }
    },

    /**
     * Filterni o'zgartirish va ma'lumotlarni yangilash
     */
    async setFilter(newFilter) {
      this.activeFilter = newFilter;
      // Filter o'zgarganda faqat dashboard va grafik yangilansa kifoya
      await this.fetchAllStats(); 
    },

    /**
     * Store'ni tozalash (masalan, logout bo'lganda)
     */
    clearStats() {
      this.$reset(); // Pinia-ning o'zini reset qilish funksiyasi
    }
  }
});