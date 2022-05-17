import axios from "axios";

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

    deleteProfile(userId, pdrId, confirmation) {
        return axios.put(ADMIN_BASED_REST_API_URL + "/confirmProfileDeletion/" + userId + "/" + pdrId + "/" + confirmation);
    }
}

export default new InstructorService()