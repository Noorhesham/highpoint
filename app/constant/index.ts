import Course from "../models/Course";
import User from "../models/User";
import Category from "../models/Category";
import SubCategory from "../models/SubCategory";
import HomePage from "../models/Home";

export type ModelProps = "Course" | "User" | "Category" | "SubCategory" | "HomePage" | "Page";
const models: Record<ModelProps, any> = {
  Course,
  User,
  Category,
  SubCategory,
  HomePage,
  Page,
};
export type CascadeDeleteFunction = (id: string) => Promise<void>;

export default models;
