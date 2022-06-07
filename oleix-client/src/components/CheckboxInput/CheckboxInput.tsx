import React, { FC, useId } from 'react';
import { useField, useFormikContext } from 'formik';
import { Form } from 'react-bootstrap';

interface CheckboxInputProps {
  name: string;
  label: string;
  className?: string;
  id?: string;
}

const CheckboxInput: FC<CheckboxInputProps> = ({ name, id, label, className = '' }) => {
  const generatedId = useId();
  const [field, meta] = useField({ name, type: 'checkbox' });
  const inputId = id || generatedId;

  return (
    <Form.Group>
      <Form.Check
        id={inputId}
        name={name}
        label={label}
        onChange={field.onChange}
        isInvalid={!!meta.error}
        feedback={meta.error}
        className={className}
        checked={field.checked}
      />
    </Form.Group>
  );
};
export default CheckboxInput;
