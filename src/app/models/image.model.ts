export interface ImageResponse {
  message: string;
  imageUrl: string;
}

export interface Image {
  _id: string;
  type: 'generated' | 'modified';
  prompt: string;
  imagePath: string;
  createdAt: string;
}