import { createContext, useContext, useState } from "react";

const LoginAnimationContext = createContext(null);

export function LoginAnimationProvider({ children }) {
  const [coverEyes, setCoverEyes] = useState(false);
  const [sad, setSad] = useState(false);
  const [success, setSuccess] = useState(false);

  const reset = () => {
    setCoverEyes(false);
    setSad(false);
    setSuccess(false);
  };

  return (
    <LoginAnimationContext.Provider
      value={{
        coverEyes,
        setCoverEyes,
        sad,
        setSad,
        success,
        setSuccess,
        reset,
      }}
    >
      {children}
    </LoginAnimationContext.Provider>
  );
}

export function useLoginAnimation() {
  return useContext(LoginAnimationContext);
}
