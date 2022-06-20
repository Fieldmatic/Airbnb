import axios from "axios";
import inMemoryJwt from './inMemoryJwtService';

const ADMIN_BASED_REST_API_URL = "http://localhost:8081/api/admin";

class AdminService {

    getAdmin() {
        return axios.get(ADMIN_BASED_REST_API_URL + "/get", 
        {
            headers: {
                'Authorization':`Bearer ${inMemoryJwt.getToken()}`
            } 
        })
    }

    updateAdmin(admin) {
        return axios.put(ADMIN_BASED_REST_API_URL + "/update" , admin,
        {
            headers: {
                'Authorization':`Bearer ${inMemoryJwt.getToken()}`
            } 
        })
    }

    getProfileDeletionRequests() {
        return axios.get(ADMIN_BASED_REST_API_URL + "/getProfileDeletionRequests",
        { 
            headers: {
                'Authorization':`Bearer ${inMemoryJwt.getToken()}`
            }
        });
    }

    getProfilePicture() {
        return axios.get(ADMIN_BASED_REST_API_URL + "/getProfilePicture",
        {
            responseType: 'blob',
            headers: {
                'Authorization':`Bearer ${inMemoryJwt.getToken()}`
            },
         })
    }

    async deleteProfile(userId, pdrId, confirmation, message) {
        return await axios.put(ADMIN_BASED_REST_API_URL + "/confirmProfileDeletion/" + userId + "&" + pdrId + "&" + confirmation, message,
        {
            headers: {
                'Authorization':`Bearer ${inMemoryJwt.getToken()}`
            }
        });
    }

    getUserRegistrationRequests() {
        return axios.get(ADMIN_BASED_REST_API_URL + "/getUserRegistrationRequests",
        {
            headers: {
                'Authorization':`Bearer ${inMemoryJwt.getToken()}`
            }
        });
    }

    async registrateUser(userId, regId, confirmation, message) {
        return await axios.put(ADMIN_BASED_REST_API_URL + "/registerUser/" + userId + "&" + regId + "&" + confirmation, message,
        {
            headers: {
                'Authorization':`Bearer ${inMemoryJwt.getToken()}`
            }
        });
    }

    getChartData(startDate, endDate) {
        return axios.get(ADMIN_BASED_REST_API_URL + "/getChartData/" + startDate + "&" + endDate,
        {
            headers: {
                'Authorization':`Bearer ${inMemoryJwt.getToken()}`
            }
        });
    }

    getPaymentConfig() {
        return axios.get(ADMIN_BASED_REST_API_URL + "/getPaymentConfig",
        {
            headers: {
                'Authorization':`Bearer ${inMemoryJwt.getToken()}`
            }
        });
    }

    updatePaymentConfig(paymentConfig) {
        return axios.put(ADMIN_BASED_REST_API_URL + "/updatePaymentConfig", paymentConfig,
        {
            headers: {
                'Authorization':`Bearer ${inMemoryJwt.getToken()}`
            }
        });
    }

    getLoyaltyProgram() {
        return axios.get(ADMIN_BASED_REST_API_URL + "/getLoyaltyProgram",
        {
            headers: {
                'Authorization':`Bearer ${inMemoryJwt.getToken()}`
            }
        });
    }

    updateLoyaltyProgram(loyaltyProgram) {
        return axios.put(ADMIN_BASED_REST_API_URL + "/updateLoyaltyProgram", loyaltyProgram,
        {
            headers: {
                'Authorization':`Bearer ${inMemoryJwt.getToken()}`
            }
        });
    }
    
}

export default new AdminService()