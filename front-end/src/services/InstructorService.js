import axios from "axios";

const INSTRUCTOR_BASED_REST_API_URL = "http://localhost:8081/api/instructor";

class InstructorService {
    addInstructor(instructor){
        return axios.post(INSTRUCTOR_BASED_REST_API_URL + "/add", instructor);
    }

    getInstructor(id) {
        return axios.get(INSTRUCTOR_BASED_REST_API_URL + "/edit/" + id, id)
    }

    updateInstructor(instructor, id){
        return axios.put(INSTRUCTOR_BASED_REST_API_URL + "/edit/" + id, instructor)
    }
}

export default new InstructorService()