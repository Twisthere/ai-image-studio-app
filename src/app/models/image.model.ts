export interface ImageResponse {
  message?: string;
  imageUrl: string;
}

export interface ImageData {
  _id: string;
  type: string;
  prompt: string;
  imagePath: string;
  createdAt: string;
  __v: number;
}

export type ImageDataArray = ImageData[];
