import React, { FC, useEffect, useState } from 'react';
import { Card, Col, Container, Form, Row } from 'react-bootstrap';
import { Formik } from 'formik';
import { Form as FormikForm } from 'formik';
import Dropzone from '../../components/DropZone/DropZone';
import TextInput from '../../components/TextInput/TextInput';
import CheckboxInput from '../../components/CheckboxInput/CheckboxInput';
import SubmitBtn from '../../components/SubmitBtn/SubmitBtn';
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';
import { SavedFiles } from '../../interfaces/SavedFiles';
import useAuth from '../../hooks/useAuth';
import { Accept } from 'react-dropzone';
import axios from 'axios';
import { CreateAdvertDto } from '../../interfaces/CreateAdvertDto';
import {
  DetailedAdvertListItemResponse,
  ImageObject,
} from '../../interfaces/DetailedAdvertListItemResponse';
import Loader from '../../components/Loader/Loader';
import { useComebackIfLogged } from '../../hooks/useComebackIfLogged';

const DEFAULT_INITIAL_VALUES = {
  title: '',
  description: '',
  price: 0,
  localization: '',
  phone: '',
  negotiable: false,
  authorId: '',
};

const EditAdvert: FC = () => {
  const navigate = useNavigate();
  const requiredMessage = 'You must fill this field.';
  const { id } = useParams<{ id: string }>() || null;
  const { auth } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [isAdvertLoading, setIsAdvertLoading] = useState(false);
  const [savedFiles, setSavedFiles] = useState<SavedFiles[]>([]);
  const [alreadyUploadedImages, setAlreadyUploadedImages] = useState<ImageObject[]>([]);

  const [initialFormValues, setInitialFormValues] = useState(DEFAULT_INITIAL_VALUES);
  const initialValues = initialFormValues;

  const { logged } = useComebackIfLogged();

  useEffect(() => {
    if (!logged) {
      navigate('/');
      return;
    }

    const loadAdvertData = async () => {
      setIsLoading(true);

      if (!id) {
        return;
      }

      try {
        const [{ data: advert }, { data: phone }] = await Promise.all([
          // * Get advert data.
          await axios.get<DetailedAdvertListItemResponse>(`/api/adverts/${id}`),

          // * Get phone number.
          await axios.get(`/api/users/${auth?.userId || null}/phone`),
        ]);
        const authorId = advert?.author?.userId || '';
        if (auth?.userId !== authorId) {
          navigate('/');
        }

        setInitialFormValues({
          authorId,
          description: advert.description,
          title: advert.title,
          localization: advert.localization,
          negotiable: advert.negotiable,
          phone: phone,
          price: advert.price,
        });

        setAlreadyUploadedImages(advert?.images || []);
      } finally {
        setIsLoading(false);
      }
    };

    loadAdvertData().then();
  }, []);

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

  // * Remove already uploaded image when editing advert.
  const removeAlreadyUploadedImageCallback = (image: ImageObject) => {
    setAlreadyUploadedImages(alreadyUploadedImages.filter((img) => img.imageId !== image.imageId));
  };

  const formSubmit = async (values: CreateAdvertDto): Promise<void> => {
    try {
      setIsAdvertLoading(true);
      values.imageIds = [
        ...savedFiles.map((ob) => ob.id),
        ...alreadyUploadedImages.map((image) => image.imageId),
      ];

      await axios.patch<string>(`/api/adverts/${id}`, values);
      navigate(`/adverts/${id}`);
    } catch (e) {
    } finally {
      setIsAdvertLoading(false);
    }
  };

  return (
    <Container>
      {isAdvertLoading ? (
        <Loader center={true} />
      ) : (
        <>
          <Row>
            <Col>
              {isLoading && <Loader center={true} />}
              <h3 className="mb-3 mt-3 fs-4">Edit Advert</h3>
            </Col>
          </Row>

          <Row>
            <Col>
              <Formik
                enableReinitialize
                validationSchema={schema}
                onSubmit={formSubmit}
                initialValues={initialValues}
              >
                <Form as={FormikForm}>
                  <Form.Label htmlFor="files-input">
                    Upload images (.jpg, .jpeg, .png, .webp)
                  </Form.Label>
                  <Dropzone
                    uploadCallback={uploadCallback}
                    removeCallback={removeCallback}
                    acceptedExtensions={acceptedDroppedFilesExtensions}
                    alreadyUploaded={alreadyUploadedImages}
                    removeAlreadyUploadedCallback={removeAlreadyUploadedImageCallback}
                  />
                  <Card body className="mt-3 mb-4">
                    <TextInput
                      className="mb-2"
                      id="title-input"
                      type="text"
                      name="title"
                      placeholder="for example. iPhone 11"
                      label="Title*"
                    />

                    <TextInput
                      className="mb-2"
                      label="Description*"
                      muted="Please enter at least 20 characters."
                      id="description-input"
                      type="textarea"
                      name="description"
                    />

                    <TextInput
                      className="mb-1"
                      label="Price*"
                      id="price-input"
                      aria-label="Amount (to the nearest dollar)"
                      type="number"
                      name="price"
                    />

                    <CheckboxInput name="negotiable" label="Price is negotiable" className="mb-2" />

                    <TextInput
                      className="mb-2"
                      label="Localization*"
                      id="localization-input"
                      type="text"
                      name="localization"
                    />

                    <TextInput
                      className="mb-4"
                      label="Phone Number*"
                      id="phone-input"
                      placeholder="+xx xxx-xxx-xxx"
                      type="text"
                      name="phone"
                    />

                    <SubmitBtn className="btn-dark btn-sm px-4 py-2 d-flex float-end btn-lg">
                      Edit Advert
                    </SubmitBtn>
                  </Card>
                </Form>
              </Formik>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default EditAdvert;
