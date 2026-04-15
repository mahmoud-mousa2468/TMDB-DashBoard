import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { TmdbService } from '../../core/services/tmdb.service';
import { Movie } from '../../core/models/imovie.model';
import { MovieCardComponent } from '../../shared/components/movie-card/movie-card.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize, switchMap } from 'rxjs';
import { AsyncPipe, isPlatformBrowser } from '@angular/common';
import { AdminService } from '../../core/services/admin.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MovieCardComponent,RouterLink,AsyncPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private tmdbService = inject(TmdbService);
  public adminService = inject(AdminService); // حقن سيرفيس الأدمن لسحب البانر والفيلم المميز
  private route = inject(ActivatedRoute); // حقن الـ Route
  private router = inject(Router); // حقن الـ Router
  private _PLATFORM_ID=inject(PLATFORM_ID)
  // بنستخدم Signal عشان نخزن الأفلام بطريقة Reactive
  movies = signal<Movie[]>([]);
  isLoading = signal(false);
  currentPage = signal(1); // بنبدأ من صفحة 1

  bannerData: any = null;
featuredMovie: any = null;

  ngOnInit(): void{
    // سحب بيانات البانر مرة واحدة أو بشكل مراقب آمن
  this.adminService.getBannerSettings().subscribe(data => {
    this.bannerData = data;
  });

  // سحب الفيلم المميز
  this.adminService.getFeaturedMovie().subscribe(data => {
    this.featuredMovie = data;
  });
    // بنراقب الـ Query Params (البحث والصفحة) مع بعض
    this.route.queryParams.pipe(
      switchMap(params => {
        this.isLoading.set(true);
        const query = params['q'];
        const page = +params['page'] || 1; // بناخد الصفحة من الـ URL أو 1
        this.currentPage.set(page);
// بنطلع فوق أول ما الصفحة تتغير (حركة UX صايعة)
        if (isPlatformBrowser(this._PLATFORM_ID)) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // بنبعت رقم الصفحة للدالتين (البحث أو الأفلام المشهورة)
        return query 
          ? this.tmdbService.searchMovies(query, page) 
          : this.tmdbService.getPopularMovies(page);
      }),
      finalize(() => this.isLoading.set(false))
    ).subscribe({
      next: (response) => {
        // بنعمل Filter للمصفوفة عشان نشيل أي فيلم الـ adult فيه بـ true
      const safeMovies = response.results.filter((m: any) => m.adult === false);
        this.movies.set(safeMovies);
        this.isLoading.set(false); // نأكد على القفل هنا
      },
      error: (err) => console.error('Something went wrong!', err)
    });
  }

  // الدالة اللي الزرار بيناديها
  changePage(newPage: number) {
    if (newPage >= 1) {
      // بدل ما ننادي دالة، بنغير الـ URL بس.. والـ switchMap اللي فوق هيحس ويحمل الداتا لوحده
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { page: newPage },
        queryParamsHandling: 'merge' // عشان نحافظ على كلمة البحث "q" لو موجودة
      });
    }
  }
}
