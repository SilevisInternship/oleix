import React, { FC, useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import Loader from '../../components/Loader/Loader';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import toastr from 'toastr';

const AuthEmail: FC = () => {
  const { id } = useParams<{ id: string }>() || 'no-id';
  const [activating, setActivating] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const activateAccount = async () => {
      try {
        await axios.post(`/api/auth/activate/${id}`);
      } catch (e) {
        setError(true);
      } finally {
        setActivating(false);

        setTimeout(() => {
          toastr.info('Your account has been successfully activated', 'Account active');
          navigate('/');
        }, 3000);
      }
    };

    activateAccount().then();
  }, []);

  return (
    <Container className="w-100 position-fixed start-50 top-50 translate-middle d-flex flex-column align-items-center">
      {error && (
        <>
          <span className="fs-1">ERROR</span>
          <span className="fs-2">Could not activate e-mail using this id</span>
        </>
      )}
      {activating && !error ? (
        <>
          <span className="fs-1">Account activate</span>
          <p className="font-weight-light">We are verifying your e-mail</p>
          <Loader small={false} />
        </>
      ) : (
        <span>Account has been activated</span>
      )}
    </Container>
  );
};

export default AuthEmail;
