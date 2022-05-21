import axios from "axios";
import inMemoryJwt from './inMemoryJwtService';

const ADMIN_BASED_REST_API_URL = "http://localhost:8081/api/admin";

class InstructorService {

    sendDeletionRequest(id, data) {
        return axios.post(ADMIN_BASED_REST_API_URL + "/sendDeletionRequest/" + id, data);
    }

    getProfileDeletionRequests() {
        return axios.get(ADMIN_BASED_REST_API_URL + "/getProfileDeletionRequests");
    }

    getUserProfilePicture(id) {
        return axios.get(ADMIN_BASED_REST_API_URL + "/getUserProfilePicture/" + id, {responseType: 'blob'})
    }

    async deleteProfile(userId, pdrId, confirmation, message) {
        return await axios.put(ADMIN_BASED_REST_API_URL + "/confirmProfileDeletion/" + userId + "/" + pdrId + "/" + confirmation, message);
    }

    getUserRegistrationRequests() {
        return axios.get(ADMIN_BASED_REST_API_URL + "/getUserRegistrationRequests");
    }

    async registrateUser(userId, regId, confirmation, message) {
        return await axios.put(ADMIN_BASED_REST_API_URL + "/registerUser/" + userId + "/" + regId + "/" + confirmation, message);
    }
}

export default new InstructorService()