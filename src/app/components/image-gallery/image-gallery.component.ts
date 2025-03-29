import { Component, OnInit, inject } from '@angular/core';
import {
  CommonModule,
  NgOptimizedImage,
  NgClass,
  DatePipe,
} from '@angular/common';
import { ImageService } from '../../services/image.service';
import { Image } from '../../models/image.model';

@Component({
  selector: 'app-image-gallery',
  imports: [DatePipe],
  templateUrl: './image-gallery.component.html',
  styleUrl: './image-gallery.component.css',
})
export class ImageGalleryComponent implements OnInit {
  private imageService = inject(ImageService);

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

  // Helper method to handle different aspect ratios
  getImageDimensions(imageUrl: string): { width: number; height: number } {
    // Default dimensions for Cloudinary images (close to typical AI generated images)
    return { width: 1024, height: 1024 };
  }
}
