import { object, string, InferType, ref, date } from 'yup';
interface IValidationMessage {
  companyName: {
    notEmpty: string;
  };
  position: {
    notEmpty: string;
  };
  beginDate: {
    notEmpty: string;
  };
  finishDate: {
    notEmpty: string;
  };
  desc: {
    length: string;
  };
}

const validationMessage: IValidationMessage = {
  companyName: {
    notEmpty: 'Company name is required',
  },
  position: {
    notEmpty: 'Your position is required',
  },
  beginDate: {
    notEmpty: 'Your start working date is required',
  },
  finishDate: {
    notEmpty: 'End date is required unless you are still working here',
  },
  desc: {
    length: 'Description must be 300 characters maximum',
  },
};

export const WorkSchema = object({
  companyName: string().required(validationMessage.companyName.notEmpty),
  position: string().required(validationMessage.position.notEmpty),
  beginDate: date().required(validationMessage.beginDate.notEmpty),
  finishDate: date()
    .nullable()
    .when('isStillWorking', {
      is: false,
      then: (schema) => schema.required(validationMessage.finishDate.notEmpty),
      otherwise: (schema) => schema.nullable(),
    }),
  desc: string().max(300, validationMessage.desc.length),
});
