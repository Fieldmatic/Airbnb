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

    subscribeOnEntity(id) {
        return axios.put(CLIENT_BASED_REST_API_URL + "/addSub/" + id, id, 
        {
            responseType: 'blob',
            headers: {
                'Authorization':`Bearer ${inMemoryJwt.getToken()}`
            },
         })
    }

    unsubscribeFromEntity(id) {
        return axios.delete(CLIENT_BASED_REST_API_URL + "/deleteSub/" + id, 
        {
            responseType: 'blob',
            headers: {
                'Authorization':`Bearer ${inMemoryJwt.getToken()}`
            },
         })
    }

    isClientSubscribed(id) {
        return axios.get(CLIENT_BASED_REST_API_URL + "/isClientSubscribed/" + id, 
        {
            responseType: 'blob',
            headers: {
                'Authorization':`Bearer ${inMemoryJwt.getToken()}`
            },
         })
    }

    getClientCottages() {
        return axios.get(CLIENT_BASED_REST_API_URL + "/getClientCottageSubscriptions", 
        {
            headers: {
                'Authorization':`Bearer ${inMemoryJwt.getToken()}`
            },
         })
        }

    getClientBoats() {
        return axios.get(CLIENT_BASED_REST_API_URL + "/getClientBoatSubscriptions", 
        {
            headers: {
                'Authorization':`Bearer ${inMemoryJwt.getToken()}`
            },
            })
        }

    getClientAdventures() {
        return axios.get(CLIENT_BASED_REST_API_URL + "/getClientAdventureSubscriptions", 
        {
            headers: {
                'Authorization':`Bearer ${inMemoryJwt.getToken()}`
            },
            })
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
