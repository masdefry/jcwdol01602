import { object, string, InferType, ref, number } from 'yup';
interface IValidationMessage {
  salary: {
    format: string;
  };
  culture: {
    format: string;
  };
  wlb: {
    format: string;
  };
  facility: {
    format: string;
  };
  career: {
    format: string;
  };
  desc: {
    length: string;
  };
}

const validationMessage: IValidationMessage = {
  salary: {
    format: 'Salary must be number format',
  },
  culture: {
    format: 'Salary must be number format',
  },
  wlb: {
    format: 'Salary must be number format',
  },
  facility: {
    format: 'Salary must be number format',
  },
  career: {
    format: 'Salary must be number format',
  },
  desc: {
    length: 'Description must be 200 characters maximum',
  },
};

export const reviewSchema = object({
  salary: number().typeError(validationMessage.salary.format).nullable(),
  culture: number().typeError(validationMessage.culture.format).nullable(),
  wlb: number().typeError(validationMessage.wlb.format).nullable(),
  facility: number().typeError(validationMessage.facility.format).nullable(),
  career: number().typeError(validationMessage.career.format).nullable(),
  desc: string().max(200, validationMessage.desc.length),
});
