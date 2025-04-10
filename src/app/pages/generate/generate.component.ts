import { Component } from '@angular/core';
import { ImageGeneratorComponent } from '../../components/image-generator/image-generator.component';

@Component({
  selector: 'app-generate',
  standalone: true,
  imports: [ImageGeneratorComponent],
  template: `
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
        Generate AI Images
      </h1>

      <div class="bg-white dark:bg-gray-800 p-6 shadow-md rounded-lg">
        <p class="text-gray-600 dark:text-gray-300 mb-6">
          Describe the image you want to create, and our AI will generate it for
          you.
        </p>

        <app-image-generator></app-image-generator>
      </div>
    </div>
  `,
})
export class GenerateComponent {}
