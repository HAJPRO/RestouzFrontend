import api from "../../helpers/api";

const TabelService = {
    Create(payload) {
        const url = "tabel/create";
        return api.post(url, payload);
    },
     GetAll(payload) {
        const url = "tabel/all";
        return api.post(url, payload);
    },

    ///Booking Modal uchun service
        CreateBooking(payload) {
        const url = `tabel/booking/create/${payload._id}`;
        return api.post(url, payload);
    },
        GetTableBookings(id) {
        const url = `tabel/booking/get/${id}`;
        return api.get(url);
        }

};

// MANA SHU QATORNI QO'SHING
export default TabelService;