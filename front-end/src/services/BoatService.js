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
    updateBoat(boat, id){
        return axios.put(BOAT_BASED_REST_API_URL + "/edit/" + id, boat,
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

    getAllBoatsAdmin() {
        return axios.get(BOAT_BASED_REST_API_URL + "/getAll",
        {
            headers: {
                'Authorization':`Bearer ${inMemoryJwt.getToken()}`
            } 
        });
    }

    getAvailableBoats(searchData) {
        let city = searchData.city
        let capacity = searchData.capacity
        let startDate = searchData.startDate
        let endDate = searchData.endDate
        if (city === "") {
            return axios.get(BOAT_BASED_REST_API_URL + "/allAvailable/" + startDate + "/" + endDate + "/" + capacity)
        }
        else return axios.get(BOAT_BASED_REST_API_URL + "/allAvailableByCityAndCapacity/" + startDate + "/" + endDate + "/" + city + "/" + capacity)
    }

    getNumberOfBoatReviews(id) {
        return axios.get(BOAT_BASED_REST_API_URL + "/reviewsNumber/" + id);
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

    deleteBoat(id){
        return axios.delete(BOAT_BASED_REST_API_URL + "/deleteBoat/" + id, 
        {
            headers: {
                'Authorization':`Bearer ${inMemoryJwt.getToken()}`
            } 
         })
    }

}

export default new BoatService()