import axios from "axios";
const BOAT_BASED_REST_API_URL = "http://localhost:8081/api/boat";


class BoatService {

    addBoat(formData){
        return axios.post(BOAT_BASED_REST_API_URL + "/add", formData)
    }

    getBoat(id) {
        return axios.get(BOAT_BASED_REST_API_URL + "/edit/" + id, id)
    }

    getAllBoats() {
        return axios.get(BOAT_BASED_REST_API_URL + "/all");
    }

    getNumberOfBoatReviews(id) {
        return axios.get(BOAT_BASED_REST_API_URL + "/reviewsNumber/" + id);
    }

    getProfilePicture(id) {
        return axios.get(BOAT_BASED_REST_API_URL + "/getProfilePicture/" + id, {responseType: 'blob'})
    }

}

export default new BoatService()