import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ImageService } from '../../services/image.service';

@Component({
  selector: 'app-image-gallery',
  imports: [DatePipe],
  templateUrl: './image-gallery.component.html',
  styleUrl: './image-gallery.component.css',
})
export class ImageGalleryComponent implements OnInit {
  private imageService = inject(ImageService);
  
  // Add signal to track deletions in progress
  readonly deletingImageIds = signal<Set<string>>(new Set());

  get images() {
    return this.imageService.images;
  }

  get isLoading() {
    return this.imageService.isLoading;
  }

  get error() {
    return this.imageService.error;
  }

  ngOnInit(): void {
    this.loadImages();
  }

  loadImages(): void {
    this.imageService.getImages().subscribe({
      next: (images) => {
        // Images loaded successfully
        console.log('Loaded images:', images.length);
      },
      error: (err) => {
        console.error('Failed to load images:', err);
      },
    });
  }

  deleteImage(imageId: string): void {
    if (confirm('Are you sure you want to delete this image? This action cannot be undone.')) {
      // Add to set of deleting images
      this.deletingImageIds.update(ids => {
        ids.add(imageId);
        return new Set(ids);
      });
      
      this.imageService.deleteImage(imageId).subscribe({
        next: () => {
          console.log('Image deleted successfully');
          // Remove from set of deleting images
          this.deletingImageIds.update(ids => {
            ids.delete(imageId);
            return new Set(ids);
          });
        },
        error: (err) => {
          console.error('Failed to delete image:', err);
          // Remove from set of deleting images
          this.deletingImageIds.update(ids => {
            ids.delete(imageId);
            return new Set(ids);
          });
        }
      });
    }
  }

  isDeleting(imageId: string): boolean {
    return this.deletingImageIds().has(imageId);
  }

  // Helper method to handle different aspect ratios
  getImageDimensions(imageUrl: string): { width: number; height: number } {
    // Default dimensions for Cloudinary images (close to typical AI generated images)
    return { width: 1024, height: 1024 };
  }
}
