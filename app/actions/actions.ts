"use server";
import { z } from "zod";
import connect from "@/lib/clientPromise";
import mongoose from "mongoose";
import User from "../models/User";
import Category from "../models/Category";
import Course from "../models/Course";
import { ModelProps } from "../constant";
import bcrypt from "bcryptjs";
import { revalidatePath, revalidateTag } from "next/cache";
import { cookies } from "next/headers";
const getModel = (modelName: ModelProps) => {
  const models: Record<ModelProps, any> = {
    User,
    Category,
    Course,
  };
  return models[modelName];
};

export const signup = async (data: any) => {
  try {
    // Hash the password
    await connect();
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create a new user with the hashed password
    const newUser = await User.create({
      ...data,
      password: hashedPassword,
    });
    const userObj = JSON.parse(JSON.stringify(newUser));
    return { success: "User created successfully", data: userObj };
  } catch (error: any) {
    // Handle potential errors
    console.log(error);
    return { error: "User creation failed", details: error.message };
  }
};
export const createEntity = async (modelName: ModelProps, data: any) => {
  try {
    console.log(data, modelName);

    const Model = getModel(modelName);
    const entity = await Model.create(data);
    const entityObj = JSON.parse(JSON.stringify(entity));
    console.log(entityObj);
    revalidateTag(modelName);
    revalidatePath("/");
    return { success: `${modelName} created successfully`, data: entityObj };
  } catch (error: any) {
    return { error: `Error creating ${modelName}`, details: error.message };
  }
};

export const updateEntity = async (modelName: ModelProps, id: string, data: any) => {
  try {
    console.log(data, id, modelName);
    const Model = getModel(modelName);
    const entity = await Model.findByIdAndUpdate(id, data, { new: true });
    const entityObj = JSON.parse(JSON.stringify(entity));
    revalidateTag(modelName);
    revalidatePath("/");
    return { success: `${modelName} updated successfully`, data: entityObj };
  } catch (error: any) {
    return { error: `Error updating ${modelName}`, details: error.message };
  }
};

export const deleteEntity = async (modelName: ModelProps, id: string) => {
  try {
    console.log(modelName, id);
    const Model = getModel(modelName);
    await Model.findByIdAndDelete(id);
    revalidateTag(modelName);
    revalidatePath("/");
    return { success: `${modelName} deleted successfully` };
  } catch (error: any) {
    return { error: `Error deleting ${modelName}`, details: error.message };
  }
};
export const getEntities = async (
  modelName: ModelProps,
  page = 1,
  filter?: any,
  all = false,

  dash = false
) => {
  try {
    await connect();
    // const locale = cookies().get("NEXT_LOCALE")?.value;
    const Model = getModel(modelName);
    const skip = (page - 1) * 10;
    let query: any = {};
    if (filter) {
      if (filter.courseId) {
        query.courseId = new mongoose.Types.ObjectId(filter.courseId);
      }
      if (filter.category) {
        query.category = new mongoose.Types.ObjectId(filter.category);
      }
    }

    // const projection = {
    //   name: all && !dash ? 1 : { $ifNull: [`$name.${locale}`, `$name.en`] },
    //   description: all && !dash ? 1 : { $ifNull: [`$description.${locale}`, `$description.en`] },
    //   price: 1,
    //   images: 1,
    //   category: 1,
    //   photo: 1,
    // };

    const entities = all
      ? await Model.aggregate([{ $match: query }])
      : await Model.aggregate([
          { $match: query },
          {
            $lookup: {
              from: "categories", // Ensure this matches the actual collection name in your database
              localField: "category", // This should match the field in your document that stores the category ID
              foreignField: "_id", // The field in the "categories" collection that matches "localField"
              as: "category",
            },
          },
          { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } }, // Unwind to flatten the category array to a single object
          { $skip: skip },
          { $limit: 10 },
          // { $project: projection },
        ]);

    const totalPages = Math.ceil((await Model.countDocuments(query)) / 10);
    return {
      success: `${modelName} fetched successfully`,
      data: { data: entities, totalPages },
    };
  } catch (error) {
    console.log(error);
    return { error: `Error fetching ${modelName}`, details: error };
  }
};
export const getEntity = async (modelName: ModelProps, id: string, locale: string) => {
  try {
    const Model = getModel(modelName);
    const entity = await Model.findById(id).populate("category").lean(); // Use `lean` to get a plain JavaScript object

    if (!entity) {
      return { error: `${modelName} not found` };
    }

    // Ensure locale fields are correctly set
    const localizedEntity = {
      ...entity,
      name: entity.name ? entity.name[locale] || entity.name.en : undefined,
      description: entity.description ? entity.description[locale] || entity.description.en : undefined,
    };

    return { success: `${modelName} fetched successfully`, data: localizedEntity };
  } catch (error) {
    return { error: `Error fetching ${modelName}`, details: error };
  }
};
