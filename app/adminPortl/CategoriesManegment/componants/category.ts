

export interface MainCategory {
  id: string;
  name: string;
}

export interface SubCategory {
  id: string;
  name: string;
  mainCategoryId: string;
}

// Type for modal operations
export type CategoryModalMode = 'add' | 'edit';

//  which category type is being managed
export type CategoryType = 'main' | 'sub';
