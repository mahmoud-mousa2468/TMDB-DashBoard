import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { TmdbResponse } from '../models/movie.model';

@Injectable({
  providedIn: 'root'
})
export class TmdbService {

  private http = inject(HttpClient);
  private baseUrl = environment.apiBaseUrl;
  private token = environment.tmdbToken;

  // Header الإصدار الحديث من TMDB يتطلب Authorization Token
  private headers = new HttpHeaders({
    Authorization: `Bearer ${this.token}`,
    accept: 'application/json'
  });

  // دالة لجلب الأفلام المشهورة
  getPopularMovies(): Observable<TmdbResponse> {
    return this.http.get<TmdbResponse>(`${this.baseUrl}/movie/popular`, {
      headers: this.headers
    });
  }

  // دالة البحث عن الأفلام
searchMovies(query: string): Observable<TmdbResponse> {
  return this.http.get<TmdbResponse>(`${this.baseUrl}/search/movie`, {
    headers: this.headers,
    params: {
      query: query,
      language: 'en-US',
      page: '1'
    }
  });
}
}
