export interface SubCategory {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  name: string;
  subCategories: SubCategory[];
}

export interface CategoriesResponse {
  success: boolean;
  message?: string;
  data: Category[];
}

export interface PropertyItem {
  propertyId: number;
  title: string;
  description: string;
  imageUrl1: string | null;
  price: string;
  currency: string;
  city: string;
  categoryName: string;
  categorySlug: string;
  totalArea: number;
  viewsCount: number;
  publishedAt: string;
  ownerName: string;
  ownerProfileImage: string;
  ownerRating: number;
  ownerUserId: string;
  isFavourite?: boolean;
  isFavorite?: boolean;
}

export interface PropertyFeedData {
  items: PropertyItem[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface PropertyFeedResponse {
  success: boolean;
  message: string;
  data: PropertyFeedData;
  errors: string[] | null;
  statusCode: string;
  metadata: Record<string, unknown>;
}
