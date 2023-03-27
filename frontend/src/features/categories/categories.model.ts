export interface CategoryModel {
  id: number;
  name: string;
  color: string;
  icon: string;
}

export interface CreateCategoryDTO {
  name: string;
  icon: string;
  color: string;
}
