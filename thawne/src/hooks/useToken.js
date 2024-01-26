import { useState } from 'react';

function useToken() {
  const getToken = () => {
    const tokenString = sessionStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    return userToken?.token;
  };

  const getPassword = () => {
    const tokenString = sessionStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    return userToken?.password;
  };

  const [token, setToken] = useState(getToken());
  const [password, setPassword] = useState(getPassword());

  const saveToken = (userToken, userPassword) => {
    sessionStorage.setItem('token', JSON.stringify(userToken));
    setToken(userToken.token);
    setPassword(userPassword);
  };

  const logout = () => {
    sessionStorage.removeItem('token');
    setToken(null);
    setPassword('');
  };

  return {
    setToken: saveToken,
    token,
    userPassword: password,
    logout,
  };
}

export default useToken;
