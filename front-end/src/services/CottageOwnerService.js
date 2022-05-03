import axios from "axios";

const COTTAGEOWNER_BASED_REST_API_URL = "http://localhost:8081/api/cottageOwner";


class CottageOwnerService {
    addCottageOwner(formData){
        return axios.post (COTTAGEOWNER_BASED_REST_API_URL + "/add", formData)
    }

}


export default new CottageOwnerService()