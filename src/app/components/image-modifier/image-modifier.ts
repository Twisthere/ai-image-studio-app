import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Image } from '../../services/image';

@Component({
  selector: 'app-image-modifier',
  imports: [FormsModule],
  templateUrl: './image-modifier.html',
  styleUrl: './image-modifier.css',
})
export class ImageModifier {
  prompt = signal<string>('');
  selectedFile = signal<File | null>(null);
  previewImage = signal<string | null>(null);
  modifiedImage = signal<string | null>(null);
  loading = signal<boolean>(false);

  imageService = inject(Image);

  constructor() {}

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile.set(file);

      // Create image preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewImage.set(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  modify() {
    if (!this.selectedFile() || !this.prompt().trim()) return;

    this.loading.set(true);
    this.imageService
      .modifyImage(this.selectedFile()!, this.prompt())
      .subscribe({
        next: (modifiedImageUrl: any) => {
          this.modifiedImage.set(modifiedImageUrl);
          this.loading.set(false);
        },
        error: (error: any) => {
          console.error('Error modifying image:', error);
          // Handle error - maybe add an error message to the UI
          this.loading.set(false);
        },
      });
  }
}
