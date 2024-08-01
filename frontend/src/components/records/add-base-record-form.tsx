'use client';

import { useAtom } from 'jotai';
import { FormEvent, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

import FormField from '@/components/parts/form/form-field';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCurrentUser, useSetCurrentUser } from '../auth/atoms/current-user';
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
}
export default function AddRecordForm({ onSuccess }: AddRecordFormProps) {
  const [_, setCurrentUser] = useAtom(useSetCurrentUser);
  const [currentUser] = useAtom(useCurrentUser);
  const { data: recordTypes } = useRecordsApi().getRecordTypes;

  // pauseOnRoute is only used immediately after signup to prevent
  // the auth provider from rerouting directly to dashboard
  useEffect(() => {
    if (currentUser?.pauseOnRoute) {
      setCurrentUser({
        ...currentUser,
        pauseOnRoute: false,
      });
    }
  }, [currentUser, setCurrentUser]);

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

  // this really doesn't need to do anything
  const trySubmitBase = async (data: Yup.InferType<typeof BaseRecordSchema>) => {
    console.log('base form data: ', data);
    return;
  };

  const trySubmitAllergy = async (data: Yup.InferType<typeof AllergyFormSchema>) => {
    console.log('allergy form data: ', data);
    return;
  };

  const trySubmitVaccine = async (data: Yup.InferType<typeof VaccineFormSchema>) => {
    console.log('vaccine form data: ', data);
    return;
  };

  const isRelatedRecordType = (comparisonStr: string) => {
    console.log('debug: checking', comparisonStr);
    const recordTypeId = getValues().recordType;
    const recordType = recordTypes?.allRecordTypes?.nodes.find((rc) => rc.id === recordTypeId);
    if (recordType?.name === comparisonStr) {
      return true;
    }
    return false;
  };

  //   useEffect(() => {
  //     if (status === 'success') {
  //       console.log('result data: ', data);
  //       if (!data.createPet?.pet?.id) {
  //         setError('root', {
  //           message: 'Sorry, something went wrong. Please refresh the page and try again.',
  //         });
  //       } else {
  //         onSuccess(data.createPet.pet as Pet);
  //       }
  //       return;
  //     }
  //     // server error
  //     if (status === 'error') {
  //       setError('root', { message: 'An unknown error has occured. Please reload and try again' });
  //     }
  //   }, [data, setError, status, onSuccess]);

  console.log('isValid: ', isValid);
  console.log('values: ', getValues());
  console.log('errors: ', errors);
  return (
    <div className='space-y-2'>
      {/* BASE FORM */}
      <form
        className="space-y-2"
        key={1}
        onSubmit={(e: FormEvent) => void handleSubmit(trySubmitBase)(e)}
        noValidate
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
      </form>

      {isValid && isRelatedRecordType('allergy') ? <AddAllergyForm onSuccess={trySubmitAllergy} /> : null}

      {isValid && isRelatedRecordType('vaccine') ? <AddVaccineForm onSuccess={trySubmitVaccine} /> : null}
    </div>
  );
}
