import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { doc, docData, Firestore } from '@angular/fire/firestore';
import { CanActivateFn, Router } from '@angular/router';
import { map, of, switchMap, take } from 'rxjs';

export const adminGuard: CanActivateFn = (route, state) => {
  const firestore = inject(Firestore);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);
  // بنستخدم authState عشان نضمن إننا نستنى الرد من فايربيز لو عملنا Refresh
  return authState(inject(Auth)).pipe(
    take(1), // ناخد أول رد بس
    switchMap(user => {
      if (!user) return of(false);
      // بنروح نجيب الرول من Firestore مباشرة للتأكد
      const userDoc = doc(firestore, `users/${user.uid}`);
      return docData(userDoc).pipe(take(1));
    }),
    map((userData: any) => {
      if (userData && userData.role === 'admin') {
        return true;
      }
      // بنشيك: لو إحنا في المتصفح بس، طلع الـ alert
  if (isPlatformBrowser(platformId)) {
    alert('Access Denied: Admins Only! 🛡️');
  }
      return router.createUrlTree(['/home']);
    })
  );
};
