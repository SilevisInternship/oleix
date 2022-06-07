export const objectToGetParams = (object: any) => {
  if (Object.keys(object).length == 0) {
    return '';
  }

  return Object.keys(object)
    .map((key) => `${key}=${object[key]}`)
    .join('&');
};
