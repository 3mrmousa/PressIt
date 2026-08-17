export const getPagination = (page: number = 1, limit: number = 10) => {
  const skip = (page - 1) * limit;
  return { skip, limit };
};