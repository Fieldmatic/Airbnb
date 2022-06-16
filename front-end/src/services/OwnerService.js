import axios from "axios";
import inMemoryJwt from './inMemoryJwtService';

const OWNER_BASED_REST_API_URL  = "http://localhost:8081/api/owner";


class OwnerService {
    getOwner(){
        return axios.get(OWNER_BASED_REST_API_URL + "/get",
        {
            headers: {
                'Authorization':`Bearer ${inMemoryJwt.getToken()}`
            } 
         })
    }

    getProfilePicture() {
        return axios.get(OWNER_BASED_REST_API_URL + "/getProfilePicture",
        {
            responseType: 'blob',
            headers: {
                'Authorization':`Bearer ${inMemoryJwt.getToken()}`
            },
         })
    }

    getReservationStatistics(){
        return axios.get(OWNER_BASED_REST_API_URL + "/reservationsStatistics",
        {
            headers: {
                'Authorization':`Bearer ${inMemoryJwt.getToken()}`
            },
         })
    }

    getAverageRaiting(){
        return axios.get(OWNER_BASED_REST_API_URL + "/averageRating",
        {
            headers: {
                'Authorization':`Bearer ${inMemoryJwt.getToken()}`
            },
         })      
    }
    getIncomeStatistics(start,end){
        return axios.get(OWNER_BASED_REST_API_URL + "/incomeStatistics/" + start + "/" + end,
        {
            headers: {
                'Authorization':`Bearer ${inMemoryJwt.getToken()}`
            },
        })  
    }

}


export default new OwnerService()