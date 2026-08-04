import { createContext, useContext, useState } from "react";

const AuthContext = createContext();


export function AuthProvider({ children }) {


  const [user,setUser] = useState(()=>{

    try{

      const token =
        localStorage.getItem("token");

      const savedUser =
        localStorage.getItem("user");


      if(!token || !savedUser){
        return null;
      }


      return JSON.parse(savedUser);


    }catch(error){

      localStorage.removeItem("user");
      localStorage.removeItem("token");

      return null;

    }

  });



  const login = (userData,token)=>{


    if(token){

      localStorage.setItem(
        "token",
        token
      );

    }


    if(userData){

      localStorage.setItem(
        "user",
        JSON.stringify(userData)
      );


      setUser(userData);

    }


  };




  const logout = ()=>{


    setUser(null);


    localStorage.removeItem("user");

    localStorage.removeItem("token");


    localStorage.removeItem("cart");


  };



  return(

    <AuthContext.Provider

      value={{
        user,
        login,
        logout,
        isAuthenticated:!!user
      }}

    >

      {children}

    </AuthContext.Provider>

  );


}



export function useAuth(){

  return useContext(AuthContext);

}
