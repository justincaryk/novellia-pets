'use client';

import PageTitle from '@/components/parts/page-title';
import { usePetsApi } from '@/components/pets/pets-api';
import { useUsersApi } from '@/components/users/users-api';

export default function AdminPage() {
  const { data: users } = useUsersApi().getUsers;
  const { data: petsFull } = usePetsApi().adminGetPetsFull;

  console.log('petsFull: ', petsFull);
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
        <div className="space-y-4 p-2 border rounded">
          <div className="border-b font-bold text-2xl">Users</div>
          <div className="font-bold">Total Count: {users?.allUsers?.totalCount}</div>

          <div className="grid grid-cols-3 p-2">
            <div>Email</div>
            <div>First name</div>
            <div>Last name</div>
          </div>
          {users?.allUsers?.nodes.map((user) => (
            <div key={user.id} className="grid grid-cols-3 gap-x-4 border-b p-2">
              <div className="font-bold">{user.email}</div>
              <div>{user.firstName || '-'}</div>
              <div>{user.lastName || '-'}</div>
            </div>
          ))}
          {/* expand -> all users pets */}
          {/* expand -> all users pets records */}
        </div>

        <div className="space-y-4 p-2 border rounded">
          <div className="border-b font-bold text-2xl">Pets and records</div>
          <div className="font-bold">Total Count: {petsFull?.allPets?.totalCount}</div>
          {petsFull?.allPets?.nodes.map((pet) => (
            <div key={pet.id} className="">
              <div>
                <div>Summary</div>
                <div>Name: {pet.name}</div>
                <div>DOB: {new Date(pet.dob).toDateString()}</div>
                <div>Type: {pet.animalByAnimalId?.name}</div>
                <div>Person: {pet.userByUserId?.email}</div>
              </div>

              <div>
                <div>Records</div>
                {pet.recordsByPetId.nodes.map((record) => (
                  <div key={record.id} className="">
                    <div>Allergy Records</div>
                    {record.allergyRecordsByRecordId.nodes.map((allergyRecord) => (
                      <div key={allergyRecord.id} className="">
                        <div>{allergyRecord.name}</div>
                        <div>{allergyRecord.reactions || 'none'}</div>
                        <div>{allergyRecord.severity}</div>
                      </div>
                    ))}
                    <div>Vaccine Records</div>
                    {record.vaccineRecordsByRecordId.nodes.map((vaccineRecord) => (
                      <div key={vaccineRecord.id} className="">
                        <div>{vaccineRecord.name}</div>
                        <div>{new Date(vaccineRecord.administeredAt).toDateString()}</div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
