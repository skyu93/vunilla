const isNil = <T>(value: T | null | undefined): value is null | undefined => value === undefined || value === null;
const isNotNil = <T>(value: T | null | undefined): value is T => !isNil(value);
const isFunction = <T>(value: T | null | undefined): value is T => isNotNil(value) && typeof value === 'function';
const isObject = <T>(value: T | null | undefined | object): value is object =>
  isNotNil(value) && typeof value === 'object';
const isEqual = (obj1: any, obj2: any) => {
  if (typeof obj1 !== typeof obj2) {
    return false;
  }

  if (!isObject(obj1) && obj1 === obj2) {
    return true;
  }

  return Object.entries(obj1).every(([key, value]) => {
    return obj2.hasOwnProperty(key) && obj2[key] === value;
  });
};
const cloneDeep = <T>(value: T): T => JSON.parse(JSON.stringify(value));
export { isNil, isNotNil, isFunction, isObject, isEqual, cloneDeep };
