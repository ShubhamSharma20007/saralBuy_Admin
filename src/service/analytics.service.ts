import { axiosInstance } from "../helper/axiosInstance";

class Analytics{
   async dashboardAnalytcs(){
        return await axiosInstance.get('/dashboard/analtics').then((res)=>res.data.data || res.data)
    }
    async getProductAnalytcs(categoryId:string){
        return await axiosInstance.get('/dashboard/populate-products-by-id',{
            params:{
            categoryId
            }
        }).then((res)=>res.data.data || res.data)
    }
    async  bannerImageUpload(formData:FormData){
        return await axiosInstance.post('/dashboard/upload-banner',formData,{
            headers:{
                'Content-Type':'multipart/form-data'
            }
        }).then((res)=>res.data.data || res.data)
    }
    async  bannerListing(limit:string,page:string){
        return await axiosInstance.get('/dashboard/banner-listing',{
            params:{
                limit,
                page
            }
        }).then((res)=>res.data.data || res.data)
    }
    async deleteBanner(bannerId:string){
        return await axiosInstance.delete('/dashboard/delete-banner/'+bannerId).then((res)=>res.data.data || res.data)
    }
    async getBanerDetailsById(bannerId:string){ 
        return await axiosInstance.get('/dashboard/get-banner/'+bannerId).then((res)=>res.data.data || res.data)
    }
    async updateBanner(formData:FormData,bannerId:string){
        return await axiosInstance.put('/dashboard/update-banner/'+bannerId,formData,{
            headers:{
                'Content-Type':'multipart/form-data'
            }
        }).then((res)=>res.data.data || res.data)
    }
     async  getAllProducts(limit:string,page:string,text:string){
        return await axiosInstance.get('/dashboard/all-products',{
            params:{
                limit,
                page,
                text
            }
        }).then((res)=>res.data.data || res.data)
    }
    async getProductById(productId:string){
        return await axiosInstance.get('/dashboard/get-product/'+productId).then((res)=>res.data.data || res.data)
    }
    async updateProduct(formData:FormData,productId:string){
        return await axiosInstance.put('/dashboard/update-product/'+productId,formData,{
            headers:{
                'Content-Type':'multipart/form-data'
            }
        }).then((res)=>res.data.data || res.data)
    }
    async getCategories(){
        return await axiosInstance.get('/dashboard/get-categorie-names').then((res)=>res.data.data || res.data)
    }
    async subCategoryProducts(categoryId:string){
        return await axiosInstance.get('/dashboard/get-subcategory-count/'+categoryId).then((res)=>res.data.data || res.data)
    }
}
export const AnalyticsInstance = new Analytics();