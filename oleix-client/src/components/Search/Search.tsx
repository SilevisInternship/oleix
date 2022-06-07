import * as yup from 'yup';
import { Col, Container, Form, Row } from 'react-bootstrap';
import { Formik, Form as FormikForm } from 'formik';
import React, { FC } from 'react';
import { SearchDto } from '../../interfaces/SearchDto';
import TextInput from '../TextInput/TextInput';
import SubmitBtn from '../SubmitBtn/SubmitBtn';
import { useSearchParams } from 'react-router-dom';

interface SearchProps {
  callback: (search: string, localization: string) => void;
}

const Search: FC<SearchProps> = ({ callback }) => {
  const [searchParams] = useSearchParams();

  const schema = yup.object().shape({
    searchPhrase: yup.string(),
    localization: yup.string(),
  });

  const initialValues = {
    searchPhrase: searchParams.get('searchPhrase') || '',
    localization: searchParams.get('localization') || '',
  };

  const formSubmit = (values: SearchDto): void => {
    callback(values.searchPhrase, values.localization);
  };

  return (
    <Container>
      <Formik
        initialValues={initialValues}
        onSubmit={(data: SearchDto) => formSubmit(data)}
        validationSchema={schema}
      >
        <Form as={FormikForm}>
          <Row className="fs-6">
            <Col xs={6} sm={12} md={5}>
              <TextInput className="mt-4" name="searchPhrase" label="Search for adverts" />
            </Col>
            <Col xs={6} sm={6} md={5}>
              <TextInput className="mt-4" name="localization" label="Location" />
            </Col>
            <Col xs={12} sm={6} md={2}>
              <SubmitBtn variant="outline-dark" className="mt-5 d-block w-100">Search</SubmitBtn>
            </Col>
          </Row>
        </Form>
      </Formik>
    </Container>
  );
};
export default Search;
