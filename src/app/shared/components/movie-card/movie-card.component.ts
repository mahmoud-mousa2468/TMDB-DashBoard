import { Component, input } from '@angular/core';
import { Movie } from '../../../core/models/movie.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss'
})
export class MovieCardComponent {
// بنستخدم input() الحديثة في Angular 17/18
  movie = input.required<Movie>();

  // دالة مساعدة لجلب مسار الصورة الكامل
get fullImageUrl() {
  // غير w500 لـ w342 لسرعة خرافية في التحميل
  return `https://image.tmdb.org/t/p/w342${this.movie().poster_path}`;
}
}
