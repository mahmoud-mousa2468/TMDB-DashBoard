import { Component, inject } from '@angular/core';
import { MovieCardComponent } from '../../shared/components/movie-card/movie-card.component';
import { FavouriteService } from '../../core/services/favourite.service';

@Component({
  selector: 'app-favourite',
  standalone: true,
  imports: [MovieCardComponent],
  templateUrl: './favourite.component.html',
  styleUrl: './favourite.component.scss'
})
export class FavouriteComponent {
favService=inject(FavouriteService);
}
