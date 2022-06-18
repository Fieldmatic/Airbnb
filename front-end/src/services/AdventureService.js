import axios from "axios";
import inMemoryJwt from './inMemoryJwtService';

const ADVENTURE_BASED_REST_API_URL = "http://localhost:8081/api/adventure";

class AdventureService {
    addAdventure(adventure){
        return axios.post(ADVENTURE_BASED_REST_API_URL + "/add", adventure, 
        {
            headers: {
                'Authorization':`Bearer ${inMemoryJwt.getToken()}`
            } 
        });
    }

    getAllAdventures() {
        return axios.get(ADVENTURE_BASED_REST_API_URL + "/all");
    }

    getAllAdventuresAdmin() {
        return axios.get(ADVENTURE_BASED_REST_API_URL + "/getAll",
        {
            headers: {
                'Authorization':`Bearer ${inMemoryJwt.getToken()}`
            } 
        });
    }

    getAvailableAdventures(searchData) {
        let city = searchData.city
        let capacity = searchData.capacity
        let startDate = searchData.startDate
        let endDate = searchData.endDate
        if (city === "") {
            return axios.get(ADVENTURE_BASED_REST_API_URL + "/allAvailable/" + startDate + "/" + endDate + "/" + capacity)
        }
        else return axios.get(ADVENTURE_BASED_REST_API_URL + "/allAvailableByCityAndCapacity/" + startDate + "/" + endDate + "/" + city + "/" + capacity)
    }
    
    getAdventure(id) {
        return axios.get(ADVENTURE_BASED_REST_API_URL + "/get/" + id, id)
    }

    updateAdventure(adventure, id){
        return axios.put(ADVENTURE_BASED_REST_API_URL + "/edit/" + id, adventure)
    }

    getNumberOfAdventureReviews(id) {
        return axios.get(ADVENTURE_BASED_REST_API_URL + "/reviewsNumber/" + id);
    }

    getInstructorAdventures(){
        return axios.get(ADVENTURE_BASED_REST_API_URL + "/getInstructorAdventures",
        {
            headers: {
                'Authorization':`Bearer ${inMemoryJwt.getToken()}`
            } 
         })
    }

    deleteAdventure(id){
        return axios.delete(ADVENTURE_BASED_REST_API_URL + "/deleteAdventure/" + id, 
        {
            headers: {
                'Authorization':`Bearer ${inMemoryJwt.getToken()}`
            } 
         })
    }
}

export default new AdventureService()