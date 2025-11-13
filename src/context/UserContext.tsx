import React, { createContext, useState } from "react";

type UserContextType = {
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
};

export const UserContext = createContext<UserContextType | null>(null);

export const UserContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<any>(null);



//   console.log(user,34)
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};


export const useUserContext = () => {
  const context = React.useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserContextProvider");
  }
  return context;
}