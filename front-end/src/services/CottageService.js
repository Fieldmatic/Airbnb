import axios from "axios";

const COTTAGE_BASED_REST_API_URL = "http://localhost:8081/api/cottage";

class CottageService {
    addCottage(formData){
        return axios.post(COTTAGE_BASED_REST_API_URL + "/add", formData)
    }
    getCottage(id) {
        return axios.get(COTTAGE_BASED_REST_API_URL + "/edit/" + id, id)
    }
    updateCottage(cottage, id){
        return axios.put(COTTAGE_BASED_REST_API_URL + "/edit/" + id, cottage)
    }
}

export default new CottageService()

