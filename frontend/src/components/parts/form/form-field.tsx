'use client';

import React, {
  InputHTMLAttributes,
  KeyboardEvent,
  SelectHTMLAttributes,
  useImperativeHandle,
  useRef,
} from 'react';
import { FieldError } from 'react-hook-form';

import Dropdown from './dropdown';
import Input from './input';
import Label from './label';
import Password from './password';

// interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
//   label?: string;
//   errors?: FieldError;
//   name: string;
// }

interface BaseFormFieldProps {
  label?: string;
  errors?: FieldError;
  name: string;
}

interface InputFormFieldProps extends BaseFormFieldProps, InputHTMLAttributes<HTMLInputElement> {
  type: 'input' | 'password' | 'text' | 'date' | 'email';
  name: string;
}

interface SelectFormFieldProps extends BaseFormFieldProps, SelectHTMLAttributes<HTMLSelectElement> {
  type: 'select';
  name: string;
  placeholder: string;
  options: {
    text: string;
    value?: string | number;
  }[];
}

type FormFieldProps = InputFormFieldProps | SelectFormFieldProps;

const FormField = React.forwardRef(
  ({ label, errors, name, ...rest }: FormFieldProps, ref: React.ForwardedRef<HTMLInputElement>) => {
    const inputRef = useRef<HTMLInputElement | null>(null);

    // Expose the inputRef through the forwarded ref
    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    const handleLabelClick = () => {
      inputRef?.current?.focus();
    };

    const handleKeydown = (e: KeyboardEvent<HTMLLabelElement>) => {
      if (e.key === '10' || e.key === 'Enter' || e.keyCode === 10) {
        inputRef?.current?.focus();
      }
    };

    return (
      <div className="space-y-2">
        {label ? (
          <Label text={label} htmlFor={name} onClick={handleLabelClick} onKeyDown={handleKeydown} />
        ) : null}
        {/* {rest.type === 'password' ? (
          <Password errors={errors} name={name} {...rest} ref={ref} aria-describedby={name} />
        ) : (
          <Input errors={errors} name={name} {...rest} ref={ref} aria-describedby={name} />
        )} */}
        {rest.type === 'password' ? (
          <Password
            errors={errors}
            name={name}
            {...rest}
            ref={ref as React.Ref<HTMLInputElement>}
            aria-describedby={name}
          />
        ) : null}

        {rest.type === 'select' ? (
          <Dropdown
            name={name}
            errors={errors}
            {...rest}
            ref={ref as React.Ref<HTMLSelectElement>}
            aria-describedby={name}
          />
        ) : null}

        {rest.type !== 'select' && rest.type !== 'password' ? (
          <Input
            errors={errors}
            name={name}
            {...rest}
            ref={ref as React.Ref<HTMLInputElement>}
            aria-describedby={name}
          />
        ) : null}

        <div
          className="text-red-error "
          role="alert"
          aria-label={name}
          data-testid={`signin-input-error-${name}`}
        >
          {errors?.message}
        </div>
      </div>
    );
  },
);

FormField.displayName = 'FormField';
export default FormField;
