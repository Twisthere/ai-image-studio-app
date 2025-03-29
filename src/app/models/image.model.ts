export interface ImageResponse {
  message?: string;
  imageUrl: string;
}

export interface Image {
  _id: string;
  prompt: string;
  imageUrl: string;
  createdAt: string;
  type?: string; // Add this optional field
}