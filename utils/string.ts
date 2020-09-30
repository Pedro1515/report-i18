export function objectToQueryParams(object: any) {
  const sanitize = (object: any) => {
    Object.keys(object).forEach((key) =>
      object[key] === undefined || object[key] === null
        ? delete object[key]
        : {}
    );
    return object;
  };

  const queryString = new URLSearchParams(sanitize(object)).toString();
  return queryString;
}
