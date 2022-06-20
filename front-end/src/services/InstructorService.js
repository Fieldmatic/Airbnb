import axios from "axios";
import inMemoryJwt from './inMemoryJwtService';

const INSTRUCTOR_BASED_REST_API_URL = "https://airbnbexperiences-springboot.herokuapp.com/api/instructor";

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
        return axios.put(INSTRUCTOR_BASED_REST_API_URL + "/update", instructor,
        {
            headers: {
                'Authorization':`Bearer ${inMemoryJwt.getToken()}`
            } 
        })
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