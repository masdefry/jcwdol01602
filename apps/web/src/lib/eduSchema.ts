import { object, string, InferType, ref } from 'yup';

interface IValidationMessage {
  eduLevelNameRequired: string;
  schoolRequired: string;
  disciplineRequired: string;
  beginDateRequired: string;
  descLength: string;
}

const validationMessage: IValidationMessage = {
  eduLevelNameRequired: 'Education level is required',
  schoolRequired: 'School is required',
  disciplineRequired: 'Discipline is required',
  beginDateRequired: 'Education begin date is required',
  descLength: 'Description must be 300 characters maximum',
};

export const EduSchema = object({
  eduLevelName: string().required(validationMessage.eduLevelNameRequired),
  school: string().required(validationMessage.schoolRequired),
  discipline: string().required(validationMessage.disciplineRequired),
  beginDate: string().required(validationMessage.beginDateRequired),
  finishDate: string().nullable(),
  desc: string().max(300, validationMessage.descLength),
});
