'use client';

import { useAtom } from 'jotai';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

import FormField from '@/components/parts/form/form-field';
import {
  CreateAllergyRecordMutationVariables,
  CreateVaccineRecordMutationVariables,
} from '@/graphql/generated/graphql';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCurrentUser } from '../auth/atoms/current-user';
import { PetWithAnimal } from '../pets/types';
import AddAllergyForm from './add-allergy-form';
import AddVaccineForm from './add-vaccine-form';
import { useRecordsApi } from './records-api';
import {
  AllergyFormSchema,
  BaseRecordSchema,
  RECORD_FORM_FIELDS,
  VaccineFormSchema,
} from './types';

interface AddRecordFormProps {
  onSuccess: () => void;
  pet: PetWithAnimal;
}
export default function AddRecordForm({ onSuccess, pet }: AddRecordFormProps) {
  const [currentUser] = useAtom(useCurrentUser);
  const { data: recordTypes } = useRecordsApi().getRecordTypes;
  const {
    mutate: addPetRecord,
    status: baseStatus,
    data: baseRecordData,
  } = useRecordsApi().addRecordForPet;
  const { mutate: addVaccineRecord, status: vaxSubStatus } = useRecordsApi().addVaccineRecordForPet;
  const { mutate: addAllergyRecord, status: allergySubStatus } =
    useRecordsApi().addAllergyRecordForPet;
  const [allergyFormValues, setAllergyFormValues] = useState<Yup.InferType<
    typeof AllergyFormSchema
  > | null>(null);
  const [vaccineFormValues, setVaccineFormValues] = useState<Yup.InferType<
    typeof VaccineFormSchema
  > | null>(null);

  // base form code
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(BaseRecordSchema),
  });

  const trySubmitBase = async (data: Yup.InferType<typeof BaseRecordSchema>) => {
    // do nothing, this is shouldn't even be possible
    console.log('base form data: ', data);
    return;
  };

  const trySubmitAllergy = async (data: Yup.InferType<typeof AllergyFormSchema>) => {
    setAllergyFormValues(data);

    await addPetRecord({
      petId: pet.id,
      userId: currentUser?.userId,
      recordTypeId: getValues().recordType,
    });

    return;
  };

  const trySubmitVaccine = async (data: Yup.InferType<typeof VaccineFormSchema>) => {
    setVaccineFormValues(data);

    await addPetRecord({
      petId: pet.id,
      userId: currentUser?.userId,
      recordTypeId: getValues().recordType,
    });

    return;
  };

  const isRelatedRecordType = (comparisonStr: string) => {
    const recordTypeId = getValues().recordType;
    const recordType = recordTypes?.allRecordTypes?.nodes.find((rc) => rc.id === recordTypeId);
    if (recordType?.name === comparisonStr) {
      return true;
    }
    return false;
  };

  // with record id, submit the core record field
  useEffect(() => {
    const executeAsyncTasks = async () => {
      if (baseStatus === 'success') {
        if (isRelatedRecordType('allergy')) {
          await addAllergyRecord({
            ...allergyFormValues,
            // enums need to be passed in all uppers
            severity: allergyFormValues?.severity.toUpperCase(),
          } as CreateAllergyRecordMutationVariables);
          return;
        }
        if (isRelatedRecordType('vaccine')) {
          await addVaccineRecord({
            recordId: baseRecordData.createRecord?.record?.id || '',
            ...vaccineFormValues,
          } as CreateVaccineRecordMutationVariables);
          return;
        }
      }
    };

    // Call the async function
    executeAsyncTasks().catch((error) => {
      console.error('Error in executeAsyncTasks:', error);
    });
  }, [baseStatus]);

  // finally, we can call it quits
  useEffect(() => {
    if (vaxSubStatus === 'success' || allergySubStatus === 'success') {
      onSuccess();
    }
  }, [vaxSubStatus, allergySubStatus]);

  const isLoading = useMemo(() => {
    if (baseStatus == 'pending' || baseStatus === 'success') {
      return true;
    }

    if (vaxSubStatus === 'pending' || vaxSubStatus === 'success') {
      return true;
    }

    if (allergySubStatus === 'pending' || allergySubStatus === 'success') {
      return true;
    }

    return false;
  }, [baseStatus, vaxSubStatus, allergySubStatus]);

  return (
    <div className="space-y-2 relative border rounded">
      {/* TODO: move loading overlay  */}
      {isLoading ? (
        <div
          className="absolute inset-0 bg-black bg-opacity-50 cursor-default z-40 flex items-center justify-center rounded"
          onClick={(e) => {
            console.log('oka... overlay');
            e.stopPropagation();
          }}
        >
          <div className="text-4xl font-bold">LOADING...</div>
        </div>
      ) : null}

      {/* BASE FORM */}
      <div className="p-2">
        <form
          className="space-y-2 pt-2"
          key={1}
          onSubmit={(e: FormEvent) => void handleSubmit(trySubmitBase)(e)}
          noValidate
        >
          <div
            onClick={() => {
              console.log('oka... elemt');
            }}
          >
            <FormField
              label="Record type"
              placeholder="Record Type"
              type="select"
              errors={errors.recordType}
              options={
                recordTypes?.allRecordTypes?.nodes.map((recordType) => ({
                  text: recordType.name,
                  value: recordType.id,
                })) || []
              }
              required
              {...register(RECORD_FORM_FIELDS.RECORD_TYPE)}
              onChange={(e) => {
                setValue(RECORD_FORM_FIELDS.RECORD_TYPE, e.currentTarget.value, {
                  shouldValidate: true,
                });
              }}
            />
          </div>
        </form>

        {isValid && isRelatedRecordType('allergy') ? (
          <AddAllergyForm onSuccess={trySubmitAllergy} />
        ) : null}

        {isValid && isRelatedRecordType('vaccine') ? (
          <AddVaccineForm onSuccess={trySubmitVaccine} />
        ) : null}
      </div>
    </div>
  );
}
