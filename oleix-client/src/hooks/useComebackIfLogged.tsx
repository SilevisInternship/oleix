import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from './useAuth';
import { useEffect } from 'react';

export const useComebackIfLogged = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const { state } = useLocation() as { state: { from: '' } };

  const from = state?.from || '/';
  const logged = auth && auth?.userId !== '' && auth?.userId !== null;

  useEffect(() => {
    if (logged) {
      navigate(from);
    }
  }, []);

  return { from, logged };
};
