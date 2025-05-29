import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, map, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { ImageResponse, ImageData, ImageDataArray } from '../models/image.model';

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
  generateImage(prompt: string): Observable<string> {
    this.isLoading.set(true);
    this.error.set(null);

    return this.http
      .post<ImageResponse>(`${this.apiURL}/generate`, { prompt })
      .pipe(
        map((response: ImageResponse) => response.imageUrl),
        tap({
          next: (imageUrl: string) => {
            // Create an image object and update the images collection
            const newImage: ImageData = {
              _id: Date.now().toString(), // Temporary ID until we get the real one from backend
              prompt: prompt,
              imagePath: imageUrl,
              createdAt: new Date().toISOString(),
              type: 'generated',
              __v: 0
            };
            this.updateImages(newImage);
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
    formData.append('prompt', prompt);    return this.http
      .post<ImageResponse>(`${this.apiURL}/modify`, formData)
      .pipe(
        map((response: ImageResponse) => response.imageUrl),
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
  getImages(): Observable<ImageData[]> {
    this.isLoading.set(true);
    this.error.set(null);

    return this.http.get<ImageDataArray>(`${this.apiURL}/all`).pipe(      map((images) =>
        images
          .filter((img) => img && img.imagePath)
          .map((img) => ({
            _id: img._id,
            prompt: img.prompt,
            imagePath: img.imagePath,
            createdAt: img.createdAt,
            type: img.type || 'generated',
            __v: img.__v || 0
          }))
      ),
      tap((response: ImageData[]) => this.images.set(response)),
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
  deleteImage(imageId: string): Observable<{ success: boolean; message: string }> {
    this.isLoading.set(true);
    this.error.set(null);

    return this.http.delete<{ success: boolean; message: string }>(`${this.apiURL}/${imageId}`).pipe(
      tap({
        next: (response: { success: boolean; message: string }) => {          // Remove the deleted image from the images signal
          const currentImages = this.images();
          this.images.set(currentImages.filter((img: ImageData) => img._id !== imageId));
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

  private updateImages(newImage: ImageData): void {
    const currentImages = this.images();
    this.images.set([newImage, ...currentImages]);
  }
}
