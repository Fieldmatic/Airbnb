import axios from "axios";
import inMemoryJwt from "./inMemoryJwtService";

const REVIEW_BASED_REST_API_URL = "http://localhost:8081/api/review";


class ReviewService {
    addReview(data){
        return axios.post(REVIEW_BASED_REST_API_URL + "/addReview", data,
        {
            headers: {
                'Authorization':`Bearer ${inMemoryJwt.getToken()}`
            } 
         })
    }
}


export default new ReviewService()