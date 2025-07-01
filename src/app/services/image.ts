import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, map, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { ImageData, ImageDataArray } from '../models/image.model';

// Backend API response interface
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

// Pagination parameters interface
interface PaginationParams {
  page?: number;
  limit?: number;
  type?: 'generated' | 'modified';
}

// Pagination metadata interface
interface PaginationMetadata {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

@Injectable({
  providedIn: 'root',
})
export class Image {
  private apiURL = environment.apiUrl;
  private http = inject(HttpClient);

  // State management with signals
  images = signal<ImageDataArray>([]);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);
  pagination = signal<PaginationMetadata | null>(null);

  generateImage(prompt: string): Observable<string> {
    this.isLoading.set(true);
    this.error.set(null);

    return this.http
      .post<ApiResponse<{ imageUrl: string }>>(`${this.apiURL}/generate`, {
        prompt,
      })
      .pipe(
        map(
          (response: ApiResponse<{ imageUrl: string }>) =>
            response.data.imageUrl
        ),
        tap({
          next: (imageUrl: string) => {
            // Create an image object and update the images collection
            const newImage: ImageData = {
              _id: Date.now().toString(), // Temporary ID until we get the real one from backend
              prompt: prompt,
              imagePath: imageUrl,
              createdAt: new Date().toISOString(),
              type: 'generated',
              __v: 0,
            };
            // Don't update images directly since we're using server-side pagination
            // The gallery will need to refresh to see the new image
            this.isLoading.set(false);
          },
          error: (err) => {
            const errorMessage =
              err instanceof Error ? err.message : 'Failed to generate image';
            this.error.set(errorMessage);
            this.isLoading.set(false);
          },
        }),
        catchError((err) => {
          this.isLoading.set(false);
          return throwError(() => err);
        })
      );
  }

  modifyImage(file: File, prompt: string): Observable<string> {
    this.isLoading.set(true);
    this.error.set(null);

    // Create FormData to handle file upload
    const formData = new FormData();
    formData.append('image', file);
    formData.append('prompt', prompt);

    return this.http
      .post<ApiResponse<{ imageUrl: string }>>(
        `${this.apiURL}/modify`,
        formData
      )
      .pipe(
        map(
          (response: ApiResponse<{ imageUrl: string }>) =>
            response.data.imageUrl
        ),
        tap({
          next: () => this.isLoading.set(false),
          error: (err) => {
            const errorMessage =
              err instanceof Error ? err.message : 'Failed to modify image';
            this.error.set(errorMessage);
            this.isLoading.set(false);
          },
        }),
        catchError((err) => {
          this.isLoading.set(false);
          return throwError(() => err);
        })
      );
  }

  getImages(params: PaginationParams = {}): Observable<{ images: ImageData[]; pagination: PaginationMetadata }> {
    this.isLoading.set(true);
    this.error.set(null);

    // Build query parameters
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.set('page', params.page.toString());
    if (params.limit) queryParams.set('limit', params.limit.toString());
    if (params.type) queryParams.set('type', params.type);

    const url = `${this.apiURL}/all${queryParams.toString() ? '?' + queryParams.toString() : ''}`;

    return this.http
      .get<ApiResponse<ImageDataArray>>(url)
      .pipe(
        map((response: ApiResponse<ImageDataArray>) => {
          const processedImages = response.data
            .filter((img) => img && img.imagePath)
            .map((img) => ({
              _id: img._id,
              prompt: img.prompt,
              imagePath: img.imagePath,
              createdAt: img.createdAt,
              type: img.type || 'generated',
              __v: img.__v || 0,
            }));

          return {
            images: processedImages,
            pagination: response.pagination!
          };
        }),
        tap(({ images, pagination }) => {
          this.images.set(images);
          this.pagination.set(pagination);
        }),
        tap({
          next: () => this.isLoading.set(false),
          error: (err) => {
            const errorMessage =
              err instanceof Error ? err.message : 'Failed to fetch images';
            this.error.set(errorMessage);
            this.isLoading.set(false);
          },
        }),
        catchError((err) => {
          this.isLoading.set(false);
          return throwError(() => err);
        })
      );
  }

  deleteImage(
    imageId: string
  ): Observable<{ success: boolean; message: string }> {
    this.isLoading.set(true);
    this.error.set(null);

    return this.http
      .delete<ApiResponse<{ success: boolean; message: string }>>(
        `${this.apiURL}/${imageId}`
      )
      .pipe(
        map(
          (response: ApiResponse<{ success: boolean; message: string }>) =>
            response.data
        ),
        tap({
          next: (response: { success: boolean; message: string }) => {
            // Remove the deleted image from the images signal
            const currentImages = this.images();
            this.images.set(
              currentImages.filter((img: ImageData) => img._id !== imageId)
            );
            this.isLoading.set(false);
          },
          error: (err) => {
            const errorMessage =
              err instanceof Error ? err.message : 'Failed to delete image';
            this.error.set(errorMessage);
            this.isLoading.set(false);
          },
        }),
        catchError((err) => {
          this.isLoading.set(false);
          return throwError(() => err);
        })
      );
  }


}
