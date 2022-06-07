import React, { FC, useEffect, useState } from 'react';
import { Container, Row, Stack } from 'react-bootstrap';
import { AdvertListItemResponse } from '../../interfaces/AdvertListItemResponse';
import DetailedSaleBox from '../../components/DetailedSaleBox/DetailedSaleBox';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import useAuth from '../../hooks/useAuth';
import AdvertsAmountText from '../../components/AdvertsAmountText/AdvertsAmountText';
import PagePagination from '../../components/Pagination/Pagination';
import Loader from '../../components/Loader/Loader';

const MyAdverts: FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [adverts, setAdverts] = useState<AdvertListItemResponse[]>([]);
  const [totalAdverts, setTotalAdverts] = useState<number>(0);
  const [activePage, setActivePage] = useState<number>(Number(searchParams.get('page')) || 1);

  const { auth } = useAuth();

  const perPage: number = 10;
  const authorId: string | null = auth?.userId || null;
  const username: string | null = auth?.username || 'Unknown';

  const [queryParams, setQueryParams] = useState({
    skip: perPage * ((Number(searchParams.get('page')) || activePage) - 1),
    take: perPage,
    authorId,
    sort: 'desc',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const { data, headers } = await axios.get<AdvertListItemResponse[]>(`/api/adverts`, {
          params: queryParams,
        });

        setTotalAdverts(Number(headers['x-total-count']) || Number(headers['total-count']) || 0);
        setAdverts(data);
      } catch (e) {
      } finally {
        setIsLoading(false);
      }
    };

    if (authorId !== null) {
      fetchData().then();
    }
  }, [activePage, queryParams]);

  const replaceSearchParams = (page: number | null | string = 1) => {
    setSearchParams({
      ...(page !== null && page !== '' && page !== '1' && page !== 1 && { page: '' + page }),
    });
  };

  const paginate = (page: number): void => {
    if (page === activePage || page <= 0 || page > Math.ceil(totalAdverts / perPage)) {
      return;
    }

    replaceSearchParams(page);
    setQueryParams({ ...queryParams, skip: perPage * (page - 1) });
    setActivePage(page);
  };

  const cardClickEvent = (advert: AdvertListItemResponse) => {
    // * Redirect to the detailed advert page.
    if (!advert.advertId) {
      return;
    }

    navigate('/adverts/' + advert.advertId);
  };

  return (
    <Container>
      {isLoading ? (
        <Loader center={true} />
      ) : (
        <>
          <Stack direction="vertical">
            <span className="fs-3 mt-2">{username}'s adverts</span>
            <Row xs={1} md={1} lg={1} className="g-4 py-5 mt-2">
              <AdvertsAmountText total={totalAdverts || 0} />
              {adverts && adverts.length > 0 ? (
                <>
                  {adverts?.map((advert) => (
                    <DetailedSaleBox
                      key={advert.advertId}
                      advert={advert}
                      clickEvent={() => cardClickEvent(advert)}
                      isAuthor={true}
                      onDelete={(id) => {
                        setAdverts(adverts.filter((adv) => adv.advertId !== id));
                      }}
                    />
                  ))}
                </>
              ) : (
                <p>No adverts to display. Add one!</p>
              )}
            </Row>
          </Stack>

          <PagePagination
            total={totalAdverts}
            per_page={perPage}
            active={activePage}
            paginate={paginate}
          />
        </>
      )}
    </Container>
  );
};

export default MyAdverts;
