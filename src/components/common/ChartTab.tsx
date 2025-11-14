import { useEffect, useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import { AnalyticsInstance } from "../../service/analytics.service";

type Props={
  selectedTileId:string,
  setSelectedTileId:React.Dispatch<React.SetStateAction<string>>
}
const ChartTab:React.FC<Props>= ({setSelectedTileId,selectedTileId}) => {
    const {fn:getCateorgiesFn,data:getCategoriesRes} = useFetch(AnalyticsInstance.getCategories);
  const getButtonClass = (option:any) =>
    selectedTileId === option
      ? "shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800"
      : "text-gray-500 dark:text-gray-400";

      useEffect(()=>{
        getCateorgiesFn();
      },[])
useEffect(()=>{
  if(getCategoriesRes){
    setSelectedTileId(getCategoriesRes[0]._id)
  }
},[getCategoriesRes])

  return (
    <div className="flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-900 flex-wrap sm:flex-nowrap">
     {
      getCategoriesRes?.map((item:any,idx:number)=> <button
      key={idx}
     onClick={() => setSelectedTileId(item._id)}
        className={`px-3 capitalize py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900   dark:hover:text-white ${getButtonClass(
          item?._id
        )}`}
      >
        {item?.categoryName}
      </button>)
     }

    </div>
  );
};

export default ChartTab;
