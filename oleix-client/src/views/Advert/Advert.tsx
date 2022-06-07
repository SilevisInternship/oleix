import React, { FC, useEffect, useState } from 'react';
import { Col, Container, Row, Card, Stack, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { DetailedAdvertListItemResponse } from '../../interfaces/DetailedAdvertListItemResponse';
import axios from 'axios';
import { getDate } from '../../utilities/get-date';
import GalleryView from '../../components/GalleryView/GalleryView';
import DisplayPhoneNumber from '../../components/DisplayPhoneNumber/DisplayPhoneNumber';
import { TelephoneFill, GeoAltFill } from 'react-bootstrap-icons';
import Loader from '../../components/Loader/Loader';

const Advert: FC = () => {
  const { id } = useParams<{ id: string }>();
  const [advert, setAdvert] = useState<DetailedAdvertListItemResponse | undefined>(undefined);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({ error: false, message: 'No message' });
  const [gotPhoneNumber, setGotPhoneNumber] = useState(false);

  // * Fetching the data for a given advert ID
  useEffect(() => {
    if (!id) return;

    setIsLoading(true);
    const fetchData = async (): Promise<DetailedAdvertListItemResponse> => {
      const { data } = await axios.get<DetailedAdvertListItemResponse>('/api/adverts/' + id);
      return data;
    };

    fetchData()
      .then((data: DetailedAdvertListItemResponse) => {
        setAdvert(data);
        setIsLoading(false);
      })
      .catch(({ response }) => {
        setIsLoading(false);
        setError({ error: true, message: 'Advert not found.' });
      });
  }, []);

  if (error.error) {
    return (
      <Container className="d-flex justify-content-center align-items-center flex-column h-100">
        <span className="m-auto fs-1">404</span>
        <p className="m-auto fs-4">{error.message}</p>
      </Container>
    );
  }

  return (
    <Container>
      {isLoading ? (
        <Loader center={true} />
      ) : (
        <>
          <GalleryView images={advert?.images.map((image) => image.imageUrl)} />

          {/* Advert data. */}
          <Row className="mt-2">
            <Col>
              <Card className="mx-5 mb-1">
                <Card.Body>
                  <Card.Subtitle className="mb-2 text-muted fs-7em mb-0">
                    Added - {getDate(advert?.createdAt)}
                  </Card.Subtitle>
                  <Card.Title className="fs-4 mb-0">{advert?.title}</Card.Title>
                  <Card.Text className="fs-3 text fw-bold mb-0">{advert?.price} zł</Card.Text>
                  {advert?.negotiable && (
                    <Card.Text className="fs-8em text-uppercase">To negotiate</Card.Text>
                  )}
                  <Card.Text className="fs-5 fw-bold mb-0 mt-2">Description</Card.Text>
                  <Card.Text>{advert?.description}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Advertiser data. */}
          <Row>
            <Col>
              <Card className="mx-5 my-1 p-2 mb-5">
                <Card.Body>
                  <Row>
                    <Col>
                      <Stack direction="vertical" gap={1}>
                        <Col>
                          <Card.Subtitle className="mb-0">{advert?.author?.username}</Card.Subtitle>
                        </Col>
                        <Col>
                          <Card.Title className="fs-8em text-muted d-flex gap-1 align-items-center">
                            <GeoAltFill className="size-16-px" />
                            {advert?.localization}
                          </Card.Title>
                        </Col>
                      </Stack>
                    </Col>

                    <Col className="d-flex justify-content-end">
                      {gotPhoneNumber ? (
                        <DisplayPhoneNumber id={advert?.author?.userId} />
                      ) : (
                        <Button
                          variant="outline-dark"
                          className="px-4 call-btn d-flex align-items-center gap-2"
                          onClick={() => setGotPhoneNumber(true)}
                        >
                          <TelephoneFill className="size-16-px" />
                          Show number
                        </Button>
                      )}
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default Advert;
