import React, { FC } from 'react';
import { Spinner } from 'react-bootstrap';

interface LoaderProps {
  small?: boolean;
  center?: boolean;
}

const Loader: FC<LoaderProps> = ({ small = false, center = false }) => {
  return (
    <Spinner
      className={center ? 'position-absolute top-50 start-50' : 'm-auto'}
      animation="border"
      role="status"
      size={small ? 'sm' : undefined}
    >
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  );
};

export default Loader;
