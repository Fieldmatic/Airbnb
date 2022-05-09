import axios from 'axios'

const CLIENT_BASED_REST_API_URL = 'http://localhost:8081/api/clients';

class ClientService {
    
    getClient() {
        return axios.get(CLIENT_BASED_REST_API_URL)
    }

    updateClient(client) {
        return axios.put(CLIENT_BASED_REST_API_URL + "/update" , client)
    }

    saveReason(reason) {
        console.log(reason)
        return axios.post(CLIENT_BASED_REST_API_URL + "/saveDeletionReason", reason)
    }

    addClient(formData){
        return axios.post (CLIENT_BASED_REST_API_URL + "/add", formData)
    }

    getProfilePicture() {
        return axios.get(CLIENT_BASED_REST_API_URL + "/getProfilePicture", {responseType: 'blob'})
    }
}


export default new ClientService();
