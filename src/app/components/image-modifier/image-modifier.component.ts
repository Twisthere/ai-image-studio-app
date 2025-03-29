import { Component, inject, signal } from '@angular/core';
import { ImageService } from '../../services/image.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-image-modifier',
  imports: [FormsModule],
  templateUrl: './image-modifier.component.html',
  styleUrl: './image-modifier.component.css',
})
export class ImageModifierComponent {
  prompt = signal<string>('');
  selectedFile = signal<File | null>(null);
  previewImage = signal<string | null>(null);
  modifiedImage = signal<string | null>(null);
  loading = signal<boolean>(false);

  imageService = inject(ImageService);

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
        next: (modifiedImageUrl) => {
          this.modifiedImage.set(modifiedImageUrl);
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error modifying image:', error);
          // Handle error - maybe add an error message to the UI
          this.loading.set(false);
        },
      });
  }
}
