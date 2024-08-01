'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

import Button from '@/components/parts/form/button';
import PageTitle from '@/components/parts/page-title';
import SkipLink from '@/components/parts/skip-link';
import { usePetsApi } from '@/components/pets/pets-api';
import { PetWithAnimal } from '@/components/pets/types';
import AddRecordForm from '@/components/records/add-base-record-form';
import { getAvatarCompatibleColor, getSuitableAnimalAvatar } from '@/utils/utils';

// this causes errors during server hydration and must be dynamically imported
const Animal = dynamic(() => import('react-animals'), { ssr: false });

export default function Dashboard() {
  const [activePet, setActivePet] = useState<PetWithAnimal | null>(null);
  const [activeColorIndex, setActiveColorIndex] = useState(-1);
  const { data: pets } = usePetsApi().getPets;
  const [addRecordFormActive, toggleAddRecordFormActive] = useState(false);

  const onAddPetClick = (e: unknown) => {};

  useEffect(() => {
    if (pets?.allPets?.nodes.length && !activePet) {
      setActivePet(pets.allPets.nodes[0] as PetWithAnimal);
      setActiveColorIndex(0);
    }
  }, [pets]);

  const handlePetClick = (pet: PetWithAnimal, i: number) => {
    setActivePet(pet);
    setActiveColorIndex(i);
  };
  const handleAddRecordClick = () => {
    toggleAddRecordFormActive(!addRecordFormActive);
  };

  return (
    <div className="space-y-4 w-full max-w-screen-lg">
      {/* TODO update skip links */}
      {/* <SkipLink href="#page-title" skipLinkText="Skip to Page Title" />
      <SkipLink href="#dashboard-content" skipLinkText="Skip to Dashboard Content" /> */}
      <PageTitle id="page-title" text="Dashboard" />
      <div id="dashboard-content" className="space-y-6">
        {/* action row: */}
        <div className="w-full border p-6 bg-white rounded-md shadow shadow-slate-200">
          {/* add pet button, update user record */}

          <Button type="button" onClick={onAddPetClick} className="w-auto">
            + Add pet
          </Button>
        </div>

        <div className="w-full grid grid-cols-3 rounded-md gap-x-4">
          {/* all pets container (1/3 w) */}
          <div className="col-span-1 rounded bg-white p-4 shadow shadow-slate-200 space-y-2">
            <div className="font-bold text-xl border-b pb-2">My pets</div>
            {pets?.allPets?.nodes.map((pet, i) => (
              <div
                key={pet.id}
                className="flex gap-x-2 cursor-pointer align-middle rounded p-2 hover:bg-slate-200"
                role="button"
                onClick={() => handlePetClick(pet as PetWithAnimal, i)}
              >
                <Animal
                  name={getSuitableAnimalAvatar(pet.animalByAnimalId?.name || '')}
                  circle
                  color={getAvatarCompatibleColor(i)}
                  size="55px"
                />
                <div>
                  <div className="font-bold text-lg">{pet.name}</div>
                  <div className="text-sm">Born {new Date(pet.dob).toDateString()}</div>
                </div>
              </div>
            ))}
            {/* empty results */}
            {!pets?.allPets?.nodes.length ? <div>No pets found. Go add a new pet!</div> : null}
          </div>

          {/* pet detail container (2/3) */}
          <div className="col-span-2 bg-white w-full space-y-4 p-4 shadow shadow-slate-200">
            {/* container title */}
            <div className="flex justify-between align-middle border-b pb-2">
              {/* name and avatar */}
              <div className="flex gap-x-2 items-center">
                <Animal
                  name={getSuitableAnimalAvatar(activePet?.animalByAnimalId?.name || '')}
                  circle
                  color={getAvatarCompatibleColor(activeColorIndex)}
                  size="45px"
                />
                <div className="text-4xl font-bold">{activePet?.name}</div>
              </div>

              {/* pet summary */}
              <div>
                <div>Date of birth: {new Date(activePet?.dob).toDateString()}</div>
                <div>
                  Pet type: <span className="capitalize">{activePet?.animalByAnimalId?.name}</span>
                </div>
                <div>Created at: {new Date(activePet?.dob).toDateString()}</div>
              </div>
            </div>

            {/* pet record summary */}
            <div className="flex justify-between w-full align-center">
              <div className="font-bold text-2xl">Records</div>
              <div>
                <Button
                  type="button"
                  className={`w-auto ${addRecordFormActive ? 'bg-red-error text-white hover:bg-red-900 hover:text-white' : ''}`}
                  onClick={handleAddRecordClick}
                >
                  {addRecordFormActive ? 'Discard changes' : '+ Add record'}
                </Button>
                {/* TODO: sort by type, sort by date created */}
              </div>
            </div>

            {/* add record form */}
            {addRecordFormActive ? <AddRecordForm onSuccess={handleAddRecordClick} /> : null}

            {/* records list */}
            {!addRecordFormActive ? (
              <div>
                <div>Record 1</div>
                <div>Record 2</div>
                <div>Record 3</div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
