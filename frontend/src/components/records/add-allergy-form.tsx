'use client';

import { useAtom } from 'jotai';
import { FormEvent, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

import Button from '@/components/parts/form/button';
import FormField from '@/components/parts/form/form-field';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCurrentUser, useSetCurrentUser } from '../auth/atoms/current-user';
import { AllergyFormSchema, RECORD_FORM_FIELDS } from './types';

interface AddAllergyFormProps {
  onSuccess: (data: Yup.InferType<typeof AllergyFormSchema>) => void;
}
export default function AddAllergyForm({ onSuccess }: AddAllergyFormProps) {
  const [_, setCurrentUser] = useAtom(useSetCurrentUser);
  const [currentUser] = useAtom(useCurrentUser);

  // pauseOnRoute is only used immediately after signup to prevent
  // the auth provider from rerouting directly to dashboard
  useEffect(() => {
    if (currentUser?.pauseOnRoute) {
      setCurrentUser({
        ...currentUser,
        pauseOnRoute: false,
      });
    }
  }, [currentUser, setCurrentUser]);

  // base form code
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onSubmit',
    resolver: yupResolver(AllergyFormSchema),
  });

  // this really doesn't need to do anything
  const trySubmit = async (data: Yup.InferType<typeof AllergyFormSchema>) => {
    console.log('base form data: ', data);
    onSuccess(data);
    return;
  };

  return (
    <form
      className="space-y-2"
      key={2}
      onSubmit={(e: FormEvent) => void handleSubmit(trySubmit)(e)}
      noValidate
    >
      <FormField
        label="Record name"
        placeholder="Record name"
        type="text"
        errors={errors.name}
        required
        {...register(RECORD_FORM_FIELDS.NAME)}
      />

      <FormField
        label="Reaction symptoms"
        placeholder="Reaction symptoms"
        type="text"
        errors={errors.reactions}
        required
        {...register(RECORD_FORM_FIELDS.REACTIONS)}
      />

      <FormField
        label="Severity"
        placeholder="Severity"
        type="select"
        errors={errors.severity}
        options={[
          { text: 'mild', value: 'mild' },
          { text: 'servere', value: 'severe' },
        ]}
        required
        {...register(RECORD_FORM_FIELDS.SEVERITY)}
      />

      <Button type="submit">Save New Record</Button>
    </form>
  );
}
