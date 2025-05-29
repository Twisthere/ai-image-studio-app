import { Component } from '@angular/core';
import { ImageGenerator } from "../../components/image-generator/image-generator";

@Component({
  selector: 'app-generate',
  imports: [ImageGenerator],
  templateUrl: './generate.html',
  styleUrl: './generate.css'
})
export class Generate {

}
