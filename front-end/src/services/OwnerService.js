import axios from "axios";
import inMemoryJwt from './inMemoryJwtService';

const OWNER_BASED_REST_API_URL  = "https://airbnbexperiences-springboot.herokuapp.com/api/owner";


class OwnerService {
    getOwner(){
        return axios.get(OWNER_BASED_REST_API_URL + "/getOwner",
        {
            headers: {
                'Authorization':`Bearer ${inMemoryJwt.getToken()}`
            } 
         })
    }

    getInstructor(){
        return axios.get(OWNER_BASED_REST_API_URL + "/getInstructor",
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
    getReservationStatisticsBookable(bookableId){
        return axios.get(OWNER_BASED_REST_API_URL + "/reservationsStatistics/" + bookableId,
        {
            headers: {
                'Authorization':`Bearer ${inMemoryJwt.getToken()}`
            },
         })
    }

    getAverageRating(){
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

    getIncomeStatisticsBookable(start,end,bookableId){
        return axios.get(OWNER_BASED_REST_API_URL + "/incomeStatistics/" + start + "/" + end + "/" + bookableId,
        {
            headers: {
                'Authorization':`Bearer ${inMemoryJwt.getToken()}`
            },
        })  
    }

    getBookableOwner(id){
        return axios.get(OWNER_BASED_REST_API_URL + "/getBookableOwner/" + id)
    }

}


export default new OwnerService()