import { axiosInstance } from "../helper/axiosInstance";

class UserService{
    getUsers(limit:string,page:string,text:string,selectActiveOption:string,sort:string){
        return axiosInstance.get("/user/get-users",{
            params:{
                limit,
                page,
                text,
                selectActiveOption,
                sort
            }
        }).then(response => response.data.data ||response.data)
    }
    getUserById(userId:string){
        return axiosInstance.get(`/user/get-user/${userId}`)
        .then(response => response.data.data || response.data)
    }
    updateUser(userId:string,data:any){
        return axiosInstance.put(`/user/update-user/${userId}`,data)
        .then(response => response.data.data || response.data)
    }
}
export const UserServiceInstance = new UserService();