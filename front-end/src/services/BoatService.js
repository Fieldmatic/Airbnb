import axios from "axios";
const BOAT_BASED_REST_API_URL = "http://localhost:8081/api/boat";


class BoatService {

    addBoat(formData){
        return axios.post(BOAT_BASED_REST_API_URL + "/add", formData)
    }


}

export default new BoatService()