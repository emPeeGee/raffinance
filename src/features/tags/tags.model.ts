export interface TagModel {
  id: number;
  name: string;
  color: string;
  icon: string;
}

export interface CreateTagDTO {
  name: string;
  icon: string;
  color: string;
}
