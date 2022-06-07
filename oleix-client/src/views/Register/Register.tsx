import React, { useEffect, useState } from 'react';
import * as yup from 'yup';
import { Card, Col, Container, Row, Form, Modal, Button } from 'react-bootstrap';
import { Form as FormikForm, Formik } from 'formik';
import { RegisterDto } from '../../interfaces/RegisterDto';
import TextInput from '../../components/TextInput/TextInput';
import SubmitBtn from '../../components/SubmitBtn/SubmitBtn';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { RegisterDtoResponse } from '../../interfaces/RegisterDtoResponse';
import UserAvatar from '../../components/UserAvatar/UserAvatar';
import { useComebackIfLogged } from '../../hooks/useComebackIfLogged';
import Loader from '../../components/Loader/Loader';

const Register = () => {
  const navigate = useNavigate();
  const { from, logged } = useComebackIfLogged();
  const [registered, setRegistered] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [modalShow, setModalShow] = useState<boolean>(false);
  const [resending, setResending] = useState<boolean>(false);
  const [user, setUser] = useState<RegisterDtoResponse>({ userId: '' });

  useEffect(() => {
    if (logged) {
      navigate(from);
    }
  }, []);

  const requiredMessage = 'You must fill this field.';

  const schema = yup.object().shape({
    username: yup
      .string()
      .required(requiredMessage)
      .min(3, 'Your username must have minimum 3 chars.')
      .max(30, 'Your username must have maximum 30 chars.')
      .matches(
        new RegExp('^[a-zA-Z0-9._-]{3,15}$'),
        'You have to use only letters and numbers, additionaly (.-_)'
      ),
    password: yup
      .string()
      .required(requiredMessage)
      .min(6, 'Your password must have minimum 6 chars.')
      .max(40, 'Your password must have maximum 40 chars.'),
    password_confirm: yup
      .string()
      .required(requiredMessage)
      .min(6, "Your confirm password isn't the same as your password.")
      .max(40, "Your confirm password isn't the same as your password.")
      .oneOf([yup.ref('password')], 'Passwords are different.'),
    email: yup
      .string()
      .required(requiredMessage)
      .min(5, 'Is this an e-mail?')
      .max(320, 'Your e-mail is too long.')
      .email('Your e-mail is incorrect.'),
    localization: yup
      .string()
      .required(requiredMessage)
      .min(3, 'Does this localization even exist?')
      .max(100, 'Is there any localization with that long name?'),
    phone: yup
      .string()
      .required(requiredMessage)
      .max(13)
      .matches(new RegExp('^[0-9\\+]{1,}[0-9\\- ]{5,16}$'), 'This phone number is incorrect'),
  });

  const initialValues = {
    username: '',
    password: '',
    password_confirm: '',
    email: '',
    localization: '',
    phone: '',
  };

  const formSubmit = async (values: RegisterDto): Promise<void> => {
    setError(false);
    try {
      let sendingData = {
        username: values.username,
        password: values.password,
        email: values.email,
        localization: values.localization,
        phone: !values.phone.startsWith('+') ? '+48 ' + values.phone : values.phone,
      };

      const { data } = await axios.post<RegisterDtoResponse>('/api/users/register', sendingData);
      setUser(data);
    } catch (e) {
      setError(true);
    } finally {
      if (!error) {
        setRegistered(true);
        setModalShow(true);
      }
    }
  };

  // * Validate functions.
  const validateUsername = (value: string): boolean => {
    return new RegExp('^[a-zA-Z0-9_.-]*$').test(value);
  };

  // * Resend e-mail to registered user.
  const resendEmail = async () => {
    try {
      await axios.post('/api/auth/resend', {
        userId: user?.userId,
        userEmail: user?.email,
      });
    } catch (e) {
      setError(true);
    } finally {
      setResending(false);
    }
  };

  return (
    <Container>
      <Row>
        <Col xs={12} md={{ span: 6, offset: 3 }} xl={{ span: 4, offset: 4 }}>
          <Card body className="mt-5">
            <h3 className="text-center fw-light text-uppercase">Create account</h3>
            <div>
              <Formik
                validationSchema={schema}
                onSubmit={(data: RegisterDto) => formSubmit(data)}
                initialValues={initialValues}
              >
                {({ values }) => (
                  <Form as={FormikForm}>
                    <UserAvatar
                      username={validateUsername(values.username) ? values.username : null}
                    />

                    <TextInput name="username" label="Username" placeholder="John Doe" />

                    <TextInput
                      name="email"
                      label="E-mail"
                      placeholder="john.doe@oleix.pl"
                      className="mt-2"
                    />

                    <TextInput
                      name="password"
                      label="Password"
                      placeholder="Password"
                      type="password"
                      className="mt-4"
                    />

                    <TextInput
                      name="password_confirm"
                      label="Confirm password"
                      placeholder="Password"
                      type="password"
                      className="mt-2"
                    />

                    <TextInput
                      name="localization"
                      label="Localization"
                      placeholder="Town"
                      className="mt-4"
                    />

                    <TextInput
                      name="phone"
                      label="Phone number"
                      placeholder="123 456 789"
                      className="mt-2"
                      type="tel"
                      additional={{
                        start: '+48',
                        end: null,
                      }}
                    />

                    <SubmitBtn className="mt-5 btn-dark mb-3 d-block w-100">Sign up</SubmitBtn>
                  </Form>
                )}
              </Formik>
            </div>
          </Card>
        </Col>
      </Row>

      {!error && registered && (
        <Modal
          show={modalShow}
          onHide={() => setModalShow(false)}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Verify your e-mail to complete
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              An e-mail has been sent to {user?.email || 'no@email.com'} with a link to verify your
              account. If you do not receive an e-mail after a few minutes, please check your SPAM
              folder. Thank you!
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={resendEmail} disabled={resending}>
              {resending ? <Loader small={true} /> : 'Resend'}
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
};

export default Register;
