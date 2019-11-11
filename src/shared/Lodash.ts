// https://30secondsofcode.org/string#words

export const all = (arr: any[], fn = Boolean) => arr.every(fn);
export const allEqual = (arr: any[]) => arr.every(val => val === arr[0]);
export const any = (arr: any[], fn = Boolean) => arr.some(fn);
export const chunk = (arr: any[], size: number) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_v, i) =>
    arr.slice(i * size, i * size + size)
  );
export const countOccurrences = (arr: any[], val: any) =>
  arr.reduce((a, v) => (v === val ? a + 1 : a), 0);
export const deepFlatten = (arr: any) =>
  [].concat(...arr.map(v => (Array.isArray(v) ? deepFlatten(v) : v)));

export const difference = (a: any[], b: any[]) => {
  const s = new Set(b);
  return a.filter(x => !s.has(x));
};
export const drop = (arr: any[], n = 1) => arr.slice(n);
export const dropRight = (arr: any[], n = 1) => arr.slice(0, -n);
export const dropRightWhile = (arr: any, func: (n: any) => boolean) => {
  let rightIndex = arr.length;
  while (rightIndex-- && !func(arr[rightIndex]));
  return arr.slice(0, rightIndex + 1);
};
export const dropWhile = (arr: any, func: (n: any) => boolean) => {
  while (arr.length > 0 && !func(arr[0])) arr = arr.slice(1);
  return arr;
};
export const findLast = (arr: any[], fn: (n: any) => boolean) =>
  arr.filter(fn).pop();
export const groupBy = (arr: any, fn: (n: any) => boolean) =>
  arr
    .map(typeof fn === "function" ? fn : val => val[fn])
    .reduce((acc, val, i) => {
      acc[val] = (acc[val] || []).concat(arr[i]);
      return acc;
    }, {});
export const head = (arr: any) => arr[0];
export const last = (arr: any) => arr[arr.length - 1];
export const shank = (arr: any, index = 0, delCount = 0, ...elements) =>
  arr
    .slice(0, index)
    .concat(elements)
    .concat(arr.slice(index + delCount));
export const shuffle = ([...arr]) => {
  let m = arr.length;
  while (m) {
    const i = Math.floor(Math.random() * m--);
    [arr[m], arr[i]] = [arr[i], arr[m]];
  }
  return arr;
};
export const deepClone = obj => {
  let clone = Object.assign({}, obj);
  Object.keys(clone).forEach(
    key =>
      (clone[key] =
        typeof obj[key] === "object" ? deepClone(obj[key]) : obj[key])
  );
  return Array.isArray(obj) && obj.length
    ? (clone.length = obj.length) && Array.from(clone)
    : Array.isArray(obj)
    ? Array.from(obj)
    : clone;
};
export const size = (val: any) =>
  Array.isArray(val)
    ? val.length
    : val && typeof val === "object"
    ? val.size || val.length || Object.keys(val).length
    : typeof val === "string"
    ? val.length
    : 0;
export const truncateString = (str: string, num: number) =>
  str.length > num ? str.slice(0, num > 3 ? num - 3 : num) + "..." : str;
