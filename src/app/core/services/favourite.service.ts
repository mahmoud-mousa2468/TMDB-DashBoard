import { inject, Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  setDoc,
  deleteDoc,
} from '@angular/fire/firestore';
import { Observable, switchMap, of } from 'rxjs';
import { AuthService } from './auth.service';
import { toSignal } from '@angular/core/rxjs-interop';
@Injectable({
  providedIn: 'root',
})
export class FavouriteService {
  private firestore = inject(Firestore);
  private auth = inject(AuthService);
  // بنحول الـ Observable لسجنال ونخلي القيمة الابتدائية مصفوفة فاضية
  favSignal = toSignal(this.getFavourites(), { initialValue: [] as any[] });

  // جلب قائمة المفضلات لليوزر الحالي
  getFavourites(): Observable<any[]> {
    return this.auth.user$.pipe(
      switchMap((user) => {
        if (!user) return of([]);
        // بنجيب الكولكشن اللي جوه اليوزر ده بالظبط
        const favCollection = collection(
          this.firestore,
          `users/${user.uid}/favourites`,
        );
        return collectionData(favCollection, { idField: 'id' });
      }),
    );
  }

  // إضافة فيلم للمفضلة
  async addToFavourite(movie: any) {
    const user = this.auth.currentUser(); // بنجيب اليوزر اللي عامل لوجن
    if (!user|| !movie?.id) return;

    // المسار هيبقى: users -> [USER_ID] -> favourites -> [MOVIE_ID]
    const docRef = doc(
      this.firestore,
      `users/${user.uid}/favourites`,
      movie.id.toString(),
    );

    return await setDoc(docRef, {
      id: movie.id,
      title: movie.title || movie.name,
      poster_path: movie.poster_path,
      vote_average: movie.vote_average,
      addedAt: new Date(), // تريكة عشان نرتبهم حسب وقت الإضافة
    });
  }

  // حذف فيلم من المفضلة
  async removeFromFavourite(movieId: number) {
    const user = this.auth.currentUser();
    if (!user) return;

    const docRef = doc(
      this.firestore,
      `users/${user.uid}/favourites`,
      movieId.toString(),
    );
    return await deleteDoc(docRef);
  }
}
