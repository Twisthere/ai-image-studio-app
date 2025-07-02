import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { Image } from '../../services/image';

@Component({
  selector: 'app-image-modifier',
  imports: [ReactiveFormsModule],
  templateUrl: './image-modifier.html',
  styleUrl: './image-modifier.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageModifier {
  promptControl = new FormControl('');
  selectedFile = signal<File | null>(null);
  previewImage = signal<string | null>(null);
  modifiedImage = signal<string | null>(null);
  loading = signal<boolean>(false);

  imageService = inject(Image);

  onFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files ? target.files[0] : null;
    if (file) {
      this.selectedFile.set(file);

      // Create image preview
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.previewImage.set(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }
  modify() {
    if (!this.selectedFile() || !this.promptControl.value?.trim()) return;

    this.loading.set(true);
    this.imageService
      .modifyImage(this.selectedFile()!, this.promptControl.value!)
      .subscribe({
        next: (modifiedImageUrl: string) => {
          this.modifiedImage.set(modifiedImageUrl);
          this.loading.set(false);
        },
        error: (error: Error) => {
          console.error('Error modifying image:', error);
          // Handle error - maybe add an error message to the UI
          this.loading.set(false);
        },
      });
  }
}
