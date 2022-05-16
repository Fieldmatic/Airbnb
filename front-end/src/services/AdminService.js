import axios from "axios";

const ADMIN_BASED_REST_API_URL = "http://localhost:8081/api/admin";

class InstructorService {

    deleteInstructor(id, data) {
        return axios.post(ADMIN_BASED_REST_API_URL + "/deleteInstructor/" + id + data);
    }
}

export default new InstructorService()