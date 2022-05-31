import axios from "axios";
import inMemoryJwt from "./inMemoryJwtService";

const ACTION_BASED_REST_API_URL = "http://localhost:8081/api/action";


class ActionService {
    addAction(formData){
        return axios.post (ACTION_BASED_REST_API_URL + "/add", formData,
        {
            headers: {
                'Authorization':`Bearer ${inMemoryJwt.getToken()}`
            } 
         })
    }

    getActions(id){
        return axios.get(ACTION_BASED_REST_API_URL + "/getActions/" + id)
    }

}


export default new ActionService()