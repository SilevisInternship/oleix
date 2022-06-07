import React, { FC, useEffect, useState } from 'react';
import axios from 'axios';
import Loader from '../Loader/Loader';

interface DisplayPhoneNumberProps {
  id: string | undefined;
}

const DisplayPhoneNumber: FC<DisplayPhoneNumberProps> = ({ id }) => {
  const [fetchedNumber, setFetchedNumber] = useState<null | string>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchUserPhoneNumber = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(`/api/users/${id}/phone`);
        setFetchedNumber(data);
      } catch (e) {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserPhoneNumber().then();
  }, []);

  if (error) {
    return <p>Could not load the phone number</p>;
  }

  return (
    <>
      {isLoading ? (
        <Loader small={true} />
      ) : (
        <a className="display-phone-number" href={'tel:' + fetchedNumber?.trim()}>
          {fetchedNumber}
        </a>
      )}
    </>
  );
};

export default DisplayPhoneNumber;
