import { useCallback, useState } from "react";

export const useSheet =(initialState:boolean= false)=>{
    const [isOpen, setIsOpen] = useState(initialState);
   const toggleSheet = useCallback(() => setIsOpen((prev) => !prev), []);
   const openSheet =  useCallback(()=>setIsOpen(true),[]);
   const closeSheet = useCallback(()=>setIsOpen(false),[]);
    return {isOpen, toggleSheet, openSheet, closeSheet};
}