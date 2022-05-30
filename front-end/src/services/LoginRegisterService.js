import axios from "axios";
import inMemoryJwt from "./inMemoryJwtService";

const LOGIN_REGISTER_BASED_REST_API_URL = "http://localhost:8081/api/auth";


class LoginRegisterService {
    registerOwner(registrationData){
        return axios.post (LOGIN_REGISTER_BASED_REST_API_URL + "/ownerRegistration", registrationData)
    }

    login(loginData){
        console.log(loginData)
        return axios.post(LOGIN_REGISTER_BASED_REST_API_URL + "/login", loginData)
    }
    getUserRole(){
        return axios.get(LOGIN_REGISTER_BASED_REST_API_URL + "/getRole",
        {
            headers: {
                'Authorization':`Bearer ${inMemoryJwt.getToken()}`
            } 
         })
    }

    addClient(formData){
        return axios.post (LOGIN_REGISTER_BASED_REST_API_URL + "/clientRegistration", formData)
    }

    addInstructor(instructor){
        return axios.post(LOGIN_REGISTER_BASED_REST_API_URL + "/instructorRegistration", instructor);
    }

}


export default new LoginRegisterService()