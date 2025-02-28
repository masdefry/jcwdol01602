import path from 'path';

const templatePath = path.join(
  __dirname,
  '../templates',
  'userValidationMail.hbs',
);

export const registValidMail = (roleName: string) => {
  let templatePath = null;
  if (roleName === 'user') {
    templatePath = path.join(
      __dirname,
      '../templates',
      'userValidationMail.hbs',
    );
  } else if (roleName === 'admin') {
    templatePath = path.join(
      __dirname,
      '../templates',
      'compValidationMail.hbs',
    );
  } else if (roleName === 'dev') {
    templatePath = path.join(
      __dirname,
      '../templates',
      'devValidationMail.hbs',
    );
  } else {
    throw new Error('Invalid roleName');
  }
  return templatePath;
};
