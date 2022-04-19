import axios from "axios";

const ADVENTURE_BASED_REST_API_URL = "http://localhost:8081/api/adventure";

class AdventureService {
    addAdventure(adventure){
        return axios.post(ADVENTURE_BASED_REST_API_URL + "/add", adventure);
    }
}

export default new AdventureService()