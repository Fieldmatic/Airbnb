import axios from "axios";
import inMemoryJwt from "./inMemoryJwtService";

const BOOKABLE_BASED_REST_API_URL = "http://localhost:8081/api/bookable";


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

}


export default new BookableService()