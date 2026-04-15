import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Auth, authState } from '@angular/fire/auth';
import { take, map } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const auth = inject(Auth);

  // بنراقب حالة الـ Auth
  return authState(auth).pipe(
    take(1), // بناخد أول استجابة ونقفل عشان الجارد ميقفلش بعد كدة
    map((user) => {
      if (user) {
        // لو اليوزر مسجل دخول، بنسمح له يعدي
        return true;
      } else {
        // لو مش مسجل، بنرجعه لصفحة اللوجن
        return router.createUrlTree(['/login']);
      }
    })
  );
};
