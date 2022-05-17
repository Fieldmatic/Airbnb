import axios from "axios";

const ACTION_BASED_REST_API_URL = "http://localhost:8081/api/action";


class ActionService {
    addAction(formData){
        return axios.post (ACTION_BASED_REST_API_URL + "/add", formData)
    }

}


export default new ActionService()