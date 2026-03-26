import Class from "../models/Class";
import { validateClass } from "../validators/class.validator";

export const createClass = async (data: any) => {
  validateClass(data);
  return await Class.create(data);
};

export const getClasses = async () => {
  return await Class.aggregate([
    {
      $lookup: {
        from: "students", // collection name
        localField: "_id",
        foreignField: "classId",
        as: "students",
      },
    },
    {
      $sort: { createdAt: -1 },
    },
  ]);
};

export const updateClass = async (id: string, data: any) => {
  return await Class.findByIdAndUpdate(id, data, { new: true });
};

export const deleteClass = async (id: string) => {
  return await Class.findByIdAndDelete(id);
};
