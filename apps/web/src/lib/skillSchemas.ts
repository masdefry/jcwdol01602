import { object, string, InferType, ref } from 'yup';
interface IValidationMessage {
  skillName: {
    notEmpty: string;
    length: string;
  };
  questionRequired: string;
  optionARequired: string;
  optionBRequired: string;
  optionCRequired: string;
  optionDRequired: string;
  answer: {
    notEmpty: string;
    match: string;
  };
}

const validationMessage: IValidationMessage = {
  skillName: {
    notEmpty: 'Skill name is required',
    length: 'Skill must be 3 characters minimum and 30 characters maximum!',
  },
  questionRequired: 'Question is required',
  optionARequired: 'Option A is required,',
  optionBRequired: 'Option B is required,',
  optionCRequired: 'Option C is required,',
  optionDRequired: 'Option D is required,',
  answer: {
    notEmpty: 'Answer is required',
    match: `Your answer doesn't match with given of the options`,
  },
};

export const newSkillSchema = object({
  skillName: string()
    .required(validationMessage.skillName.notEmpty)
    .min(3, validationMessage.skillName.length)
    .max(30, validationMessage.skillName.length),
});

export const QuestionSchema = object({
  question: string().required(validationMessage.questionRequired),
  option_a: string().required(validationMessage.optionARequired),
  option_b: string().required(validationMessage.optionBRequired),
  option_c: string().required(validationMessage.optionCRequired),
  option_d: string().required(validationMessage.optionARequired),
  answer: string()
    .required(validationMessage.answer.notEmpty)
    .oneOf(
      [ref('option_a'), ref('option_b'), ref('option_c'), ref('option_d')],
      validationMessage.answer.match,
    ),
});

export const chooseSkillSchema = object({
  skillName: string().required(validationMessage.skillName.notEmpty),
});
