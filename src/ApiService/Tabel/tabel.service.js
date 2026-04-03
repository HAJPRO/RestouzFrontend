import api from "../../helpers/api";

const TabelService = {
    Create(state) {
        const url = "tabel/create";
        return api.post(url, state);
    },
};

// MANA SHU QATORNI QO'SHING
export default TabelService;