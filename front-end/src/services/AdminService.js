import axios from "axios";
import inMemoryJwt from './inMemoryJwtService';

const ADMIN_BASED_REST_API_URL = "https://airbnbexperiences-springboot.herokuapp.com/api/admin";

class InstructorService {

    getAdmin() {
        return axios.get(ADMIN_BASED_REST_API_URL + "/get", 
        {
            headers: {
                'Authorization':`Bearer ${inMemoryJwt.getToken()}`
            } 
        })
    }

    updateAdmin(admin) {
        return axios.put(ADMIN_BASED_REST_API_URL + "/update" , admin,
        {
            headers: {
                'Authorization':`Bearer ${inMemoryJwt.getToken()}`
            } 
        })
    }

    getProfileDeletionRequests() {
        return axios.get(ADMIN_BASED_REST_API_URL + "/getProfileDeletionRequests",
        { 
            headers: {
                'Authorization':`Bearer ${inMemoryJwt.getToken()}`
            }
        });
    }

    getUserProfilePicture(id) {
        return axios.get(ADMIN_BASED_REST_API_URL + "/getUserProfilePicture/" + id, {responseType: 'blob'})
    }

    async deleteProfile(userId, pdrId, confirmation, message) {
        return await axios.put(ADMIN_BASED_REST_API_URL + "/confirmProfileDeletion/" + userId + "&" + pdrId + "&" + confirmation, message,
        {
            headers: {
                'Authorization':`Bearer ${inMemoryJwt.getToken()}`
            }
        });
    }

    getUserRegistrationRequests() {
        return axios.get(ADMIN_BASED_REST_API_URL + "/getUserRegistrationRequests",
        {
            headers: {
                'Authorization':`Bearer ${inMemoryJwt.getToken()}`
            }
        });
    }

    async registrateUser(userId, regId, confirmation, message) {
        return await axios.put(ADMIN_BASED_REST_API_URL + "/registerUser/" + userId + "&" + regId + "&" + confirmation, message,
        {
            headers: {
                'Authorization':`Bearer ${inMemoryJwt.getToken()}`
            }
        });
    }

    
}

export default new InstructorService()