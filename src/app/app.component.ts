import { Component, computed, inject, OnInit } from '@angular/core';
import { ImageGeneratorComponent } from './components/image-generator/image-generator.component';
import { ImageModifierComponent } from './components/image-modifier/image-modifier.component';
import { Meta } from '@angular/platform-browser';
import { TrackService } from './services/track.service';
import { ImageGalleryComponent } from "./components/image-gallery/image-gallery.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ImageGeneratorComponent, ImageModifierComponent, ImageGalleryComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'ai-image-studio-app';
  
  private trackService = inject(TrackService);
  private meta = inject(Meta);

  // Use computed signals for derived values
  currentYear = computed(() => new Date().getFullYear());
  
  // Access tracking signals directly
  visitorCount = this.trackService.visitorCount;
  isTrackingLoading = this.trackService.isLoading;
  trackingError = this.trackService.error;

  constructor() {
    this.setupMetaTags();
  }

  private setupMetaTags(): void {
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

  async ngOnInit(): Promise<void> {
    try {
      await this.trackService.trackProjectVisit(this.title);
    } catch (error) {
      console.error('Error tracking project visit:', error);
    }
  }
}