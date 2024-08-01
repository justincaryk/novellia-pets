'use client';

import dynamic from 'next/dynamic';
import { useAtom } from 'jotai';
import { useState } from 'react';

import { useCurrentUser } from '@/components/auth/atoms/current-user';
import PageTitle from '@/components/parts/page-title';
import { useUsersApi } from '@/components/users/users-api';

// import SkipLink from '@/components/parts/skip-link';
// import { usePetsApi } from '@/components/pets/pets-api';
// import { useRecordsApi } from '@/components/records/records-api';
// import { MungedPetRecord } from '@/components/records/types';
// import { getAvatarCompatibleColor, getSuitableAnimalAvatar } from '@/utils/utils';
// import { BeakerIcon, SparklesIcon, XMarkIcon } from '@heroicons/react/24/outline';

// this causes errors during server hydration and must be dynamically imported
const Animal = dynamic(() => import('react-animals'), { ssr: false });

export default function AdminPage() {
  // should be moved to jotai
  // const [activePet, setActivePet] = useState<PetWithAnimal | null>(null);
  const [currentUser] = useAtom(useCurrentUser);
  const [addRecordFormActive, toggleAddRecordFormActive] = useState(false);
  // ugly, but quick method to maintain consistency between the avatar colors
  // in the pet list and active containers
  const [activeColorIndex, setActiveColorIndex] = useState(-1);
  // data fetching
  const { data: users } = useUsersApi().getUsers;

  console.log('users: ', users);
  //   const activePetRecords = useMemo(() => {
  //     const collated: MungedPetRecord[] = [];

  //     if (petRecords?.petById?.recordsByPetId.nodes.length) {
  //       for (const record of petRecords.petById.recordsByPetId.nodes) {
  //         record.allergyRecordsByRecordId.nodes.forEach((allergyRecord) => {
  //           const munged: MungedPetRecord = {
  //             recordId: record.id,
  //             userId: record.userId,
  //             petId: record.petId,
  //             recordType: record.recordType,
  //             createdAt: new Date(record.createdAt),
  //             type: 'allergy',
  //             name: allergyRecord.name,
  //             reactions: allergyRecord.reactions,
  //             severity: allergyRecord.severity,
  //             allergyRecordId: allergyRecord.id,
  //           };
  //           collated.push(munged);
  //         });

  //         record.vaccineRecordsByRecordId.nodes.forEach((vaccineRecord) => {
  //           const munged: MungedPetRecord = {
  //             recordId: record.id,
  //             userId: record.userId,
  //             petId: record.petId,
  //             recordType: record.recordType,
  //             createdAt: record.createdAt,
  //             type: 'vaccine',
  //             name: vaccineRecord.name,
  //             administeredAt: new Date(vaccineRecord.administeredAt),
  //           };
  //           collated.push(munged);
  //         });
  //       }
  //     }

  //     return collated;
  //   }, [petRecords?.petById?.recordsByPetId.nodes]);

  return (
    <div className="space-y-4 w-full max-w-screen-lg">
      {/* TODO fix skip links */}
      {/* <SkipLink href="#add-pet-container" skipLinkText="Skip to add a new pet" />
      <SkipLink href="#pets-list-container" skipLinkText="Skip to my pets" />
      <SkipLink href="#my-pet-records" skipLinkText="Skip to my pet records" /> */}

      <div id="admin-content" className="space-y-12">
        {/* add pet banner thing */}
        <div className="w-full border p-6 bg-white rounded-md shadow shadow-slate-200 space-y-6">
          {/* add pet button, update user record */}
          <div className="w-full flex justify-between items-center">
            <div className="flex gap-x-6 items-center">
              <PageTitle text={'Admin Dashboard'} />
            </div>
          </div>
        </div>

        {/* pseudo table elemt */}
        <div className="space-y-2">
          <div className="border-b">Users</div>
          <div>Total Count: {users?.allUsers?.totalCount}</div>
          {users?.allUsers?.nodes.map((user) => (
            <div key={user.id} className="grid grid-cols-3 gap-x-4">
              <div>{user.email}</div>
              <div>{user.firstName || '-'}</div>
              <div>{user.lastName || '-'}</div>
            </div>
          ))}
          {/* expand -> all users pets */}
          {/* expand -> all users pets records */}
        </div>

        <div className="border-b">
          all pets
          {/* all pets */}
        </div>

        <div className="border-b">
          all records
          {/* all records */}
        </div>
      </div>
    </div>
  );
}
