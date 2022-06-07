import { createContext, FC, ReactNode, useCallback, useEffect, useState } from 'react';
import Cookie from 'js-cookie';
import { Auth } from '../interfaces/Auth';
import toastr from 'toastr';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User } from '../interfaces/LoggedUserCookie';

const AuthContext = createContext<Auth>({ auth: null, setAuth: null });

export const AuthProvider: FC<{ children: ReactNode; requireLoginList: string[] }> = ({
  children,
  requireLoginList,
}) => {
  const [auth, setAuth] = useState<User | null>(null);
  const loggedCookie = 'access-token';
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [loading, setLoading] = useState(true);

  const logout = () => {
    Cookie.remove(loggedCookie);
    toastr.success('You have been successfully logged out', 'Success');
    setAuth(null);
    navigate('/login');
  };

  const getUser = useCallback(async () => {
    if (!Cookie.get(loggedCookie)) {
      setLoading(false);
      return null;
    }

    const { data: user } = await axios.get<User>('/api/users/me');
    setAuth(user);
    setLoading(false);
    return user;
  }, [auth]);

  useEffect(() => {
    getUser().then();
  }, []);

  if (loading) {
    return null;
  }

  if (!auth && requireLoginList.includes(pathname)) {
    return <Navigate to={'/login'} />;
  }

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        logout,
        cookieName: loggedCookie,
        getUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
