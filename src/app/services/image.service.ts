import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, tap, catchError, throwError, map } from 'rxjs';
import { Image, ImageResponse } from '../models/image.model';

@Injectable({ providedIn: 'root' })
export class ImageService {
  private apiURL = environment.apiUrl;
  private http = inject(HttpClient);

  // State management with signals
  images = signal<Image[]>([]);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  generateImage(prompt: string): Observable<string> {
    this.isLoading.set(true);
    this.error.set(null);
    
    return this.http.post<ImageResponse>(`${this.apiURL}/generate`, { prompt }).pipe(
      map(response => response.imageUrl),
      tap({
        next: (imageUrl) => {
          // Create an image object and update the images collection
          const newImage: Image = {
            _id: Date.now().toString(), // Temporary ID until we get the real one from backend
            prompt: prompt,
            imageUrl: imageUrl,
            createdAt: new Date().toISOString()
          };
          this.updateImages(newImage);
          this.isLoading.set(false);
        },
        error: (err) => {
          const errorMessage = err instanceof Error ? err.message : 'Failed to generate image';
          this.error.set(errorMessage);
          this.isLoading.set(false);
        }
      }),
      catchError(err => {
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
    
    return this.http.post<ImageResponse>(`${this.apiURL}/modify`, formData).pipe(
      map(response => response.imageUrl),
      tap({
        next: () => this.isLoading.set(false),
        error: (err) => {
          const errorMessage = err instanceof Error ? err.message : 'Failed to modify image';
          this.error.set(errorMessage);
          this.isLoading.set(false);
        }
      }),
      catchError(err => {
        this.isLoading.set(false);
        return throwError(() => err);
      })
    );
  }

  getImages(): Observable<Image[]> {
    this.isLoading.set(true);
    this.error.set(null);
    
    return this.http.get<any[]>(`${this.apiURL}/all`).pipe(
      map(images => images
        .filter(img => img && img.imagePath)
        .map(img => ({
          _id: img._id,
          prompt: img.prompt,
          imageUrl: img.imagePath, // Map imagePath to imageUrl
          createdAt: img.createdAt,
          type: img.type // Optional: you can include this if needed
        }))
      ),
      tap(response => this.images.set(response)),
      tap({
        next: () => this.isLoading.set(false),
        error: (err) => {
          const errorMessage = err instanceof Error ? err.message : 'Failed to fetch images';
          this.error.set(errorMessage);
          this.isLoading.set(false);
        }
      }),
      catchError(err => {
        this.isLoading.set(false);
        return throwError(() => err);
      })
    );
  }

  deleteImage(imageId: string): Observable<any> {
    this.isLoading.set(true);
    this.error.set(null);
    
    return this.http.delete<any>(`${this.apiURL}/${imageId}`).pipe(
      tap({
        next: (response) => {
          // Remove the deleted image from the images signal
          const currentImages = this.images();
          this.images.set(currentImages.filter(img => img._id !== imageId));
          this.isLoading.set(false);
        },
        error: (err) => {
          const errorMessage = err instanceof Error ? err.message : 'Failed to delete image';
          this.error.set(errorMessage);
          this.isLoading.set(false);
        }
      }),
      catchError(err => {
        this.isLoading.set(false);
        return throwError(() => err);
      })
    );
  }

  private updateImages(newImage: Image): void {
    const currentImages = this.images();
    this.images.set([newImage, ...currentImages]);
  }
}