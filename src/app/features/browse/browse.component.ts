import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { BrowseService } from '../../core/services/browse.service';
import { TmdbService } from '../../core/services/tmdb.service';
import { Genre, Movie } from '../../core/models';
import { MovieCardComponent } from '../../shared/components/movie-card/movie-card.component';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-browse',
  standalone: true,
  imports: [MovieCardComponent],
  templateUrl: './browse.component.html',
  styleUrl: './browse.component.scss'
})
export class BrowseComponent implements OnInit {
  private _BrowseService = inject(BrowseService);
  private _PLATFORM_ID=inject(PLATFORM_ID)

  movies = signal<Movie[]>([]);
  genres = signal<Genre[]>([]);
  isLoading = signal(false);
  currentPage = signal(1);

  // السجنالز بتاعة الفلاتر
  selectedGenre = signal<string>('');
  sortBy = signal<string>('popularity.desc');

  ngOnInit() {
    this.loadGenres();
    this.loadMovies(); // أول تحميل للـ Browse (بيجيب Popular افتراضياً)
  }

  loadGenres() {
    this._BrowseService.getGenres().subscribe(res => this.genres.set(res.genres));
  }

  loadMovies() {
    this.isLoading.set(true);
    this._BrowseService.discoverMovies({
      page: this.currentPage(),
      genre: this.selectedGenre(),
      sort: this.sortBy()
    }).subscribe({
      next: (res) => {
         // بنعمل Filter للمصفوفة عشان نشيل أي فيلم الـ adult فيه بـ true
      const safeMovies = res.results.filter((m: any) => m.adult === false);
        this.movies.set(safeMovies);
        this.isLoading.set(false);
      }
    });
  }

  onFilterChange() {
    this.currentPage.set(1); // بنصفر الصفحة لما نغير الفلتر
    this.loadMovies();
  }
  
  changePage(newPage: number) {
  if (newPage >= 1) {
    // 1. حدث قيمة السجنال
    this.currentPage.set(newPage); 
    
    // 2. حمل الأفلام الجديدة بناءً على رقم الصفحة الجديد
    this.loadMovies();

    // 3. اطلع فوق خالص عشان اليوزر يشوف أول النتايج (حركة UX صايعة بكرة)
     if (isPlatformBrowser(this._PLATFORM_ID)) {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
  }
}
}