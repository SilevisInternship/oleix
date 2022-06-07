import { useFormikContext } from 'formik';
import { Button } from 'react-bootstrap';
import React, { FC, ReactNode } from 'react';

interface SubmitBtnProps {
  children: ReactNode;
  className?: string;
  variant?: string;
}

const SubmitBtn: FC<SubmitBtnProps> = ({ children, className, variant }) => {
  const { isSubmitting } = useFormikContext();

  return (
    <Button variant={variant} type="submit" className={className} disabled={isSubmitting}>
      {isSubmitting ? 'Loading' : children}
    </Button>
  );
};

export default SubmitBtn;
