import axios from "axios";
import inMemoryJwt from "./inMemoryJwtService";

const BOOKABLE_BASED_REST_API_URL = "https://airbnbexperiences-springboot.herokuapp.com/api/bookable";


class BookableService {

    getBookableAvailable(id){
        return axios.get(BOOKABLE_BASED_REST_API_URL + "/getBookableAvailable/" + id,
        {
            headers: {
                'Authorization':`Bearer ${inMemoryJwt.getToken()}`
            } 
        })
    }

    getBookableReservations(id){
        return axios.get(BOOKABLE_BASED_REST_API_URL + "/getBookableReservations/" + id,
        {
            headers: {
                'Authorization':`Bearer ${inMemoryJwt.getToken()}`
            } 
        })
    }

    getBookableActions(id){
        return axios.get(BOOKABLE_BASED_REST_API_URL + "/getBookableActions/" + id,
        {
            headers: {
                'Authorization':`Bearer ${inMemoryJwt.getToken()}`
            } 
        })
    }

    getRating(id){
        return axios.get(BOOKABLE_BASED_REST_API_URL + "/rating/" + id,
        {
            headers: {
                'Authorization':`Bearer ${inMemoryJwt.getToken()}`
            } 
        })
    }

    getProfilePicture(id) {
        return axios.get(BOOKABLE_BASED_REST_API_URL + "/getProfilePicture/" + id, {responseType: 'blob'})
    }


}


export default new BookableService()