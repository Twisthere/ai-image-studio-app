import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { lastValueFrom } from 'rxjs';

interface ImageResponse {
  message: string;
  imageUrl: string;
}

interface Image {
  _id: string;
  type: 'generated' | 'modified';
  prompt: string;
  imagePath: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class ImageService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  async generateImage(prompt: string): Promise<string> {
    const response = await lastValueFrom(
      this.http.post<ImageResponse>(`${this.apiUrl}/generate`, { prompt })
    );
    return response.imageUrl;
  }

  async modifyImage(file: File, prompt: string): Promise<string> {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('prompt', prompt);

    const response = await lastValueFrom(
      this.http.post<ImageResponse>(`${this.apiUrl}/modify`, formData)
    );

    return response.imageUrl;
  }

  async getAllImages(): Promise<Image[]> {
    const response = await lastValueFrom(
      this.http.get<Image[]>(`${this.apiUrl}/all`)
    );
    return response;
  }
}