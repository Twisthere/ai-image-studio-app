import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, map, tap, catchError, throwError, finalize } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Visit } from '../models/visit.model';

@Injectable({
  providedIn: 'root',
})
export class Track {
  private readonly apiURL = environment.trackingApiUrl;
  private readonly http = inject(HttpClient);

  // Create signals for state management
  readonly visitorCount = signal<number>(0);
  readonly isLoading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  /**
   * Tracks a project visit and returns an Observable with visitor count
   * @param projectName The name of the project to track
   * @returns Observable<number> of visitor count
   */
  trackVisitRx(projectName: string): Observable<number> {
    this.isLoading.set(true);
    this.error.set(null);

    return this.http.post<Visit>(this.apiURL, { projectName }).pipe(
      map((response) => response.uniqueVisitors),
      tap((count) => this.visitorCount.set(count)),
      catchError((err) => {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to track visit';
        this.error.set(errorMessage);
        return throwError(() => new Error(errorMessage));
      }),
      finalize(() => this.isLoading.set(false))
    );
  }
}
