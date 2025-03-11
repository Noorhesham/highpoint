"use server";
import mongoose, { model } from "mongoose";
import User from "../models/User";
import Category from "../models/Category";
import Course from "../models/Course";
import HomePage from "../models/Home";
import City from "../models/City";
import Page from "../models/Page";
import Operation from "../models/Operations";
import SubCategory from "../models/SubCategory";
import Applicant from "../models/applicant";
import { CascadeDeleteFunction, ModelProps } from "../constant";
import bcrypt from "bcryptjs";
import { revalidatePath, revalidateTag } from "next/cache";
import connect from "@/lib/clientPromise";
import { v2 as cloudinary } from "cloudinary";
import GeneralConfig, { IGeneralConfig } from "../models/mainSettings";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const getModel = (modelName: ModelProps) => {
  const models: Record<ModelProps, any> = {
    User,
    Category,
    Course,
    SubCategory,
    HomePage,
    Page,
    City,
    Operation,
    Applicant,
  };
  return models[modelName];
};
//this is a way to automate the deletion of relevant entities
const cascadeDeleteHandlers: Record<string, CascadeDeleteFunction> = {
  Category: async (id: string) => {
    // Delete subcategories associated with the category
    const SubCategoryModel = getModel("SubCategory");
    await SubCategoryModel.deleteMany({ categoryId: id });
    console.log(`Deleted all subcategories for Category ID: ${id}`);
  },
  Course: async (id: string) => {
    // Delete subcategories associated with the category
    const OperationModel = getModel("Operation");
    const ApplicantModel = getModel("Applicant");
    await ApplicantModel.deleteMany({ course: id });
    await OperationModel.deleteMany({ course: id });
    console.log(`Deleted all operations for course ID: ${id}`);
  },
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
    await connect();
    const Model = getModel(modelName);
    const entity = await Model.create(data);
    const entityObj = JSON.parse(JSON.stringify(entity));
    console.log(entityObj);
    revalidateTag(`${modelName}-1`);
    revalidateTag(`${modelName}`);

    revalidatePath("/en");

    revalidatePath("/ar");
    return { success: `${modelName} created successfully`, data: entityObj };
  } catch (error: any) {
    console.log(error);
    return { error: `Error creating ${modelName}`, details: error.message };
  }
};

export const updateEntity = async (modelName: ModelProps, id: string, data: any, customRevalidatePaths?: string[]) => {
  try {
    await connect();
    console.log(data, id, modelName);
    const Model = getModel(modelName);
    const entity = await Model.findByIdAndUpdate(id, data, { new: true });
    const entityObj = JSON.parse(JSON.stringify(entity));
    revalidateTag(`${modelName}-1`);
    revalidateTag(`${modelName}`);
    customRevalidatePaths?.forEach((path) => revalidatePath(path));
    revalidatePath("/");
    return { success: `${modelName} updated successfully`, data: entityObj };
  } catch (error: any) {
    return { error: `Error updating ${modelName}`, details: error.message };
  }
};
export const deleteImage = async (publicId: string) => {
  try {
    const res = await cloudinary.uploader.destroy(publicId);
    console.log(`Deleted image with public ID: ${publicId}`, res);
    return res;
  } catch (error) {
    console.error(`Error deleting image with public ID: ${publicId}`, error);
    throw new Error(`Failed to delete image: ${error.message}`);
  }
};

export const deleteEntity = async (modelName: ModelProps, id: string) => {
  try {
    await connect();

    console.log(modelName, id);
    const Model = getModel(modelName);

    // Find the entity to check for associated images
    const entity = await Model.findById(id);

    if (!entity) {
      return { error: `${modelName} with ID ${id} not found` };
    }

    if (entity.images && Array.isArray(entity.images)) {
      console.log(`Deleting images for ${modelName} with ID ${id}`);
      const deleteResults = await Promise.all(
        entity.images.map(async (image: { public_id: string }) => {
          if (image?.public_id) {
            return await deleteImage(image.public_id);
          }
        })
      );
      console.log("Image deletion results:", deleteResults);
    }

    if (cascadeDeleteHandlers[modelName]) {
      console.log(`Executing cascade delete logic for ${modelName}`);
      await cascadeDeleteHandlers[modelName](id);
    }

    await Model.findByIdAndDelete(id);

    // Revalidate cache
    revalidateTag(modelName);
    revalidatePath("/");

    return { success: `${modelName} deleted successfully` };
  } catch (error: any) {
    console.error(`Error deleting ${modelName}:`, error);
    return { error: `Error deleting ${modelName}`, details: error.message };
  }
};
const parseSubCategories = (subCategories) => {
  if (!subCategories) return [];
  return subCategories
    .split(",")
    .map((id) => decodeURIComponent(id.trim()))
    .filter((id) => mongoose.isValidObjectId(id)); // Validate ObjectIds
};

export const getEntities = async (
  modelName: ModelProps,
  page = 1,
  filter: Record<string, any> = {},
  all = false,
  populate = "",
  searchField = "",
  searchTerm = "",
  sort: Record<string, 1 | -1> = {},
  filterArray: Record<string, any[]> = {},
  limit = 10
) => {
  try {
    await connect();
    const Model = getModel(modelName);
    const skip = (page - 1) * limit;
    // Prepare query filters

    const validFilter = Object.fromEntries(
      Object.entries(filter).filter(([key, value]) => value && mongoose.isValidObjectId(value))
    );
    const query: Record<string, any> = {};
    Object.entries(filter).forEach(([key, value]) => {
      if (key === "startDate" && value) {
        // Handle startDate as a date filter
        const date = new Date(value); // Convert string to Date
        query[key] = { $gte: date }; // Use $gte to filter by start date
      } else if (Array.isArray(value) && value.length > 0) {
        // If value is an array, use $in operator
        query[key] = { $in: value };
      } else if (value && mongoose.isValidObjectId(value)) {
        // If value is a valid ObjectId, add it as-is
        query[key] = value;
      } else if (value) {
        query[key] = value;
      }
    });

    console.log(query, filter, "meow");

    if (searchTerm) {
      // Split the search term by whitespace and filter out any empty strings
      const words = searchTerm.trim().split(/\s+/).filter(Boolean);

      // Build a query where each word must match either name.en or name.ar
      query.$and = words.map((word) => ({
        $or: [{ "name.en": { $regex: word, $options: "i" } }, { "name.ar": { $regex: word, $options: "i" } }],
      }));
    }

    let queryBuilder = Model.find(query).skip(skip).limit(limit).sort(sort); // Apply sorting

    // Handle "all" flag to fetch all data
    if (all) {
      queryBuilder = Model.find(query).sort(sort);
    }

    // Apply population if specified
    if (populate) {
      queryBuilder = queryBuilder.populate({
        path: populate,
      });
    }

    // Execute query
    const entities = await queryBuilder.exec();

    // Calculate total pages based on limit
    const totalPages = Math.ceil((await Model.countDocuments(query)) / limit);
    const data = JSON.parse(JSON.stringify(entities));

    return {
      success: `${modelName} fetched successfully`,
      data: { data, totalPages },
    };
  } catch (error) {
    console.log(error);
    return { error: `Error fetching ${modelName}`, details: error };
  }
};

export const getEntity = async (modelName: ModelProps, id: string, locale: string, populateFields: string[] = []) => {
  try {
    await connect();

    const Model = getModel(modelName);

    let query = Model.findById(id);

    populateFields.forEach((field) => {
      query = query.populate(field);
    });

    const entity = await query.lean();

    if (!entity) {
      return { error: `${modelName} not found` };
    }

    const localizedEntity = {
      ...entity,
      name: entity.name ? entity.name[locale] || entity.name.en : undefined,
      description: entity.description ? entity.description[locale] || entity.description.en : undefined,
    };

    return { success: `${modelName} fetched successfully`, data: locale ? localizedEntity : entity };
  } catch (error) {
    return { error: `Error fetching ${modelName}`, details: error };
  }
};
// actions/updateGeneralConfig.ts

/**
 * Update the general configuration.
 * This server action updates the single instance of GeneralConfig.
 * If the document doesn't exist, it will be created.
 *
 * @param data - Partial data to update the config with.
 * @returns The updated configuration document.
 */
export async function updateGeneralConfig(data: Partial<IGeneralConfig>): Promise<IGeneralConfig> {
  // Ensure that you are connected to the database
  await connect();

  // Update the existing configuration document; if none exists, create one.
  const config = await GeneralConfig.findOneAndUpdate({}, data, {
    new: true, // return the updated document
    upsert: true, // create the document if it doesn't exist
  });
  console.log(config);
  return { data: JSON.parse(JSON.stringify(config)) };
}
export const getGeneral = async () => {
  await connect();
  const config = await GeneralConfig.findOne({}).lean();
  const data = JSON.parse(JSON.stringify(config));
  return { data };
};
