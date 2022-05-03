import axios from "axios";
const BOAT_BASED_REST_API_URL = "http://localhost:8081/api/boat";


class BoatService {

    addBoat(formData){
        return axios.post(BOAT_BASED_REST_API_URL + "/add", formData)
    }

    getAllBoats() {
        return axios.get(BOAT_BASED_REST_API_URL + "/all");
    }

    getNumberOfBoatReviews(id) {
        return axios.get(BOAT_BASED_REST_API_URL + "/reviewsNumber/" + id);
    }

}

export default new BoatService()