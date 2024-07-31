'use client';

import { useRouter } from 'next/navigation';

import SignInForm from '@/components/auth/login-form';
import AuthSwitchFooter from '@/components/parts/auth-switch-footer';
import PageTitle from '@/components/parts/page-title';
import { COMPANY_NAME, PRIVATE_ROUTES, PUBLIC_ROUTES } from '@/constants';

export default function SigninPage() {
  const router = useRouter();

  const onFormSubmitSuccess = () => {
    router.push(PRIVATE_ROUTES.DASHBOARD);
  };

  return (
    <div className="space-y-10">
      <PageTitle text={'Sign in.'} />

      <SignInForm onSuccess={onFormSubmitSuccess} />

      <AuthSwitchFooter
        to={PUBLIC_ROUTES.SIGNUP}
        text={`New to ${COMPANY_NAME}?`}
        linkText="Create an account"
      />
    </div>
  );
}
