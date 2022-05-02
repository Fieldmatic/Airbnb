import axios from "axios";

const ADVENTURE_BASED_REST_API_URL = "http://localhost:8081/api/adventure";

class AdventureService {
    addAdventure(adventure){
        return axios.post(ADVENTURE_BASED_REST_API_URL + "/add", adventure);
    }

    getAllAdventures() {
        return axios.get(ADVENTURE_BASED_REST_API_URL + "/all");
    }
}

export default new AdventureService()