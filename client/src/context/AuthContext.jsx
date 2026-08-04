import { createContext, useContext, useState } from "react";

const AuthContext = createContext();


export function AuthProvider({ children }) {


  const [user, setUser] = useState(() => {

    try {

      const savedUser =
        localStorage.getItem("user");

      return savedUser
        ? JSON.parse(savedUser)
        : null;

    } catch {

      localStorage.removeItem("user");
      return null;

    }

  });



  const login = (userData, token) => {


    if(token){

      localStorage.setItem(
        "token",
        token
      );

    }


    localStorage.setItem(
      "user",
      JSON.stringify(userData)
    );


    setUser(userData);


  };




  const logout = () => {


    setUser(null);


    localStorage.removeItem("user");

    localStorage.removeItem("token");


    // extra cleanup

    localStorage.removeItem("cart");

  };



  return (

    <AuthContext.Provider

      value={{

        user,

        login,

        logout,

        isAuthenticated: !!user,

      }}

    >

      {children}

    </AuthContext.Provider>

  );


}



export function useAuth(){

  return useContext(AuthContext);

}
