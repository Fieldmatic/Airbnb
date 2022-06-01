import axios from "axios";
import inMemoryJwt from "./inMemoryJwtService";

const USER_BASED_REST_API_URL = "http://localhost:8081/api/user";

class UserService {

    updatePassword(passwordData){
        return axios.put(USER_BASED_REST_API_URL + "/changePassword", passwordData,
            {
                headers: {
                    'Authorization':`Bearer ${inMemoryJwt.getToken()}`
                } 
             } )
    }

    saveReason(reason) {
        return axios.post(USER_BASED_REST_API_URL + "/saveDeletionReason", reason,
        {
            headers: {
                'Authorization':`Bearer ${inMemoryJwt.getToken()}`
            } 
         } )
    }

    updateUser(user){
        return axios.put(USER_BASED_REST_API_URL + "/update",user,
        {
            headers: {
                'Authorization':`Bearer ${inMemoryJwt.getToken()}`
            } 
         })
    }

}

export default new UserService()