import { axiosInstance } from "../helper/axiosInstance";

class AuthService {
    async login(form:any){
        return axiosInstance.post('/auth/login',form).then(response => response.data.data ||response.data)
    }
    async register(obj:any){
        return axiosInstance.post('/auth/signup',obj).then(response => response.data.data ||response.data)
    }
    logout(){
        return axiosInstance.get('/auth/logout').then(response => response.data.data ||response.data)
    }
   async adminProfile(){
        return axiosInstance.get('/auth/profile').then(response => response.data.data ||response.data)
    }
    async isUserLoggedIn(){
        return axiosInstance.get('/auth/isAuthenticated').then(response => response.data.data ||response.data)
    }

}
export const AuthServiceInstance = new AuthService();