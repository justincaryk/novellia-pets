import * as Yup from 'yup';

export enum RECORD_FORM_FIELDS {
  RECORD_TYPE = 'recordType',
  NAME = 'name',
  ADMINISTERED_AT = 'administeredAt',
  REACTIONS = 'reactions',
  SEVERITY = 'severity',
}

export const BaseRecordSchema = Yup.object().shape({
  [RECORD_FORM_FIELDS.RECORD_TYPE]: Yup.string().required('A record type is required'),
});

export const AllergyFormSchema = Yup.object().shape({
  [RECORD_FORM_FIELDS.NAME]: Yup.string().required('A record name is required'),
  [RECORD_FORM_FIELDS.REACTIONS]: Yup.string(),
  [RECORD_FORM_FIELDS.SEVERITY]: Yup.string().required('Allergy severity is required'),
});

export const VaccineFormSchema = Yup.object().shape({
  [RECORD_FORM_FIELDS.NAME]: Yup.string().required('A record name is required'),
  [RECORD_FORM_FIELDS.ADMINISTERED_AT]: Yup.string().required(
    'Vaccine administration date required',
  ),
});
