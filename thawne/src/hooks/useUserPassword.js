import { useState } from "react";

function useUserPassword() {
  const [userPassword, setUserPassword] = useState({password: null});

  return {
    setUserPassword,
    userPassword
  };
}

export default useUserPassword;
