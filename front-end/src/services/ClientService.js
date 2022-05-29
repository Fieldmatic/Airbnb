import axios from 'axios'
import inMemoryJwt from './inMemoryJwtService';

const CLIENT_BASED_REST_API_URL = 'http://localhost:8081/api/clients';

class ClientService {
    
    getClient() {
        return axios.get(CLIENT_BASED_REST_API_URL + "/get", 
            {
                headers: {
                    'Authorization':`Bearer ${inMemoryJwt.getToken()}`
                } 
             })
    }

    updateClient(client) {
        return axios.put(CLIENT_BASED_REST_API_URL + "/update" , client)
    }

    getProfilePicture() {
        return axios.get(CLIENT_BASED_REST_API_URL + "/getProfilePicture",
        {
            responseType: 'blob',
            headers: {
                'Authorization':`Bearer ${inMemoryJwt.getToken()}`
            },
         })
    }

    getClientProfilePicture(id) {
        return axios.get(CLIENT_BASED_REST_API_URL + "/getClientProfilePicture/" + id,
        {
            responseType: 'blob',
            headers: {
                'Authorization':`Bearer ${inMemoryJwt.getToken()}`
            },
         })
    }

    getClientBasicInfo(id){
        return axios.get(CLIENT_BASED_REST_API_URL + "/getClientBasicInfo/" + id,
        {
            headers: {
                'Authorization':`Bearer ${inMemoryJwt.getToken()}`
            },
         })
    }
}


export default new ClientService();
