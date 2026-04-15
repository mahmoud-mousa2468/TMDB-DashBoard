import { computed, inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Firestore, collection, collectionData, doc, deleteDoc, updateDoc, docData, setDoc } from '@angular/fire/firestore';
import { async, Observable, of } from 'rxjs';
import { FavouriteService } from './favourite.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { isPlatformBrowser } from '@angular/common';
import { deleteUser } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private firestore = inject(Firestore);
  private favService = inject(FavouriteService);
private platformId = inject(PLATFORM_ID);
  
  totalInteractions = computed(() => this.favService.favSignal().length);
  
  topGenre = computed(() => {
    const favs = this.favService.favSignal();
    if (favs.length === 0) return 'None';
    
    // Logic بسيط لحساب أكتر تصنيف متكرر
    const genres = favs.map(m => m.genre_ids?.[0] || 'Unknown');
    return genres.sort((a,b) => 
      genres.filter(v => v===a).length - genres.filter(v => v===b).length
    ).pop();
  });

  // تحديث رسالة البانر
  async updateBanner(message: string, isActive: boolean) {
    const bannerRef = doc(this.firestore, 'settings/banner');
    return await setDoc(bannerRef, { message, isActive, updatedAt: new Date() });
  }

  // جلب إعدادات البانر (لليوزر وللأدمن)
  getBannerSettings(): Observable<any> {
    const bannerRef = doc(this.firestore, 'settings/banner');
    return docData(bannerRef);
  }

  // تحديد فيلم كـ Featured (تريند)
  async setFeaturedMovie(movie: any) {
    const featuredRef = doc(this.firestore, 'settings/featured');
    return await setDoc(featuredRef, { ...movie, setAt: new Date() });
  }

  getMostPopularMovie() {
  // بنجيب كل الداتا من كولكشن المفضلات (لو إنت عامل كولكشن عام للمفضلات)
  // أو بنعمل Loop على المفضلات اللي عندنا في السجنال حالياً للتبسيط
  const allFavs = this.favService.favSignal(); 
  
  if (allFavs.length === 0) return 'None';

  // بنعد التكرار
  const counts = allFavs.reduce((acc: any, movie: any) => {
    acc[movie.title] = (acc[movie.title] || 0) + 1;
    return acc;
  }, {});

  // بنجيب أكتر واحد اتكرر
  return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
}

  // جلب الفيلم المميز
  getFeaturedMovie(): Observable<any> {
    const featuredRef = doc(this.firestore, 'settings/featured');
    return docData(featuredRef);
  }
  // --- إدارة المستخدمين ---
  getAllUsers(): Observable<any[]> {
// 2. التشيك قبل أي تعامل مع Firestore
    if (isPlatformBrowser(this.platformId)) {
      const usersCollection = collection(this.firestore, 'users');
      return collectionData(usersCollection, { idField: 'uid' });
    }

    // 3. لو إحنا على السيرفر (وقت الـ Build)، بنرجع مصفوفة فاضية عشان الـ Build يكمل بسلام
    return of([]);
  }

  async deleteUser(uid: string) {
    return await deleteDoc(doc(this.firestore, `users/${uid}`));
  }

  async toggleAdminRole(uid: string, isAdmin: boolean) {
    // تحديث حقل role في الدوكيومنت الخاص باليوزر
    return await updateDoc(doc(this.firestore, `users/${uid}`), {
      role: isAdmin ? 'admin' : 'user'
    });
  }

  // --- إدارة الأفلام والتعليقات ---
  async deleteMovie(movieId: string) {
    return await deleteDoc(doc(this.firestore, `movies/${movieId}`));
  }

  async deleteComment(commentId: string) {
    return await deleteDoc(doc(this.firestore, `comments/${commentId}`));
  }
}