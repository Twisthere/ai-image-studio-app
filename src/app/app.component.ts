import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import {
  RouterOutlet,
  RouterModule,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { Meta } from '@angular/platform-browser';
import { TrackService } from './services/track.service';
import { catchError, finalize, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  readonly title = 'ai-image-studio-app';

  private readonly trackService = inject(TrackService);
  private readonly meta = inject(Meta);

  // Theme state
  readonly darkMode = signal<boolean>(false);

  // Mobile menu state
  readonly mobileMenuOpen = signal<boolean>(false);

  // Use computed signals for derived values
  readonly currentYear = computed(() => new Date().getFullYear());
  readonly themeIcon = computed(() => (this.darkMode() ? 'sun' : 'moon'));

  // Access tracking signals directly
  readonly visitorCount = this.trackService.visitorCount;
  readonly isTrackingLoading = this.trackService.isLoading;
  readonly trackingError = this.trackService.error;

  // Media query for system preference
  private readonly prefersDarkQuery = window.matchMedia(
    '(prefers-color-scheme: dark)'
  );

  constructor() {
    this.setupMetaTags();
    this.initializeTheme();
    this.setupSystemThemeListener();
    effect(() => this.applyTheme(this.darkMode()));
  }

  // Toggle mobile menu
  toggleMobileMenu(): void {
    this.mobileMenuOpen.update((open) => !open);
  }

  /**
   * Initializes the theme based on local storage or system preference
   */
  private initializeTheme(): void {
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme) {
      this.darkMode.set(savedTheme === 'dark');
    } else {
      // Use system preference if no saved theme
      this.darkMode.set(this.prefersDarkQuery.matches);
    }
  }

  /**
   * Sets up listener for system theme changes
   */
  private setupSystemThemeListener(): void {
    // Only update if user hasn't explicitly set preference
    this.prefersDarkQuery.addEventListener('change', (event) => {
      if (!localStorage.getItem('theme')) {
        this.darkMode.set(event.matches);
      }
    });
  }

  /**
   * Toggles between light and dark themes
   */
  toggleTheme(): void {
    const newDarkMode = !this.darkMode();
    this.darkMode.set(newDarkMode);
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
  }

  /**
   * Applies the appropriate theme class to the document
   * @param isDark Whether to apply dark mode
   */
  private applyTheme(isDark: boolean): void {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  /**
   * Sets up meta tags for SEO and social sharing
   */
  private setupMetaTags(): void {
    this.meta.addTags([
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { rel: 'icon', type: 'image/x-icon', href: 'favicon.ico' },
      {
        name: 'canonical',
        content: 'https://ai-image-studio-app-app.vercel.app',
      },
      { name: 'author', content: 'Manthan Ankolekar' },
      {
        name: 'keywords',
        content: 'angular, ai image studio, image generator, image modifier',
      },
      { name: 'robots', content: 'index, follow' },
      { property: 'og:title', content: 'AI Image Studio App' },
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

  /**
   * Track project visit on component initialization using reactive approach
   */
  ngOnInit(): void {
    // Use RxJS approach instead of async/await
    this.trackService
      .trackVisitRx(this.title)
      .pipe(
        tap((count) => console.log(`Visitor count: ${count}`)),
        catchError((error) => {
          console.error('Error tracking project visit:', error);
          return of(0); // Return fallback value
        }),
        finalize(() => console.log('Tracking complete'))
      )
      .subscribe();
  }
}
