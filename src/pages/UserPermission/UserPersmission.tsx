import { useEffect, useState } from "react"
import BasicTableOne from "../../components/tables/BasicTables/BasicTableOne"
import { useFetch } from "../../hooks/useFetch"
import { UserServiceInstance } from "../../service/user.service"


const UserPersmission = () => {
    const {fn,data}= useFetch(UserServiceInstance.getUsers);
    const [page,setPage]=useState(1);
    const [limit,setLimit]=useState(10);
    const [text,setText]=useState("");
    useEffect(()=>{
        fn(limit,page,text)
    },[page,limit,text])
  return (
    <>
    <BasicTableOne setLimit={setLimit} limit={limit} setPage={setPage} page={page} data={data} setText={setText}/>
    </>
  )
}

export default UserPersmission