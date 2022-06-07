interface Author {
  userId: string;
  username: string;
}

export interface ImageObject {
  imageId: string;
  imageUrl: string;
}

export interface DetailedAdvertListItemResponse {
  author: Author; // * Temporary
  advertId: string;
  images: ImageObject[];
  createdAt: string;
  title: string;
  price: number;
  negotiable: boolean;
  description: string;
  localization: string;
}
