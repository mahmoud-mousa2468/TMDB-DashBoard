import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { IMovieDetails, ITmdbResponse } from '../models';

@Injectable({
  providedIn: 'root',
})
export class TmdbService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiBaseUrl;
  private token = environment.tmdbToken;

  // Header الإصدار الحديث من TMDB يتطلب Authorization Token
  private headers = new HttpHeaders({
    Authorization: `Bearer ${this.token}`,
    accept: 'application/json',
  });

  // دالة لجلب الأفلام المشهورة
  getPopularMovies(page: number = 1): Observable<ITmdbResponse> {
    return this.http.get<ITmdbResponse>(`${this.baseUrl}/movie/popular`, {
      headers: this.headers,
      params: {
        page: page.toString(),
        include_adult: 'false',
        // بنقوله هات اللي يساوي G
        'certification.lte': 'G',
      },
    });
  }

  // دالة لجلب تفاصيل الفيلم مع الفيديوهات والصور والممثلين في طلب واحد باستخدام append_to_response
  getMovieDetails(id: string): Observable<IMovieDetails> {
    return this.http.get<IMovieDetails>(`${this.baseUrl}/movie/${id}`, {
      headers: this.headers,
      params: {
        // لازم الكلمة دي تكون كدة بالظبط وبدون مسافات
        append_to_response: 'videos,credits,images',
      },
    });
  }

  // دالة البحث عن الأفلام
  searchMovies(query: string, page: number = 1): Observable<ITmdbResponse> {
    return this.http.get<ITmdbResponse>(`${this.baseUrl}/search/movie`, {
      headers: this.headers,
      params: {
        query: query,
        language: 'en-US',
        page: page.toString(),
        include_adult: 'false',
        // بنقوله هات اللي يساوي G
        'certification.lte': 'G',
      },
    });
  }
}
