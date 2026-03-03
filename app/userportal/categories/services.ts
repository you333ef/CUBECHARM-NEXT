import axios from "axios";
import { CategoriesResponse, PropertyFeedResponse } from "./types";
import api from "@/app/AuthLayout/refresh";


export const fetchCategories = async (
 
): Promise<CategoriesResponse> => {
  const response = await api.get<CategoriesResponse>(
    `/Categories`
  );
  return response.data;
};


export const fetchPostsByCategory = async (
 
    mainCategoryId?: number,
  subCategoryId?: number,
  page: number = 1,
  pageSize: number = 24
): Promise<PropertyFeedResponse> => {
          

  const response = await api.get<PropertyFeedResponse>(
    `/Property/feed`,
    {
      params: { mainCategoryId, subCategoryId, page, pageSize, sort: "recent" },
    
    }
  );
  return response.data;
};
