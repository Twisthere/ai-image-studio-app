import { Component, inject, signal } from '@angular/core';
import { ImageService } from '../../services/image.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-image-generator',
  imports: [FormsModule],
  templateUrl: './image-generator.component.html',
  styleUrl: './image-generator.component.css'
})
export class ImageGeneratorComponent {
  prompt = signal<string>('');
  generatedImage = signal<string | null>(null);
  loading = signal<boolean>(false);

  imageService = inject(ImageService);

  constructor() {}

  async generate() {
    if (!this.prompt().trim()) return;
    
    this.loading.set(true);
    try {
      const imageUrl = await this.imageService.generateImage(this.prompt());
      this.generatedImage.set(imageUrl);
    } catch (error) {
      console.error('Error generating image:', error);
      // Handle error - maybe add an error message to the UI
    } finally {
      this.loading.set(false);
    }
  }
}