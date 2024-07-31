'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

import Button from '@/components/parts/form/button';
import FormField from '@/components/parts/form/form-field';
import PageSubtitle from '@/components/parts/page-subtitle';
import PageTitle from '@/components/parts/page-title';
import SkipLink from '@/components/parts/skip-link';
import { PRIVATE_ROUTES } from '@/constants';
import { yupResolver } from '@hookform/resolvers/yup';
import { USER_NAME_FORM_FIELDS, UserNameSchema } from './types';

export default function UserNameForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    mode: 'onSubmit',
    resolver: yupResolver(UserNameSchema),
  });

  const trySubmit = async (data: Yup.InferType<typeof UserNameSchema>) => {
    console.log('data: ', data);

    // try {
    //   const res = await fetch('/api/sign-in', {
    //     method: 'POST',
    //     body: JSON.stringify(data),
    //   });

    //   const status = res.status;
    //   const result = (await res.json()) as SigninResponsePayload;

    //   if (status === 200) {
    //     if (result.code === 'ok') {
    //       // artificial sleep timer for debugging transition states
    //       // await sleep(1500);
    //     }
    //   }
    // } catch (err) {
    //   // TODO: set general error
    //   console.error('error: ', err);
    // }
  };

  return (
    <form
      className="space-y-6"
      onSubmit={(e: FormEvent) => void handleSubmit(trySubmit)(e)}
      noValidate
    >
      <FormField
        label="First name"
        placeholder="First name"
        type="text"
        errors={errors.firstName}
        required
        {...register(USER_NAME_FORM_FIELDS.FIRST_NAME)}
      />

      <FormField
        label="Last name"
        placeholder="Last name"
        type="text"
        errors={errors.lastName}
        required
        {...register(USER_NAME_FORM_FIELDS.LAST_NAME)}
      />

      {/* TODO: form submit error */}
      {/* <div className="text-red-error" role="alert">
            {signinError ? signinError : ''}
          </div> */}

      <div className="flex gap-x-4 items-center justify-end">
        <Link href={PRIVATE_ROUTES.DASHBOARD} className="w-1/3">
          <Button type="button">Skip</Button>
        </Link>
        <div className="w-2/3">
          <Button primary type="submit" disabled={isValid} aria-disabled={isValid}>
            Continue
          </Button>
        </div>
      </div>
    </form>
  );
}
