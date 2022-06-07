import React, { FC } from 'react';
import { Form, FormControl } from 'react-bootstrap';
import NumberFormat from 'react-number-format';
import { useField } from 'formik';

interface PriceInputProps {
  name: string;
  className?: string;
  label?: string;
  suffix?: string;
}

const PriceInput: FC<PriceInputProps> = ({ name, suffix, label, className }) => {
  const [field, meta, helpers] = useField(name);

  return (
    <Form.Group>
      <Form.Label>{label}</Form.Label>
      <NumberFormat
        className={className}
        name={name}
        suffix={suffix}
        value={field.value}
        onValueChange={(inputNumber) => helpers.setValue(inputNumber.floatValue)}
        onBlur={field.onBlur}
        decimalScale={2}
        customInput={FormControl}
        isInvalid={meta.touched && !!meta.error}
        allowedDecimalSeparators={[',', '.']}
        decimalSeparator={','}
        fixedDecimalScale
      />
      <Form.Control.Feedback type="invalid">{meta.touched && meta.error}</Form.Control.Feedback>
    </Form.Group>
  );
};
export default PriceInput;
