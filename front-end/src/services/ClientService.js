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
}


export default new ClientService();
