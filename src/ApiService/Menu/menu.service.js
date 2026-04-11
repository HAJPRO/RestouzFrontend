import api from "../../helpers/api";

const MenuService = {
    Create(payload) {
        const url = "menu/create";
        return api.post(url, payload,{
      headers: {
        'Content-Type': 'application/json', // FormData emas, JSON yuboramiz
        'x-tenant-id': localStorage.getItem('companyCode') || 'safymilk'
      }
    });
    },
     GetAll(payload) {
        const url = "menu/all";
        return api.post(url, payload);
    },
        GetById(id) {
        const url = `menu/get/${id}`;
        return api.get(url);
        },

        // --- CATEGORY API ---
    CreateCategory(payload) {
        const url = "menu/category/create";
        return api.post(url, payload,{
      headers: {
        'Content-Type': 'application/json', // FormData emas, JSON yuboramiz
        'x-tenant-id': localStorage.getItem('companyCode') || 'safymilk'
      }
    });
  },
    GetAllCategories() {
        const url = "menu/category/all";
        return api.post(url);
    },
    GetCategoryById(id) {
        const url = `menu/category/get/${id}`;
        return api.get(url);
    },
    DeleteCategory(id) {
        const url = `menu/category/delete/${id}`;
        return api.delete(url);
    }
    

};

// MANA SHU QATORNI QO'SHING
export default MenuService;