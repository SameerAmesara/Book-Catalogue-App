import React, { createContext, useState, useContext, useEffect } from 'react';
import { CognitoUserPool } from 'amazon-cognito-identity-js';
import { useNavigate } from 'react-router-dom';
import { poolData } from '../aws-config';
import { getCurrentUser } from '../utils/getCurrentUser';

const AuthContext = createContext();

const UserPool = new CognitoUserPool(poolData);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    user_id: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    const name = localStorage.getItem('name');
    const email = localStorage.getItem('email');
    const user_id = localStorage.getItem('user_id');
    if (name && email && user_id) {
      setIsLoggedIn(true);
      setUserDetails({ name, email, user_id });
    }
  }, []);

  const login = async () => {
    setIsLoggedIn(true);
    const attributes = await getCurrentUser();
    setUserDetails({
      name: attributes.name,
      email: attributes.email,
      user_id: attributes.sub,
    });
    localStorage.setItem('name', attributes.name);
    localStorage.setItem('email', attributes.email);
    localStorage.setItem('user_id', attributes.sub);
  };

  const logout = () => {
    const cognitoUser = UserPool.getCurrentUser();
    if (cognitoUser) {
      cognitoUser.signOut();
    }
    setIsLoggedIn(false);
    setUserDetails({ name: '', email: '', user_id: '' });
    localStorage.removeItem('name');
    localStorage.removeItem('email');
    localStorage.removeItem('user_id');
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, userDetails }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
