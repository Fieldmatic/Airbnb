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
    
}

export default new CottageService()

