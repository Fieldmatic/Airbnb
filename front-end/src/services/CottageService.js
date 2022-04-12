import axios from "axios";

const COTTAGE_BASED_REST_API_URL = "http://localhost:8081/api/cottage";

class CottageService {
    addCottage(cottage){
        return axios.post(COTTAGE_BASED_REST_API_URL + "/add", cottage)
    }
}

export default new CottageService()

