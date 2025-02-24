const today = new Date();
// create date with format YYMMDD
export const createDate = today.toISOString().slice(2, 10).replace(/-/g, '');
