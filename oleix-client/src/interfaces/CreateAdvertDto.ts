export interface CreateAdvertDto {
  title: string;
  description: string;
  price: number;
  localization: string;
  negotiable: boolean;
  phone: string;
  authorId: string;
  imageIds?: string[];
}
