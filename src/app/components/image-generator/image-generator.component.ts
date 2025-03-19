import { Component } from '@angular/core';
import { ImageService } from '../../services/image.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-image-generator',
  imports: [FormsModule],
  templateUrl: './image-generator.component.html',
  styleUrl: './image-generator.component.css'
})
export class ImageGeneratorComponent {
  prompt: string = '';
  generatedImage: string | null = null;
  loading: boolean = false;

  constructor(private imageService: ImageService) {}

  async generate() {
    this.loading = true;
    this.generatedImage = await this.imageService.generateImage(this.prompt);
    this.loading = false;
  }
}
