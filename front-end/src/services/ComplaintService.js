import axios from "axios";
import inMemoryJwt from "./inMemoryJwtService";

const COMPLAINT_BASED_REST_API_URL = "https://airbnbexperiences-springboot.herokuapp.com/api/complaint";


class ComplaintService {
    addComplaint(data){
        return axios.post(COMPLAINT_BASED_REST_API_URL + "/addComplaint", data,
        {
            headers: {
                'Authorization':`Bearer ${inMemoryJwt.getToken()}`
            } 
         })
    }
}


export default new ComplaintService()