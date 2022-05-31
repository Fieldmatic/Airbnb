import axios from "axios";

const ADVENTURE_BASED_REST_API_URL = "http://localhost:8081/api/adventure";

class AdventureService {
    addAdventure(adventure){
        return axios.post(ADVENTURE_BASED_REST_API_URL + "/add", adventure);
    }

    getAllAdventures() {
        return axios.get(ADVENTURE_BASED_REST_API_URL + "/all");
    }

    getAvailableAdventures(searchData) {
        let city = searchData.city
        let capacity = searchData.capacity
        let startDate = searchData.startDate
        let endDate = searchData.endDate
        if (city === "") {
            return axios.get(ADVENTURE_BASED_REST_API_URL + "/allAvailable/" + startDate + "/" + endDate + "/" + capacity)
        }
        else return axios.get(ADVENTURE_BASED_REST_API_URL + "/allAvailableByCityAndCapacity/" + startDate + "/" + endDate + "/" + city + "/" + capacity)
    }
    
    getAdventure(id) {
        return axios.get(ADVENTURE_BASED_REST_API_URL + "/edit/" + id, id)
    }

    updateAdventure(adventure, id){
        return axios.put(ADVENTURE_BASED_REST_API_URL + "/edit/" + id, adventure)
    }

    getNumberOfAdventureReviews(id) {
        return axios.get(ADVENTURE_BASED_REST_API_URL + "/reviewsNumber/" + id);
    }

    getProfilePicture(id) {
        return axios.get(ADVENTURE_BASED_REST_API_URL + "/getProfilePicture/" + id, {responseType: 'blob'})
    }
}

export default new AdventureService()