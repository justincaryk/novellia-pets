'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAtom } from 'jotai';
import { FormEvent, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

import Button from '@/components/parts/form/button';
import FormField from '@/components/parts/form/form-field';
import { PRIVATE_ROUTES } from '@/constants';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCurrentUser, useSetCurrentUser } from '../auth/atoms/current-user';
import { PET_FORM_FIELDS, PetAddSchema } from './types';

export default function FirstPetForm() {
  const router = useRouter();
  const [_, setCurrentUser] = useAtom(useSetCurrentUser);
  const [currentUser] = useAtom(useCurrentUser);

  // pauseOnRoute is only used on initial signup to prevent the auth provider from rerouting to dashboard
  // which is the only time this view should be rendered
  useEffect(() => {
    if (currentUser?.pauseOnRoute) {
      setCurrentUser({
        ...currentUser,
        pauseOnRoute: false,
      });
    }
  }, [currentUser, setCurrentUser]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    mode: 'onSubmit',
    resolver: yupResolver(PetAddSchema),
  });

  const trySubmit = async (data: Yup.InferType<typeof PetAddSchema>) => {
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
        label="Pet Name"
        placeholder="Pet name"
        type="text"
        errors={errors.name}
        required
        {...register(PET_FORM_FIELDS.NAME)}
      />

      <FormField
        label="Date of birth"
        placeholder="Date of birth"
        type="date"
        max={new Date().toISOString().split('T')[0]}
        errors={errors.dob}
        required
        {...register(PET_FORM_FIELDS.DOB)}
      />

      <FormField
        label="Pet type"
        placeholder="Pet type"
        type="text"
        errors={errors.animal}
        required
        {...register(PET_FORM_FIELDS.ANIMAL)}
      />

      {/* TODO: form submit error */}
      {/* <div className="text-red-error" role="alert">
            {signinError ? signinError : ''}
          </div> */}

      <div className="flex gap-x-4 items-center justify-end">
        <Link href={PRIVATE_ROUTES.UPDATE_NAME} className="w-1/3">
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
