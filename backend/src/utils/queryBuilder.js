export const buildFilter = (baseFilter, query, allowedFields = []) => {
  const filter = { ...baseFilter };

  for (const field of allowedFields) {
    if (query[field] !== undefined) {
      filter[field] = query[field];
    }
  }

  const search = query.search?.trim();

  if (search && searchFields.length > 0) {
    filter.$or = searchFields.map(field => ({
      [field]: { $regex: search, $options: "i" }
    }));
  }

  return filter;
};