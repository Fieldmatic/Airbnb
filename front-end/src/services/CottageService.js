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
        return axios.get(COTTAGE_BASED_REST_API_URL + "/get/" + id, id)
    }

    updateCottage(cottage, id){
        return axios.put(COTTAGE_BASED_REST_API_URL + "/edit/" + id, cottage)
    }

    getAllCottages() {
        return axios.get(COTTAGE_BASED_REST_API_URL + "/all");
    }

    getAvailableCottages(searchData) {
        return axios.post(COTTAGE_BASED_REST_API_URL + "/allAvailableByCity",searchData)
    }

    getOwnerCottages(){
        return axios.get(COTTAGE_BASED_REST_API_URL + "/getOwnerCottages",
        {
            headers: {
                'Authorization':`Bearer ${inMemoryJwt.getToken()}`
            } 
         })
    }

    getNumberOfCottageReviews(id) {
        return axios.get(COTTAGE_BASED_REST_API_URL + "/reviewsNumber/" + id);
    }

    getProfilePicture(id) {
        return axios.get(COTTAGE_BASED_REST_API_URL + "/getProfilePicture/" + id, {responseType: 'blob'})
    }

    deleteCottage(id){
        return axios.delete(COTTAGE_BASED_REST_API_URL + "/deleteCottage/" + id, 
        {
            headers: {
                'Authorization':`Bearer ${inMemoryJwt.getToken()}`
            } 
         })
    }

}

export default new CottageService()

