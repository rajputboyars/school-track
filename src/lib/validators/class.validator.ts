export const validateClass = (data: any) => {
  if (!data.className) throw new Error("Class name is required");
};