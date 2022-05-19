import axios from "axios";
const BOAT_BASED_REST_API_URL = "http://localhost:8081/api/boat";
import inMemoryJwt from "./inMemoryJwtService";


class BoatService {

    addBoat(formData){
        return axios.post(BOAT_BASED_REST_API_URL + "/add", formData,
        {
            headers: {
                'Authorization':`Bearer ${inMemoryJwt.getToken()}`
            } 
         })
    }

    getBoat(id) {
        return axios.get(BOAT_BASED_REST_API_URL + "/get/" + id, id)
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

    getOwnerBoats(){
        return axios.get(BOAT_BASED_REST_API_URL + "/getOwnerBoats",
        {
            headers: {
                'Authorization':`Bearer ${inMemoryJwt.getToken()}`
            } 
         }
        )
    }

}

export default new BoatService()