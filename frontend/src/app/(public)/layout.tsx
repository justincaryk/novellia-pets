'use client';

import React from 'react';

import { COMPANY_NAME } from '@/constants';
import reportAccessibility from '@/utils/report-accessibility';

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative h-screen">
      <div className="w-full flex justify-center items-center py-2" role="banner">
        <div className="font-bold text-6xl text-blue-dark">{COMPANY_NAME}</div>
        <div className="rounded-full bg-blue-dark ml-2 p-1">
          <div className="rounded-full bg-blue-light p-1">
            <img src="novellia-pets.png" className="max-h-14" alt={`${COMPANY_NAME} Logo`} />
          </div>
        </div>
      </div>
      <main className="flex justify-center py-10 lg:py-6">
        <div className="max-w-2xl w-full px-10">{children}</div>
      </main>
    </div>
  );
}

void reportAccessibility(React);

export default AuthLayout;
