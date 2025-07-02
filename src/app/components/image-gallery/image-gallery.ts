import { DatePipe } from '@angular/common';
import { Component, inject, signal, computed, effect, ChangeDetectionStrategy } from '@angular/core';
import { Image } from '../../services/image';
import { ImageData } from '../../models/image.model';

@Component({
  selector: 'app-image-gallery',
  imports: [DatePipe],
  templateUrl: './image-gallery.html',
  styleUrl: './image-gallery.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageGallery {
  private imageService = inject(Image);

  readonly currentPage = signal(1);
  readonly itemsPerPage = signal(12);
  readonly selectedType = signal<'generated' | 'modified' | null>(null);
  readonly deletingImageIds = signal<Set<string>>(new Set());

  readonly images = computed(() => this.imageService.images());
  readonly isLoading = computed(() => this.imageService.isLoading());
  readonly error = computed(() => this.imageService.error());
  readonly pagination = computed(() => this.imageService.pagination());
  readonly totalPages = computed(() => this.pagination()?.totalPages || 0);
  readonly pagesArray = computed(() => Array.from({ length: this.totalPages() }, (_, i) => i + 1));

  readonly getVisiblePages = computed((): number[] => {
    const current = this.currentPage();
    const total = this.totalPages();
    const delta = 2;
    let start = Math.max(1, current - delta);
    let end = Math.min(total, current + delta);
    if (current - delta <= 1) {
      end = Math.min(total, 1 + delta * 2);
    }
    if (current + delta >= total) {
      start = Math.max(1, total - delta * 2);
    }
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  });

  // Derived values for pagination info (to avoid Math in template)
  readonly showingFrom = computed(() => {
    const page = this.pagination()?.currentPage ?? 1;
    const perPage = this.pagination()?.itemsPerPage ?? 12;
    return (page - 1) * perPage + 1;
  });

  readonly showingTo = computed(() => {
    const page = this.pagination()?.currentPage ?? 1;
    const perPage = this.pagination()?.itemsPerPage ?? 12;
    const total = this.pagination()?.totalItems ?? 0;
    const to = page * perPage;
    return to > total ? total : to;
  });

  constructor() {
    effect(() => {
      this.loadImages();
    });
  }

  loadImages(): void {
    const params: any = {
      page: this.currentPage(),
      limit: this.itemsPerPage(),
    };
    if (this.selectedType()) {
      params.type = this.selectedType();
    }
    this.imageService.getImages(params).subscribe({
      next: () => {},
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
      this.deletingImageIds.update((ids) => {
        ids.add(imageId);
        return new Set(ids);
      });
      this.imageService.deleteImage(imageId).subscribe({
        next: () => {
          this.deletingImageIds.update((ids) => {
            ids.delete(imageId);
            return new Set(ids);
          });
          this.loadImages();
        },
        error: (err: Error) => {
          console.error('Failed to delete image:', err);
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

  getImageDimensions(imageUrl: string): { width: number; height: number } {
    return { width: 1024, height: 1024 };
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  goToPageFromInput(event: Event) {
    const target = event.target as HTMLInputElement;
    const page = Number(target.value);
    if (page && page >= 1 && page <= this.totalPages()) {
      this.goToPage(page);
      target.value = '';
    }
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.set(this.currentPage() + 1);
    }
  }

  prevPage() {
    if (this.currentPage() > 1) {
      this.currentPage.set(this.currentPage() - 1);
    }
  }

  filterByType(type: 'generated' | 'modified' | null) {
    this.selectedType.set(type);
    this.currentPage.set(1);
  }
}
