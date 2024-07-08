function objectToArrayString(obj: object) {
  return Object.entries(obj).map(([key, value]) => `${key}:${value}`);
}
function objectToArray(inputObject: {
  [key: string]: string;
}): { field: string; value: string }[] {
  return Object.entries(inputObject).map(([key, value]) => ({
    field: key,
    value,
  }));
}
export default objectToArrayString;
export { objectToArray };
