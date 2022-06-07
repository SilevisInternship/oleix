import { Formik, Form as FormikForm } from 'formik';
import * as yup from 'yup';
import React from 'react';
import { Col, Form, Container, Row, Card } from 'react-bootstrap';
import axios from 'axios';
import { LoginDto } from '../../interfaces/LoginDto';
import TextInput from '../../components/TextInput/TextInput';
import SubmitBtn from '../../components/SubmitBtn/SubmitBtn';
import { useComebackIfLogged } from '../../hooks/useComebackIfLogged';
import { useNavigate } from 'react-router-dom';
import toastr from 'toastr';
import { LoggedUserCookie } from '../../interfaces/LoggedUserCookie';
import { setAuthHeader } from '../../axiosConfig';
import useAuth from '../../hooks/useAuth';

const Login = () => {
  const navigate = useNavigate();
  const { from } = useComebackIfLogged();
  const { getUser } = useAuth();

  const requiredMessage = 'This field is required.';
  const schema = yup.object().shape({
    identifier: yup.string().required(requiredMessage).min(3).max(320),
    password: yup.string().required(requiredMessage).min(6).max(40),
  });

  const initialValues: LoginDto = {
    identifier: '',
    password: '',
  };

  const formSubmit = async (values: LoginDto): Promise<void> => {
    try {
      const { data } = await axios.post<LoggedUserCookie>(`/api/auth/login`, values);
      setAuthHeader(data.token);
      toastr.success('Authenticated as ' + data?.user?.username);
      navigate(from);
      if (getUser) {
        getUser().then();
      }
    } catch (e: any) {
      toastr.error(e?.response?.data?.message || 'An error occurred while logging in...');
    }
  };

  return (
    <Container>
      <Row>
        <Col xs={12} md={{ span: 6, offset: 3 }} xl={{ span: 4, offset: 4 }}>
          <Card body className="mt-5">
            <h3 className="fs-1 text-center">Login</h3>
            <div>
              <Formik
                validationSchema={schema}
                onSubmit={(data: LoginDto) => formSubmit(data)}
                initialValues={initialValues}
              >
                <Form as={FormikForm}>
                  <TextInput name="identifier" placeholder="Username" label="Username*" />

                  <TextInput
                    className="mt-1"
                    name="password"
                    placeholder="Password"
                    label="Password*"
                    type="password"
                  />

                  <SubmitBtn className="mt-4 btn-dark mb-5 d-block w-100 btn-lg">Login</SubmitBtn>
                </Form>
              </Formik>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
