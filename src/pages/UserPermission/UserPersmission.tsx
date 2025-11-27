import { useEffect, useState } from "react"
import BasicTableOne from "../../components/tables/BasicTables/BasicTableOne"
import { useFetch } from "../../hooks/useFetch"
import { UserServiceInstance } from "../../service/user.service"


enum selectOptions {
  active = "active",
  inactive = "inactive",
}
enum sortingOptions {
  asc = 'asc',
  desc = 'desc'
}

const UserPersmission = () => {
    const {fn,data}= useFetch(UserServiceInstance.getUsers);
    const [page,setPage]=useState(1);
    const [limit,setLimit]=useState(10);
    const [text,setText]=useState("");
    const [selectActiveOption, setSelectActiveOption] = useState<selectOptions | string>('')
  const [sort, setSort] = useState<sortingOptions | string>('')
    useEffect(()=>{
        fn(limit,page,text,selectActiveOption,sort)
    },[page,limit,text,selectActiveOption,sort])
  return (
    <>
    <BasicTableOne
    selectActiveOption={selectActiveOption}
    setSelectActiveOption={setSelectActiveOption}
    sort={sort} setSort={setSort}
    setLimit={setLimit} limit={limit} setPage={setPage} page={page} data={data} setText={setText}/>
    </>
  )
}

export default UserPersmission