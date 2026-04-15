import { Component, input ,computed, inject} from '@angular/core';
import { Movie } from '../../../core/models/imovie.model';
import { DatePipe } from '@angular/common';
import { Router} from '@angular/router';
import { FavouriteService } from '../../../core/services/favourite.service';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss',
})
export class MovieCardComponent {
  private router = inject(Router);
  // بنستخدم input() الحديثة في Angular 17/18
  movie = input.required<Movie>();

  // 1. تأكد من عمل Inject للسيرفيس
favService = inject(FavouriteService);

isFav(movieId: number): boolean {
  // بنشيك لو الـ ID ده موجود في السجنال اللي فيها مفضلات اليوزر
  return this.favService.favSignal().some((m: any) => String(m.id) === String(movieId));
}

// 2. الدالة اللي بتعمل Fire لما تدوس على القلب
async toggleFavourite(movie: any) {
  // بنشيك لو الفيلم موجود أصلاً في المفضلة
  if (this.isFav(movie.id)) {
    // لو موجود.. احذفه
    await this.favService.removeFromFavourite(movie.id);
  } else {
    // لو مش موجود.. ضيفه
    await this.favService.addToFavourite(movie);
  }
}



  openMovieDetails() {
    // 1. بنبني المسار (Route) يدوي
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/movie', this.movie().id])
    );

    // 2. بنفتح المسار ده في Tab جديدة
    window.open(url, '_blank');
  }

  // دالة مساعدة لجلب مسار الصورة الكامل

  getFullImageUrl = computed(() => {
  const path = this.movie().poster_path;
  return path 
    ? `https://image.tmdb.org/t/p/w500${path}` 
    : 'assets/no-poster.png';
});
}
