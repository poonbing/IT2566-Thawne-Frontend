import { useState } from 'react';


function useToken() {
  const getToken = () => {
    const tokenString = sessionStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    return userToken?.token
  };

  const [token, setToken] = useState(getToken());

  const saveToken = userToken => {
    sessionStorage.setItem('token', JSON.stringify(userToken));
    setToken(userToken.token);
  };

  const logout = () => {
    sessionStorage.removeItem('token');
    setToken(null);
  };

  return {
    setToken: saveToken,
    token,
    logout,
  }
}

export default useToken;