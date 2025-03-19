import { Component, inject, OnInit, signal } from '@angular/core';
import { ImageGeneratorComponent } from './components/image-generator/image-generator.component';
import { ImageModifierComponent } from './components/image-modifier/image-modifier.component';
import { Meta } from '@angular/platform-browser';
import { Visit } from './models/visit.model';
import { TrackService } from './services/track.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ImageGeneratorComponent, ImageModifierComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'ai-image-studio-app';

  private trackService = inject(TrackService);
  private meta = inject(Meta);

  visitorCount = signal(0);
  currentYear: number = new Date().getFullYear();

  constructor() {
    this.meta.addTags([
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: 'favicon.ico',
      },
      {
        name: 'canonical',
        content: 'https://ai-image-studio-app-app.vercel.app',
      },
      {
        name: 'author',
        content: 'Manthan Ankolekar',
      },
      {
        name: 'keywords',
        content: 'angular, ai image studio, image generator, image modifier',
      },
      {
        name: 'robots',
        content: 'index, follow',
      },
      {
        property: 'og:title',
        content: 'AI Image Studio App',
      },
      {
        property: 'og:description',
        content:
          'AI Image Studio App is a web application that allows users to generate and modify images using AI technology.',
      },
      {
        property: 'og:url',
        content: 'https://ai-image-studio-app-app.vercel.app',
      },
    ]);
  }

  ngOnInit(): void {
    this.trackProjectVisit();
  }

  private trackProjectVisit(): void {
    this.trackService.trackProjectVisit(this.title).subscribe({
      next: (response: Visit) => {
        this.visitorCount.set(response.uniqueVisitors);
      },
      error: (err: Error) => {
        console.error('Failed to track visit:', err);
      },
    });
  }
}
