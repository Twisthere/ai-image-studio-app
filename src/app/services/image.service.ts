import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { lastValueFrom } from 'rxjs';
import { Image, ImageResponse } from '../models/image.model';

@Injectable({ providedIn: 'root' })
export class ImageService {
  private apiUrl = environment.apiUrl;

  // Create signals for state management
  images = signal<Image[]>([]);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  http = inject(HttpClient);

  constructor() {
    // Initialize by loading all images
    this.fetchAllImages();
  }

  async generateImage(prompt: string): Promise<string> {
    this.isLoading.set(true);
    this.error.set(null);

    try {
      const response = await lastValueFrom(
        this.http.post<ImageResponse>(`${this.apiUrl}/generate`, { prompt })
      );
      // After successful generation, refresh the images list
      this.fetchAllImages();
      return response.imageUrl;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to generate image';
      this.error.set(errorMessage);
      throw err;
    } finally {
      this.isLoading.set(false);
    }
  }

  async modifyImage(file: File, prompt: string): Promise<string> {
    this.isLoading.set(true);
    this.error.set(null);

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('prompt', prompt);

      const response = await lastValueFrom(
        this.http.post<ImageResponse>(`${this.apiUrl}/modify`, formData)
      );

      // After successful modification, refresh the images list
      this.fetchAllImages();
      return response.imageUrl;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to modify image';
      this.error.set(errorMessage);
      throw err;
    } finally {
      this.isLoading.set(false);
    }
  }

  async fetchAllImages(): Promise<void> {
    this.isLoading.set(true);
    this.error.set(null);

    try {
      const response = await lastValueFrom(
        this.http.get<Image[]>(`${this.apiUrl}/all`)
      );
      this.images.set(response);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch images';
      this.error.set(errorMessage);
    } finally {
      this.isLoading.set(false);
    }
  }

  // Keeping the original method for backward compatibility
  async getAllImages(): Promise<Image[]> {
    await this.fetchAllImages();
    return this.images();
  }
}
