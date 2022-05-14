import axios from "axios";
import inMemoryJwt from "./inMemoryJwtService";

const COTTAGE_BASED_REST_API_URL = "http://localhost:8081/api/cottage";

class CottageService {
    addCottage(formData){
        console.log(inMemoryJwt.getToken())
        return axios.post(COTTAGE_BASED_REST_API_URL + "/add", formData, 
        {
           headers: {
               'Authorization':`Bearer ${inMemoryJwt.getToken()}`
           } 
        })
    }
    getCottage(id) {
        return axios.get(COTTAGE_BASED_REST_API_URL + "/edit/" + id, id)
    }
    updateCottage(cottage, id){
        return axios.put(COTTAGE_BASED_REST_API_URL + "/edit/" + id, cottage)
    }

    getAllCottages() {
        return axios.get(COTTAGE_BASED_REST_API_URL + "/all");
    }

    getOwnerCottages(id){
        return axios.get(COTTAGE_BASED_REST_API_URL + "/getOwnerCottages/" + id);
    }

    getNumberOfCottageReviews(id) {
        return axios.get(COTTAGE_BASED_REST_API_URL + "/reviewsNumber/" + id);
    }

    getProfilePicture(id) {
        return axios.get(COTTAGE_BASED_REST_API_URL + "/getProfilePicture/" + id, {responseType: 'blob'})
    }

}

export default new CottageService()

