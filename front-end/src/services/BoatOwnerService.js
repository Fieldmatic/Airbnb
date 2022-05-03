import axios from "axios";

const BOATOWNER_BASED_REST_API_URL = "http://localhost:8081/api/boatOwner";


class BoatOwnerService {
    addBoatOwner(formData){
        return axios.post (BOATOWNER_BASED_REST_API_URL + "/add", formData)
    }

}


export default new BoatOwnerService()