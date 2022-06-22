import axios from "axios";
import inMemoryJwt from "./inMemoryJwtService";

const REPORT_BASED_REST_API_URL = "https://airbnbexperiences-springboot.herokuapp.com/api/report";


class ReportService {
    addReport(data){
        return axios.post(REPORT_BASED_REST_API_URL + "/addReport", data,
        {
            headers: {
                'Authorization':`Bearer ${inMemoryJwt.getToken()}`
            } 
        })
    }

    findByReservationId(id){
        return axios.get(REPORT_BASED_REST_API_URL + "/getReport/" + id,
        {
            headers: {
                'Authorization':`Bearer ${inMemoryJwt.getToken()}`
            } 
        })
    }

    getAllReports() {
        return axios.get(REPORT_BASED_REST_API_URL + "/getAllReports",
        {
            headers: {
                'Authorization':`Bearer ${inMemoryJwt.getToken()}`
            } 
        })
    }

    async reviewReport(id, penalty, message) {
        return await axios.post(REPORT_BASED_REST_API_URL + "/reviewReport/" + id + "&" + penalty, message,
        {
            headers: {
                'Authorization':`Bearer ${inMemoryJwt.getToken()}`
            } 
        })
    }


}


export default new ReportService()