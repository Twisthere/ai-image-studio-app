import { Component } from '@angular/core';
import { ImageModifierComponent } from '../../components/image-modifier/image-modifier.component';

@Component({
  selector: 'app-modify',
  standalone: true,
  imports: [ImageModifierComponent],
  template: `
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
        Modify Images
      </h1>

      <div class="bg-white dark:bg-gray-800 p-6 shadow-md rounded-lg">
        <p class="text-gray-600 dark:text-gray-300 mb-6">
          Upload an image and provide instructions on how you'd like to modify
          it.
        </p>

        <app-image-modifier></app-image-modifier>
      </div>
    </div>
  `,
})
export class ModifyComponent {}
