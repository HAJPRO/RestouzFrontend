import api from "../../helpers/api";

export const TabelService = {

    Create(state) {
        let url = "tabel/create";
        return api.post(url, state);
    },
   
};