import { Card, Col, Container, Form, Row } from 'react-bootstrap';
import React, { useState } from 'react';
import { Formik, Form as FormikForm } from 'formik';
import axios from 'axios';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { CreateAdvertDto } from '../../interfaces/CreateAdvertDto';
import { SavedFiles } from '../../interfaces/SavedFiles';
import Dropzone from '../../components/DropZone/DropZone';
import CheckboxInput from '../../components/CheckboxInput/CheckboxInput';
import useAuth from '../../hooks/useAuth';
import TextInput from '../../components/TextInput/TextInput';
import SubmitBtn from '../../components/SubmitBtn/SubmitBtn';
import { Accept } from 'react-dropzone';
import PriceInput from '../../components/PriceInput/PriceInput';
import PhoneInput from '../../components/PhoneInput/PhoneInput';

const NewAdvert = () => {
  const navigate = useNavigate();
  const requiredMessage = 'You must fill this field.';

  const schema = yup.object().shape({
    title: yup
      .string()
      .required(requiredMessage)
      .min(3, 'Your title must have minimum 3 chars.')
      .max(255, 'Your title must have maximum 255 chars.'),
    description: yup
      .string()
      .required(requiredMessage)
      .min(20, 'Your description must have minimum 20 chars.')
      .max(350, 'Your description must have maximum 350 chars.'),
    price: yup.number().required(requiredMessage).min(0, 'The price cannot be less than zero'),
    localization: yup.string().required(requiredMessage),
    phone: yup
      .string()
      .required(requiredMessage)
      .min(3, 'Your phone number must have minimum 3 chars.')
      .max(16, 'Your phone number must have maximum 16 chars.')
      .matches(new RegExp('^[0-9\\+]{1,}[0-9\\- ]{5,16}$'), 'This phone number is incorrect'),
    negotiable: yup.bool(),
    authorId: yup.string(),
    imageIds: yup.array(),
  });

  const [isLoading, setIsLoading] = useState(false);
  const [savedFiles, setSavedFiles] = useState<SavedFiles[]>([]);

  const { auth } = useAuth();

  const initialValues = {
    title: '',
    description: '',
    price: 0,
    localization: auth?.localization || '',
    phone: auth?.phone.split(' ').splice(1, 1).join('') || '',
    negotiable: false,
    authorId: auth?.userId || '',
  };

  const acceptedDroppedFilesExtensions: Accept = {
    'image/jpeg': ['.jpeg', '.jpg'],
    'image/png': ['.png'],
    'image/webp': ['.webp'],
  };

  // * Upload file.
  const uploadCallback = async (newFile: File): Promise<void> => {
    try {
      const formData = new FormData();
      formData.append('file', newFile, newFile.name);
      const { data } = await axios.post<string>(`/api/images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSavedFiles((prev) => [...prev, { id: data, file: newFile }]);
    } catch (e) {}
  };

  // * Remove uploaded file callback.
  const removeCallback = (file: File) => {
    setSavedFiles(
      savedFiles.filter((saved) => {
        return saved?.file?.name !== file.name;
      })
    );
  };

  const formSubmit = async (values: CreateAdvertDto): Promise<void> => {
    try {
      setIsLoading(true);
      values.phone = values.phone.startsWith('+48') ? values.phone : '+48 ' + values.phone;
      values.imageIds = savedFiles.map((ob) => ob.id);
      const { data } = await axios.post<string>(`/api/adverts`, values);
      navigate(`/adverts/${data}`);
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Row>
        <Col>
          {isLoading && <p>Loading...</p>}
          <h3 className="mb-3 mt-3 fs-4">Add New Advert</h3>
        </Col>
      </Row>

      <Row>
        <Col>
          <Formik validationSchema={schema} onSubmit={formSubmit} initialValues={initialValues}>
            <Form as={FormikForm}>
              <Form.Label htmlFor="files-input">
                Upload images (.jpg, .jpeg, .png, .webp)
              </Form.Label>
              <Dropzone
                uploadCallback={uploadCallback}
                removeCallback={removeCallback}
                acceptedExtensions={acceptedDroppedFilesExtensions}
              />
              <Card body className="mt-3 mb-4">
                <TextInput
                  className="mb-2"
                  id="title-input"
                  type="text"
                  name="title"
                  placeholder="for example. iPhone 11"
                  label="Add Title*"
                />

                <TextInput
                  className="mb-2"
                  label="Description*"
                  muted="Please enter at least 20 characters."
                  id="description-input"
                  type="textarea"
                  name="description"
                />

                <PriceInput label="Price*" name="price" suffix=" zł" className="mb-2" />

                <CheckboxInput name="negotiable" label="Price is negotiable" className="mb-2" />

                <TextInput
                  className="mb-2"
                  label="Location*"
                  id="localization-input"
                  type="text"
                  name="localization"
                />

                <PhoneInput name="phone" label="Phone Number*" format="### ### ###" />

                <SubmitBtn className="btn-dark btn-sm px-4 py-2 d-flex mt-3 float-end btn-lg">
                  Add Advert
                </SubmitBtn>
              </Card>
            </Form>
          </Formik>
        </Col>
      </Row>
    </Container>
  );
};

export default NewAdvert;
