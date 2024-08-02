'use client';

import { atom } from 'jotai';

export interface CurrentUser {
  userId: string;
  email: string;
  userRole: 'role_user' | 'role_admin';
  jwt: string;
  pauseOnRoute?: boolean;
}

export const useCurrentUser = atom<CurrentUser | null>(null);

export const useSetCurrentUser = atom(null, (get, set, currentUser: CurrentUser) => {
  set(useCurrentUser, currentUser);
});
