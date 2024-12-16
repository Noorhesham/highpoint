"use server";
import { z } from "zod";
import mongoose, { model } from "mongoose";
import User from "../models/User";
import Category from "../models/Category";
import Course from "../models/Course";
import { ModelProps } from "../constant";
import bcrypt from "bcryptjs";
import { revalidatePath, revalidateTag } from "next/cache";
import connect from "@/lib/clientPromise";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
    console.log(error);
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
export const getEntities = async (modelName: ModelProps, page = 1, filter?: any, all = false, populate = "") => {
  try {
    await connect();
    const Model = getModel(modelName);
    const skip = (page - 1) * 10;
    const query = Object.fromEntries(
      Object.entries(filter).map(([key, value]) => {
        if (mongoose.isValidObjectId(value)) {
          return [key, new mongoose.Types.ObjectId(value)];
        }
        return [key, value];
      })
    );
    let queryBuilder = Model.find(query).skip(skip).limit(10);
    if (all) {
      queryBuilder = Model.find(query);
    }

    // Apply population if specified
    if (populate) {
      queryBuilder = queryBuilder.populate({
        path: populate,
      });
    }
    const entities = await queryBuilder.exec();

    const totalPages = Math.ceil((await Model.countDocuments(query)) / 10);
    const data = JSON.parse(JSON.stringify(entities));
    console.log(entities);
    return {
      success: `${modelName} fetched successfully`,
      data: { data, totalPages },
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
export const deleteImage = async (publicId: string, Id: string, ModelName: string) => {
  try {
    const res = await cloudinary.uploader.destroy(id);

    return res;
  } catch (error) {
    console.log(error);
  }
};
