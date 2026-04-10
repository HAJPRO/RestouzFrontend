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
    

};

// MANA SHU QATORNI QO'SHING
export default MenuService;