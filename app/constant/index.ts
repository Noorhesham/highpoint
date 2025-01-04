import Course from "../models/Course";
import User from "../models/User";
import Category from "../models/Category";
import SubCategory from "../models/SubCategory";
import HomePage from "../models/Home";
import Page from "../models/Page";
import City from "../models/City";
import Operation from "../models/Operations";
export type ModelProps = "Course" | "User" | "Category" | "SubCategory" | "HomePage" | "Page" | "City" | "Operation";
const models: Record<ModelProps, any> = {
  Course,
  User,
  Category,
  SubCategory,
  HomePage,
  Page,
  City,
  Operation,
};
export type CascadeDeleteFunction = (id: string) => Promise<void>;

export default models;
