import { axiosInstance } from "@/helper/axiosInstance";

class RequirementService {
    getRequirements(limit:string,page:string,text:string){
           return axiosInstance.get('/requirement/get-requirement-listing',{
                     params:{
                        limit,
                        page,
                        text
                    }
                }).then(res=>res.data.data || res.data)
    }
     getRequirementsById(id:string,limit:string,page:string,text:string){
           return axiosInstance.get('/requirement/get-requirement-listing-by-id/'+id,{
                     params:{
                        limit,
                        page,
                        text
                    }
                }).then(res=>res.data.data || res.data)
    }
    
    
}
export default new RequirementService();