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
    
    getAdventure(id) {
        return axios.get(ADVENTURE_BASED_REST_API_URL + "/get/" + id, id)
    }

    updateAdventure(adventure, id){
        return axios.put(ADVENTURE_BASED_REST_API_URL + "/edit/" + id, adventure)
    }

    getNumberOfAdventureReviews(id) {
        return axios.get(ADVENTURE_BASED_REST_API_URL + "/reviewsNumber/" + id);
    }

    getProfilePicture(id) {
        return axios.get(ADVENTURE_BASED_REST_API_URL + "/getProfilePicture/" + id, {responseType: 'blob'})
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