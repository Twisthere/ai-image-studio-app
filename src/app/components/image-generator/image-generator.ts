import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { Image } from '../../services/image';

@Component({
  selector: 'app-image-generator',
  imports: [ReactiveFormsModule],
  templateUrl: './image-generator.html',
  styleUrl: './image-generator.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageGenerator {
  promptControl = new FormControl('');
  generatedImage = signal<string | null>(null);
  loading = signal<boolean>(false);

  imageService = inject(Image);

  generate() {
    if (!this.promptControl.value?.trim()) return;

    this.loading.set(true);
    this.imageService.generateImage(this.promptControl.value!).subscribe({
      next: (imageUrl: string) => {
        this.generatedImage.set(imageUrl);
        this.loading.set(false);
      },
      error: (error: Error) => {
        console.error('Error generating image:', error);
        // Handle error - maybe add an error message to the UI
        this.loading.set(false);
      },
    });
  }
}
