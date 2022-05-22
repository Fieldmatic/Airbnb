import axios from "axios";
import inMemoryJwt from "./inMemoryJwtService";

const PERIOD_BASED_REST_API_URL = "http://localhost:8081/api/period";


class PeriodService {
    addPeriod(formData){
        return axios.post (PERIOD_BASED_REST_API_URL + "/add", formData,
        {
            headers: {
                'Authorization':`Bearer ${inMemoryJwt.getToken()}`
            } 
         })
    }

}


export default new PeriodService()