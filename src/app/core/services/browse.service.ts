import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { IGenresResponse, ITmdbResponse, MovieGenre } from '../models';

@Injectable({
  providedIn: 'root',
})
export class BrowseService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiBaseUrl;
  private token = environment.tmdbToken;

  // Header الإصدار الحديث من TMDB يتطلب Authorization Token
  private headers = new HttpHeaders({
    Authorization: `Bearer ${this.token}`,
    accept: 'application/json',
  });

  // دالة لجلب قائمة التصنيفات (عشان نملا الـ Select اللي في الـ UI)
  getGenres(): Observable<IGenresResponse> {
    return this.http.get<IGenresResponse>(`${this.baseUrl}/genre/movie/list`, {
      headers: this.headers,
      params: { language: 'en-US' },
    });
  }
  // دالة اكتشاف الأفلام مع الفلاتر
  discoverMovies(params: {
    page: number;
    genre?: string;
    sort?: string;
  }): Observable<ITmdbResponse> {
    return this.http.get<ITmdbResponse>(`${this.baseUrl}/discover/movie`, {
      headers: this.headers,
      params: {
        page: params.page.toString(),
        with_genres: params.genre || '', // فلترة بالنوع (Genre ID)
        sort_by: params.sort || 'popularity.desc', // الترتيب
        include_adult: 'false',
        // بنقوله هات اللي يساوي G
        'certification.lte': 'G',
        language: 'en-US',
      },
    });
  }
}
