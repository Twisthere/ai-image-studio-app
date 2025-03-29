import { Component, inject, signal } from '@angular/core';
import { ImageService } from '../../services/image.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-image-generator',
  imports: [FormsModule],
  templateUrl: './image-generator.component.html',
  styleUrl: './image-generator.component.css',
})
export class ImageGeneratorComponent {
  prompt = signal<string>('');
  generatedImage = signal<string | null>(null);
  loading = signal<boolean>(false);

  imageService = inject(ImageService);

  constructor() {}

  generate() {
    if (!this.prompt().trim()) return;

    this.loading.set(true);
    this.imageService.generateImage(this.prompt()).subscribe({
      next: (imageUrl) => {
        this.generatedImage.set(imageUrl);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error generating image:', error);
        // Handle error - maybe add an error message to the UI
        this.loading.set(false);
      },
    });
  }
}
