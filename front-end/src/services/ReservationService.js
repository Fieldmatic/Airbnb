import axios from "axios";
import inMemoryJwt from "./inMemoryJwtService";

const RESERVATION_BASED_REST_API_URL = "http://localhost:8081/api/reservation";

class ReservationService {
    addQuickReservation (actionId){
        return axios.post(RESERVATION_BASED_REST_API_URL + "/addQuick", actionId, 
        {
           headers: {
               'Authorization':`Bearer ${inMemoryJwt.getToken()}`
           } 
        })
    }
}


export default new ReservationService()