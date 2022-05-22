import axios from "axios";

const ACTION_BASED_REST_API_URL = "http://localhost:8081/api/action";


class ActionService {
    addAction(formData){
        return axios.post (ACTION_BASED_REST_API_URL + "/add", formData)
    }

    getActions(id){
        return axios.get(ACTION_BASED_REST_API_URL + "/getActions/" + id, id)
    }

}


export default new ActionService()