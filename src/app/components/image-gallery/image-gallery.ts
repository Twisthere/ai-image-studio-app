import { DatePipe } from '@angular/common';
import { Component, inject, signal, OnInit } from '@angular/core';
import { Image } from '../../services/image';
import { ImageData, ImageDataArray } from '../../models/image.model';

@Component({
  selector: 'app-image-gallery',
  imports: [DatePipe],
  templateUrl: './image-gallery.html',
  styleUrl: './image-gallery.css',
})
export class ImageGallery implements OnInit {
  private imageService = inject(Image);

  // Add signal to track deletions in progress
  readonly deletingImageIds = signal<Set<string>>(new Set());

  // Make Math and parseInt available in template
  Math = Math;
  parseInt = parseInt;

  // Pagination state
  currentPage = 1;
  itemsPerPage = 12;
  selectedType: 'generated' | 'modified' | null = null;

  get images() {
    return this.imageService.images;
  }

  get isLoading() {
    return this.imageService.isLoading;
  }

  get error() {
    return this.imageService.error;
  }

  get pagination() {
    return this.imageService.pagination;
  }

  get totalPages() {
    return this.pagination()?.totalPages || 0;
  }

  get pagesArray() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  getVisiblePages(): number[] {
    const current = this.currentPage;
    const total = this.totalPages;
    const delta = 2; // Number of pages to show on each side of current page

    let start = Math.max(1, current - delta);
    let end = Math.min(total, current + delta);

    // Adjust if we're near the beginning
    if (current - delta <= 1) {
      end = Math.min(total, 1 + delta * 2);
    }

    // Adjust if we're near the end
    if (current + delta >= total) {
      start = Math.max(1, total - delta * 2);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  ngOnInit(): void {
    this.loadImages();
  }

  loadImages(): void {
    const params: any = {
      page: this.currentPage,
      limit: this.itemsPerPage
    };

    if (this.selectedType) {
      params.type = this.selectedType;
    }

    this.imageService.getImages(params).subscribe({
      next: ({ images, pagination }) => {
        // Images loaded successfully with pagination data
      },
      error: (err: Error) => {
        console.error('Failed to load images:', err);
      },
    });
  }

  deleteImage(imageId: string): void {
    if (
      confirm(
        'Are you sure you want to delete this image? This action cannot be undone.'
      )
    ) {
      // Add to set of deleting images
      this.deletingImageIds.update((ids) => {
        ids.add(imageId);
        return new Set(ids);
      });

      this.imageService.deleteImage(imageId).subscribe({
        next: () => {
          console.log('Image deleted successfully');
          // Remove from set of deleting images
          this.deletingImageIds.update((ids) => {
            ids.delete(imageId);
            return new Set(ids);
          });
          // Reload current page to refresh the data
          this.loadImages();
        },
        error: (err: Error) => {
          console.error('Failed to delete image:', err);
          // Remove from set of deleting images
          this.deletingImageIds.update((ids) => {
            ids.delete(imageId);
            return new Set(ids);
          });
        },
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

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadImages();
    }
  }

  goToPageFromInput(event: Event) {
    const target = event.target as HTMLInputElement;
    const page = parseInt(target.value);
    if (page && page >= 1 && page <= this.totalPages) {
      this.goToPage(page);
      target.value = ''; // Clear input after navigation
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadImages();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadImages();
    }
  }

  filterByType(type: 'generated' | 'modified' | null) {
    this.selectedType = type;
    this.currentPage = 1; // Reset to first page when filtering
    this.loadImages();
  }
}
