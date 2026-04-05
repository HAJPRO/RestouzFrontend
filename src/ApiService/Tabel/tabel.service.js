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
};

// MANA SHU QATORNI QO'SHING
export default TabelService;