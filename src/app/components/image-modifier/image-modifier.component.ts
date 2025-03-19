import { Component } from '@angular/core';
import { ImageService } from '../../services/image.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-image-modifier',
  imports: [FormsModule],
  templateUrl: './image-modifier.component.html',
  styleUrl: './image-modifier.component.css',
})
export class ImageModifierComponent {
  prompt: string = '';
  selectedFile: File | null = null;
  previewImage: string | null = null;
  modifiedImage: string | null = null;
  loading: boolean = false;

  constructor(private imageService: ImageService) {}

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      
      // Create image preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  async modify() {
    if (!this.selectedFile || !this.prompt.trim()) return;
    
    this.loading = true;
    try {
      this.modifiedImage = await this.imageService.modifyImage(
        this.selectedFile,
        this.prompt
      );
    } catch (error) {
      console.error('Error modifying image:', error);
      // Handle error - maybe add an error message to the UI
    } finally {
      this.loading = false;
    }
  }
}