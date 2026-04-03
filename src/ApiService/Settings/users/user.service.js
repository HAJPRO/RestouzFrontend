import api from "../../../helpers/api";

const UserService = {

    GetAll(data) {
        const url = "setting/user/all";
        return api.post(url, data);
    },

};

export default UserService;