import axios from "axios";

const ADVENTURE_BASED_REST_API_URL = "http://localhost:8081/api/adventure";

class AdventureService {
    addAdventure(adventure){
        return axios.post(ADVENTURE_BASED_REST_API_URL + "/add", adventure);
    }

    getAdventure(id) {
        return axios.get(ADVENTURE_BASED_REST_API_URL + "/edit/" + id, id)
    }

    updateAdventure(adventure, id){
        return axios.put(ADVENTURE_BASED_REST_API_URL + "/edit/" + id, adventure)
    }
}

export default new AdventureService()