import React, { FC } from 'react';

interface AdvertsAmountTextProps {
  total: number;
}

const AdvertsAmountText: FC<AdvertsAmountTextProps> = ({ total }) => {
  return (
    <span className="fs-5">
      Found {total} {total > 1 || total == 0 ? 'adverts' : 'advert'}
    </span>
  );
};

export default AdvertsAmountText;
