import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';
import { TmdbService } from '../../core/services/tmdb.service';
import { DatePipe, DecimalPipe } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { computed } from '@angular/core'; 


@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [DatePipe,DecimalPipe],
  templateUrl: './movie-details.component.html',
  styleUrl: './movie-details.component.scss'
})
export class MovieDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private tmdbService = inject(TmdbService);
private sanitizer = inject(DomSanitizer);
showModal = signal(false);
  movie = signal<any>(null);
  isLoading = signal(true);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.tmdbService.getMovieDetails(id).pipe(
        finalize(() => this.isLoading.set(false))
      ).subscribe(data => {this.movie.set(data); console.log(data)});
    }
  }

  getBackdropUrl(path: string) {
    return `https://image.tmdb.org/t/p/original${path}`;
  }
  
trailerUrl = computed(() => {
  const movieData = this.movie(); // بنراقب السجنال هنا
  const videos = movieData?.videos?.results;
  
  if (!videos || videos.length === 0) return null;

  let video = videos.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube');
  if (!video) video = videos.find((v: any) => v.type === 'Teaser' && v.site === 'YouTube');
  if (!video) video = videos.find((v: any) => v.site === 'YouTube');

  if (!video) return null;

  return this.sanitizer.bypassSecurityTrustResourceUrl(
    `https://www.youtube.com/embed/${video.key}?autoplay=1`
  );
});
}
