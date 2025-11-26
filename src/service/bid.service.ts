import { axiosInstance } from "../helper/axiosInstance";

class BidService{
    getBids(limit:string,page:string,text:string){
        return axiosInstance.get('/bid/bid-listing',{
             params:{
                limit,
                page,
                text
            }
        }).then(res=>res.data.data || res.data)
    }
     getBidById(id:string,limit:string,page:string,text:string){
        return axiosInstance.get('/bid/get-bid-by-id/'+id,{
             params:{
                limit,
                page,
                text
            }
        }).then(res=>res.data.data || res.data)
    }
}
export default new BidService();