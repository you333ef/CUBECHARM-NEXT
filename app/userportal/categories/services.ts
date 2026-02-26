import axios from "axios";
import { CategoriesResponse, PropertyFeedResponse } from "./types";

/**
 * Fetch all categories with their subcategories

 */
export const fetchCategories = async (
  baseUrl: string
): Promise<CategoriesResponse> => {
  const response = await axios.get<CategoriesResponse>(
    `${baseUrl}/Categories`
  );
  return response.data;
};

/**
 * Fetch property posts by category/subcategory ID
 
 */
export const fetchPostsByCategory = async (
  baseUrl: string,
    mainCategoryId?: number,
  subCategoryId?: number,
  page: number = 1,
  pageSize: number = 24
): Promise<PropertyFeedResponse> => {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken")
      : null;

  const response = await axios.get<PropertyFeedResponse>(
    `${baseUrl}/Property/feed`,
    {
      params: { mainCategoryId, subCategoryId, page, pageSize, sort: "recent" },
      ...(token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {}),
    }
  );
  return response.data;
};
