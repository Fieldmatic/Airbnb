import axios from "axios";

const COTTAGE_BASED_REST_API_URL = "http://localhost:8081/api/cottage";

class CottageService {
    addCottage(formData){
        return axios.post(COTTAGE_BASED_REST_API_URL + "/add", formData, {
            headers: {
                "Content-Type": undefined
              },
        });
    }

    getAllCottages() {
        return axios.get(COTTAGE_BASED_REST_API_URL + "/all");
    }

    getNumberOfReviews(id) {
        return axios.get(COTTAGE_BASED_REST_API_URL + "/reviewsNumber/" + id);
    }
    
}

export default new CottageService()

