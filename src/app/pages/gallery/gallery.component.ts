import { Component } from '@angular/core';
import { ImageGalleryComponent } from '../../components/image-gallery/image-gallery.component';

@Component({
  selector: 'app-gallery',
  imports: [ImageGalleryComponent],
  template: `
    <div class="max-w-7xl mx-auto">
      <h1 class="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
        Image Gallery
      </h1>

      <div class="bg-white dark:bg-gray-800 p-6 shadow-md rounded-lg">
        <p class="text-gray-600 dark:text-gray-300 mb-6">
          Browse all the images you've generated and modified.
        </p>

        <app-image-gallery></app-image-gallery>
      </div>
    </div>
  `,
})
export class GalleryComponent {}
