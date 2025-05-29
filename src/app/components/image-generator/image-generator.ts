import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Image } from '../../services/image';

@Component({
  selector: 'app-image-generator',
  imports: [FormsModule],
  templateUrl: './image-generator.html',
  styleUrl: './image-generator.css',
})
export class ImageGenerator {
  prompt = signal<string>('');
  generatedImage = signal<string | null>(null);
  loading = signal<boolean>(false);

  imageService = inject(Image);

  constructor() {}

  generate() {
    if (!this.prompt().trim()) return;

    this.loading.set(true);
    this.imageService.generateImage(this.prompt()).subscribe({
      next: (imageUrl: any) => {
        this.generatedImage.set(imageUrl);
        this.loading.set(false);
      },
      error: (error: any) => {
        console.error('Error generating image:', error);
        // Handle error - maybe add an error message to the UI
        this.loading.set(false);
      },
    });
  }
}
