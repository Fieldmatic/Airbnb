import axios from "axios";
import inMemoryJwt from "./inMemoryJwtService";

const RESERVATION_BASED_REST_API_URL = "https://airbnbexperiences-springboot.herokuapp.com/api/reservation";

class ReservationService {

    async addQuickReservation (actionId){
        return await axios.post(RESERVATION_BASED_REST_API_URL + "/addQuick", actionId, 
        {
           headers: {
               'Authorization':`Bearer ${inMemoryJwt.getToken()}`
           } 
        })
    }

    async addReservation(dto){
        return await axios.post(RESERVATION_BASED_REST_API_URL + "/add", dto, 
        {
           headers: {
               'Authorization':`Bearer ${inMemoryJwt.getToken()}`
           } 
        })
    }

    cancelReservation(id){
        return axios.post(RESERVATION_BASED_REST_API_URL + "/cancelReservation/" + id, id,
        {
           headers: {
               'Authorization':`Bearer ${inMemoryJwt.getToken()}`
           } 
        })
    }

    async reserveForClient(reservation, email){
        return await axios.post(RESERVATION_BASED_REST_API_URL + "/reserveForClient/" + email, reservation, 
        {
           headers: {
               'Authorization':`Bearer ${inMemoryJwt.getToken()}`
           } 
        })
    }

    getReservations(){
        return axios.get(RESERVATION_BASED_REST_API_URL + "/getReservations",
        {
            headers: {
                'Authorization':`Bearer ${inMemoryJwt.getToken()}`
            } 
        }
        )
    }

    getFutureReservations(){
        return axios.get(RESERVATION_BASED_REST_API_URL + "/getFutureReservations",
        {
            headers: {
                'Authorization':`Bearer ${inMemoryJwt.getToken()}`
            } 
        }
        )
    }
}


export default new ReservationService()