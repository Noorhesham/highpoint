import Course from "../models/Course";
import User from "../models/User";
import Category from "../models/Category";

export type ModelProps = "Course" | "User" | "Category";
const models: Record<ModelProps, any> = {
  Course,
  User,
  Category,
};

export default models;
