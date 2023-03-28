export const deepCopy = (obj: any) => {
  const objects = new WeakMap();
  const copy = (obj: any): any => {
    if (objects.has(obj)) {
      return objects.get(obj);
    }
    if (typeof obj !== "object" || obj === null) {
      return obj;
    }
    if (Array.isArray(obj)) {
      return obj.map((item: any) => copy(item));
    }
    const result = {} as Record<string, any>;
    objects.set(obj, result);
    Object.keys(obj).forEach((key) => {
      result[key] = copy(obj[key]);
    });
    return result;
  };
  return copy(obj);
};
