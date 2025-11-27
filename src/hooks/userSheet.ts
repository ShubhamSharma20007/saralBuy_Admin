import { useState } from "react";

export const useSheet = () => {
  const [isOpenSheet, setIsOpenSheet] = useState(false);

  const openSheet = () => setIsOpenSheet(true);
  const closeSheet = () => setIsOpenSheet(false);

  return { isOpenSheet, openSheet, closeSheet ,setIsOpenSheet};
};
