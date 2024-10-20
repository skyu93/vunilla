import { cloneDeep, isEqual, isFunction, isNil, isNotNil, isObject } from '../shared';

describe('유틸리티', () => {
  test('isNil', () => {
    expect(isNil(null)).toBe(true);
    expect(isNil(undefined)).toBe(true);
    expect(isNil(1)).toBe(false);
    expect(isNil({ name: 'skyu' })).toBe(false);
  });

  test('isNotNil', () => {
    expect(isNotNil(null)).toBe(false);
    expect(isNotNil(undefined)).toBe(false);
    expect(isNotNil(1)).toBe(true);
    expect(isNotNil({ name: 'skyu' })).toBe(true);
  });

  test('isFunction', () => {
    const fn = () => {};
    expect(isFunction(fn)).toBe(true);
    expect(isFunction({})).toBe(false);
  });

  test('isObject', () => {
    const obj1 = { a: 'a', b: 1 };
    const fn = () => {};
    expect(isObject(obj1)).toBe(true);
    expect(isObject(fn)).toBe(false);
  });

  test('isEqual', () => {
    const obj1 = { a: 'a', b: 1 };
    const obj2 = { a: 'a', b: 1 };
    const obj3 = { a: 'a', b: 2 };
    expect(isEqual(obj1, obj2)).toBe(true);
    expect(isEqual(obj1, obj3)).toBe(false);
    expect(isEqual(1, 1)).toBe(true);
  });

  test('cloneDeep', () => {
    const obj1 = { a: 'a', b: 1 };
    expect(cloneDeep(obj1)).not.toBe(obj1);
  });
});
