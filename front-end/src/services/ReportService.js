import axios from "axios";
import inMemoryJwt from "./inMemoryJwtService";

const REPORT_BASED_REST_API_URL = "http://localhost:8081/api/report";


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


}


export default new ReportService()