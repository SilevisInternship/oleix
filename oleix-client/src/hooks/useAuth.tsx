import { useContext } from 'react';
import AuthContext from '../context/AuthProvider';
import { Auth } from '../interfaces/Auth';

const useAuth = () => {
  return useContext<Auth>(AuthContext);
};

export default useAuth;
