import axios from "axios";
import inMemoryJwt from "./inMemoryJwtService";

const COTTAGE_BASED_REST_API_URL = "https://airbnbexperiences-springboot.herokuapp.com/api/cottage";


class CottageService {
    addCottage(formData){
       
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
        return axios.put(COTTAGE_BASED_REST_API_URL + "/edit/" + id, cottage,
        {
            headers: {
                'Authorization':`Bearer ${inMemoryJwt.getToken()}`
            } 
         })
    }

    getAllCottages() {
        return axios.get(COTTAGE_BASED_REST_API_URL + "/all");
    }

    getAvailableCottages(searchData) {
        let city = searchData.city
        let startDate = searchData.startDate
        let endDate = searchData.endDate
        let capacity = searchData.capacity
        if (city === "") {
            return axios.get(COTTAGE_BASED_REST_API_URL + "/allAvailable/" + startDate + "/" + endDate + "/" + capacity)
        }
        else return axios.get(COTTAGE_BASED_REST_API_URL + "/allAvailableByCity/" + startDate + "/" + endDate + "/" + city + "/" + capacity)
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

