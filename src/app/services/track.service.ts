import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { Visit } from '../models/visit.model';

@Injectable({
  providedIn: 'root',
})
export class TrackService {
  private apiURL = environment.trackingApiUrl;
  private http = inject(HttpClient);

  // Create signals for state management
  visitorCount = signal<number>(0);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  constructor() {}

  async trackProjectVisit(projectName: string): Promise<number> {
    this.isLoading.set(true);
    this.error.set(null);
    
    try {
      const response = await lastValueFrom(
        this.http.post<Visit>(this.apiURL, { projectName })
      );
      this.visitorCount.set(response.uniqueVisitors);
      return response.uniqueVisitors;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to track visit';
      this.error.set(errorMessage);
      throw err;
    } finally {
      this.isLoading.set(false);
    }
  }
}