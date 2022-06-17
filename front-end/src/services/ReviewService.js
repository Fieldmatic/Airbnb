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

    isOwnerReviewed(id) {
        return axios.get(REVIEW_BASED_REST_API_URL + "/isOwnerReviewed/" + id, 
        {
            headers: {
                'Authorization':`Bearer ${inMemoryJwt.getToken()}`
            },
         })
    }

    isBookableReviewed(id) {
        return axios.get(REVIEW_BASED_REST_API_URL + "/isBookableReviewed/" + id, 
        {
            headers: {
                'Authorization':`Bearer ${inMemoryJwt.getToken()}`
            },
         })
    }

}


export default new ReviewService()