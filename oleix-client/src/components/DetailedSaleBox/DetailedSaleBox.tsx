import React, { FC, SyntheticEvent } from 'react';
import { Card, Col, Row, Image, Stack } from 'react-bootstrap';
import { AdvertListItemResponse } from '../../interfaces/AdvertListItemResponse';
import NoImage from '../../assets/png/noimage.png';
import { getDate } from '../../utilities/get-date';
import AuthorManagementButtons from '../AuthorManagementButtons/AuthorManagementButtons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toastr from 'toastr';

interface DetailedSaleBoxProps {
  advert: AdvertListItemResponse;
  clickEvent: () => any;
  isAuthor?: boolean;
  onDelete?: (id: string) => void;
}

const DetailedSaleBox: FC<DetailedSaleBoxProps> = ({
  clickEvent,
  advert,
  isAuthor = false,
  onDelete,
}) => {
  const { advertId, title, price, mainImageUrl, localization, createdAt, negotiable } = advert;
  const navigate = useNavigate();

  const imageNotLoaded = (e: SyntheticEvent<HTMLImageElement>): void => {
    e.currentTarget.src = NoImage;
  };

  // * --  Author advert management buttons.

  const onEditClicked = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    navigate(`/adverts/${advertId}/edit`);
  };

  const onDeleteClicked = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    try {
      await axios.delete(`/api/adverts/${advertId}`);
    } finally {
      toastr.success(`Successfully deleted advert ${title}`);

      if (onDelete) {
        onDelete(advertId);
        navigate('/adverts/me');
      }
    }
  };

  return (
    <Card className="cursor-pointer" onClick={() => clickEvent()}>
      <Row className="py-2 px-0 gap-2">
        <Col xs={12} sm="auto" className="d-flex justify-content-center">
          <Image
            onError={imageNotLoaded}
            src={mainImageUrl || NoImage}
            alt={title}
            width={200}
            height={200}
            className="object-fit-cover size-200-px"
          />
        </Col>

        <Col className="d-flex flex-column gap-1">
          <Row>
            <Col>
              <Stack direction="horizontal" gap={3}>
                <Card.Title>{title}</Card.Title>
                <Stack direction="vertical" gap={0}>
                  <Card.Text className="mb-0 text-end fw-bold">{price} ZŁ</Card.Text>
                  {negotiable && (
                    <Card.Text className="text-lowercase text-end fs-7em">To negotiate</Card.Text>
                  )}
                </Stack>
              </Stack>
            </Col>
          </Row>
          <Row className="mt-auto">
            <Col className="d-flex align-items-center justify-content-between">
              <Stack direction="horizontal" className="w-100" gap={3}>
                <Card.Text className="fs-8em mb-0 mt-auto">
                  {`${localization ? localization : 'No localization'} • ${getDate(createdAt)}`}
                </Card.Text>

                {isAuthor && (
                  <AuthorManagementButtons
                    className="ml-auto"
                    onDeleteClicked={onDeleteClicked}
                    onEditClicked={onEditClicked}
                  />
                )}
              </Stack>
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  );
};

export default DetailedSaleBox;
