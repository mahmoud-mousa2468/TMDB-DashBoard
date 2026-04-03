import { Component, inject, OnInit, signal } from '@angular/core';
import { TmdbService } from '../../core/services/tmdb.service';
import { Movie } from '../../core/models/movie.model';
import { MovieCardComponent } from '../../shared/components/movie-card/movie-card.component';
import { ActivatedRoute } from '@angular/router';
import { finalize, switchMap } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MovieCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private tmdbService = inject(TmdbService);
  private route = inject(ActivatedRoute); // حقن الـ Route
  // بنستخدم Signal عشان نخزن الأفلام بطريقة Reactive
  movies = signal<Movie[]>([]);
  isLoading = signal(false);
  ngOnInit(): void {
    // بنراقب الـ Query Params (كلمة البحث في الـ URL)
    this.route.queryParams.pipe(
      switchMap(params => {
        this.isLoading.set(true);
        const query = params['q'];
        const request$ = query 
      ? this.tmdbService.searchMovies(query) // لو فيه بحث نادى دالة البحث
      : this.tmdbService.getPopularMovies();  // لو مفيش نادى الأفلام المشهورة

    // نستخدم finalize هنا
    return request$.pipe(
      finalize(() => this.isLoading.set(false)) // هيتنفذ مهما حصل
    );
        if (query) {
          return this.tmdbService.searchMovies(query); 
        }
        return this.tmdbService.getPopularMovies(); 
      })
    ).subscribe({
      next: (response) => {
        this.movies.set(response.results)
      },
      error: (err) => {
        console.error('Something went wrong!',err)
      }
    });
  }
}
