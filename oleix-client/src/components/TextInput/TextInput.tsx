import React, { FC, useId } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import { useField } from 'formik';

interface TextInputProps {
  className?: string;
  name: string;
  label?: string;
  id?: string;
  placeholder?: string;
  type?: string;
  muted?: string;
  additional?: { start?: string | null; end?: string | null };
}

const TextInput: FC<TextInputProps> = ({
  name,
  id,
  placeholder = '',
  label,
  type = 'text',
  className = '',
  muted,
  additional = { start: null, end: null },
}) => {
  const generatedId = useId();
  const [field, meta] = useField(name);

  const inputId = id || generatedId;

  return (
    <Form.Group className={className}>
      <Form.Label htmlFor={inputId} className="mb-0">
        {label}
      </Form.Label>

      <InputGroup>
        {additional.start !== null && <InputGroup.Text>{additional.start}</InputGroup.Text>}
        <Form.Control
          type={type}
          name={name}
          id={inputId}
          placeholder={placeholder}
          isInvalid={meta.touched && !!meta.error}
          value={field.value}
          onChange={field.onChange}
          onBlur={field.onBlur}
        />
        {additional.end !== null && <InputGroup.Text>{additional.end}</InputGroup.Text>}
      </InputGroup>

      {muted && <Form.Text muted>{muted}</Form.Text>}
      <Form.Control.Feedback type="invalid">{meta.touched && meta.error}</Form.Control.Feedback>
    </Form.Group>
  );
};

export default TextInput;
