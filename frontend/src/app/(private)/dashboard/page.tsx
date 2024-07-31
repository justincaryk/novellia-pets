'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

import Button from '@/components/parts/form/button';
import PageTitle from '@/components/parts/page-title';
import SkipLink from '@/components/parts/skip-link';
import { usePetsApi } from '@/components/pets/pets-api';
import { PetWithAnimal } from '@/components/pets/types';
import { getAvatarCompatibleColor } from '@/utils/utils';

// this causes errors during server hydration and must be dynamically imported
const Animal = dynamic(() => import('react-animals'), { ssr: false });

export default function Dashboard() {
  const [activePet, setActivePet] = useState<PetWithAnimal | null>(null);
  const { data: pets } = usePetsApi().getPets;

  const onAddPetClick = (e: unknown) => {};

  useEffect(() => {
    if (pets?.allPets?.nodes.length && !activePet) {
      setActivePet(pets.allPets.nodes[0] as PetWithAnimal);
    }
  }, [pets]);

  const getSuitableAvatar = (name: string) => {
    switch (name) {
      case 'dog':
        return 'wolf';
      case 'cat':
        return 'leopard';
      case 'guinea pig':
        return 'capybara';
      case 'hamster':
        return 'wombat';
      case 'reptile':
        return 'snake';
      case 'bird':
        return 'duck';
      case 'fish':
        return 'kraken';
      default:
        return name;
    }
  };

  const handlePetClick = (pet: PetWithAnimal) => {
    setActivePet(pet);
  };

  return (
    <div className="space-y-4 w-full max-w-screen-lg">
      {/* TODO */}
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
          {/* left card container - all pets - width 1/4-1/3 */}
          <div className="col-span-1 rounded bg-white p-4 shadow shadow-slate-200 space-y-2">
            {pets?.allPets?.nodes.map((pet, i) => (
              <div
                key={pet.id}
                className="flex gap-x-2 cursor-pointer align-middle rounded p-2 hover:bg-slate-200"
                role="button"
                onClick={() => handlePetClick(pet as PetWithAnimal)}
              >
                <Animal
                  name={getSuitableAvatar(pet.animalByAnimalId?.name || '')}
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
          {/* right container - active dog */}
          <div className="col-span-2 bg-white w-full space-x-4 p-4 shadow shadow-slate-200">
            {/* title level */}
            <div className="flex justify-between align-middle">
              <div className="text-lg font-bold">{activePet?.name}</div>
              <Button type="button" className="w-auto">
                + Add record
              </Button>
            </div>
            {/* records list */}
            <div>
              <div>Record 1</div>
              <div>Record 2</div>
              <div>Record 3</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
