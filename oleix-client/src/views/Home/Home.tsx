import React, { FC, useEffect, useState } from 'react';
import { Container, Row } from 'react-bootstrap';
import axios from 'axios';
import { AdvertListItemResponse } from '../../interfaces/AdvertListItemResponse';
import DetailedSaleBox from '../../components/DetailedSaleBox/DetailedSaleBox';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Search from '../../components/Search/Search';
import PagePagination from '../../components/Pagination/Pagination';
import Loader from '../../components/Loader/Loader';
import AdvertsAmountText from 'components/AdvertsAmountText/AdvertsAmountText';

const Home: FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [adverts, setAdverts] = useState<AdvertListItemResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activePage, setActivePage] = useState<number>(Number(searchParams.get('page')) || 1);
  const [totalAdverts, setTotalAdverts] = useState<number>(0);

  const perPage = 10;
  const [queryParams, setQueryParams] = useState({
    skip: perPage * ((Number(searchParams.get('page')) || activePage) - 1),
    take: perPage,
    searchPhrase: searchParams.get('searchPhrase') || '',
    localization: searchParams.get('localization') || '',
    sort: 'desc',
  });

  const replaceSearchParams = (
    searchPhrase: string | null = null,
    localization: string | null = null,
    page: number | null | string = 1
  ) => {
    const params = {
      ...(searchPhrase !== null && searchPhrase !== '' && { searchPhrase }),
      ...(localization !== null && localization !== '' && { localization }),
      ...(page !== null && page !== '' && page !== '1' && page !== 1 && { page: '' + page }),
    };
    setSearchParams(params);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const { data, headers } = await axios.get<AdvertListItemResponse[]>(`/api/adverts`, {
          params: queryParams,
        });

        const total = Number(headers['x-total-count']) || Number(headers['total-count']) || 0;
        setTotalAdverts(total);
        setAdverts(data);

        if (queryParams.skip > total) {
          setActivePage(1);
          replaceSearchParams(
            searchParams.get('searchPhrase'),
            searchParams.get('localization'),
            1
          );
        }
      } catch (e) {
      } finally {
        setIsLoading(false);
      }
    };

    fetchData().then();
  }, [activePage, queryParams]);

  const cardClickEvent = (advert: AdvertListItemResponse) => {
    // * Redirect to the detailed advert page.
    if (!advert.advertId) {
      return;
    }

    navigate('/adverts/' + advert.advertId);
  };

  const paginate = (page: number): void => {
    if (page === activePage || page <= 0 || page > Math.ceil(totalAdverts / perPage)) {
      return;
    }

    replaceSearchParams(searchParams.get('searchPhrase'), searchParams.get('localization'), page);
    setQueryParams({ ...queryParams, skip: perPage * (page - 1) });
    setActivePage(page);
  };

  const searchCallback = (search: string, localization: string) => {
    replaceSearchParams(search, localization, searchParams.get('page'));
    setActivePage(1);
    setQueryParams({ ...queryParams, skip: 0, searchPhrase: search, localization: localization });
  };

  return (
    <Container>
      {isLoading ? (
        <Loader center={true} />
      ) : (
        <>
          <Search callback={searchCallback} />
          <Row xs={1} md={1} lg={1} className="g-4 py-5 mt-1">
            <AdvertsAmountText total={totalAdverts || 0} />
            {adverts?.map((advert) => (
              <DetailedSaleBox
                key={advert.advertId}
                advert={advert}
                clickEvent={() => cardClickEvent(advert)}
              />
            ))}
          </Row>
          <PagePagination
            total={totalAdverts}
            per_page={perPage}
            paginate={paginate}
            active={activePage}
          />
        </>
      )}
    </Container>
  );
};

export default Home;
