'use client';

import { useState } from 'react';

import RegisterForm from '@/components/auth/register-form';
import RegisterSuccess from '@/components/auth/register-success';
import AuthSwitchFooter from '@/components/parts/auth-switch-footer';
import PageTitle from '@/components/parts/page-title';
import { PUBLIC_ROUTES } from '@/constants';

export default function SignupPage() {
  const [successfullyRegistered, setSuccessfullyRegistered] = useState(false);

  const onFormSubmitSuccess = () => {
    setSuccessfullyRegistered(true);
  };

  return (
    <>
      {successfullyRegistered ? (
        <RegisterSuccess />
      ) : (
        <div className="space-y-10">
          <PageTitle text={'Create an account.'} />
          <RegisterForm onSuccess={onFormSubmitSuccess} />
          <AuthSwitchFooter to={PUBLIC_ROUTES.SIGNIN} text="Already a user?" linkText="Log in" />
        </div>
      )}
    </>
  );
}
