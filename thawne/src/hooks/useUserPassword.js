import { useState } from "react";

function useUserPassword() {
  const [userPassword, setUserPassword] = useState({ password: "" });
  
  return {
    setUserPassword,
    userPassword
  };
}

export default useUserPassword;
