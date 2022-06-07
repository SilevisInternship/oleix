import React, { FC } from 'react';
import { Form, FormControl, InputGroup } from 'react-bootstrap';
import NumberFormat from 'react-number-format';
import { useField } from 'formik';

interface PhoneInputProps {
  name: string;
  className?: string;
  label?: string;
  format?: string;
  mask?: string;
}

const PhoneInput: FC<PhoneInputProps> = ({ name, className, label, format, mask }) => {
  const [field, meta] = useField(name);

  return (
    <Form.Group>
      <Form.Label className="mb-0">{label}</Form.Label>
      <InputGroup>
        <InputGroup.Text>+48</InputGroup.Text>
        <NumberFormat
          allowEmptyFormatting
          mask={mask}
          format={format}
          className={className}
          name={name}
          value={field.value}
          onChange={field.onChange}
          onBlur={field.onBlur}
          customInput={FormControl}
          isInvalid={meta.touched && !!meta.error}
        />
      </InputGroup>
      <Form.Control.Feedback type="invalid">{meta.touched && meta.error}</Form.Control.Feedback>
    </Form.Group>
  );
};
export default PhoneInput;
