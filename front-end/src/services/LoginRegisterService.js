import axios from "axios";

const LOGIN_REGISTER_BASED_REST_API_URL = "http://localhost:8081/api/auth";


class LoginRegisterService {
    addCottageOwner(registrationData){
        return axios.post (LOGIN_REGISTER_BASED_REST_API_URL + "/ownerRegistration", registrationData)
    }

    login(loginData){
        return axios.post(LOGIN_REGISTER_BASED_REST_API_URL + "/login", loginData)
    }

}


export default new LoginRegisterService()