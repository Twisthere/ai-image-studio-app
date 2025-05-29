import { Component } from '@angular/core';
import { ImageGallery } from "../../components/image-gallery/image-gallery";

@Component({
  selector: 'app-gallery',
  imports: [ImageGallery],
  templateUrl: './gallery.html',
  styleUrl: './gallery.css'
})
export class Gallery {

}
