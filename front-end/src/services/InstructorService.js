import axios from "axios";
import inMemoryJwt from './inMemoryJwtService';

const INSTRUCTOR_BASED_REST_API_URL = "http://localhost:8081/api/instructor";

class InstructorService {

    getInstructor() {
        return axios.get(INSTRUCTOR_BASED_REST_API_URL + "/get", 
        {
            headers: {
                'Authorization':`Bearer ${inMemoryJwt.getToken()}`
            } 
         })
    }

    updateInstructor(instructor) {
        return axios.put(INSTRUCTOR_BASED_REST_API_URL + "/update", instructor)
    }

    getProfilePicture() {
        return axios.get(INSTRUCTOR_BASED_REST_API_URL + "/getProfilePicture", 
        {
            responseType: 'blob', 
            headers: {
                'Authorization':`Bearer ${inMemoryJwt.getToken()}`
            }
        })
    }

    sendDeletionRequest(data) {
        return axios.post(INSTRUCTOR_BASED_REST_API_URL + "/sendDeletionRequest", data,
        { 
            headers: {
                'Authorization':`Bearer ${inMemoryJwt.getToken()}`
            }
        });
    }
}

export default new InstructorService()