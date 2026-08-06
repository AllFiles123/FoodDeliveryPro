import { createContext, useContext, useMemo, useState } from "react";

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

  const value = useMemo(
    () => ({
      coverEyes,
      setCoverEyes,
      sad,
      setSad,
      success,
      setSuccess,
      reset,
    }),
    [coverEyes, sad, success]
  );

  return (
    <LoginAnimationContext.Provider value={value}>
      {children}
    </LoginAnimationContext.Provider>
  );
}

export function useLoginAnimation() {
  const context = useContext(LoginAnimationContext);

  if (!context) {
    throw new Error(
      "useLoginAnimation must be used inside LoginAnimationProvider"
    );
  }

  return context;
}
