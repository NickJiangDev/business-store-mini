const getDefautValue = (value: any) => {
  if (typeof value === 'string' && !value) {
    return "-";
  } else if (typeof value === 'number' && !value) {
    return "-";
  }
  return value;
};
export default getDefautValue;
