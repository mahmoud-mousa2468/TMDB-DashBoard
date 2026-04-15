import { computed, inject, Injectable, signal } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  user
} from '@angular/fire/auth';
import { doc, docData, Firestore, getDoc, setDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);
  private router = inject(Router);
  private firestore = inject(Firestore); // حقن الـ Firestore
  user$ = user(this.auth);
  currentUser = signal<any | null>(null);

  constructor() {
    // الطريقة دي (switchMap) هي الأصح عشان تجيب بيانات اليوزر من Firestore أوتوماتيك
    this.user$.pipe(
      switchMap(u => {
        if (u) {
          // لو فيه يوزر، روح هات بياناته من كولكشن users
          return docData(doc(this.firestore, `users/${u.uid}`));
        } else {
          return of(null);
        }
      })
    ).subscribe((fullUserData) => {
      // هنا الـ fullUserData هيكون فيها (email, name, role)
      this.currentUser.set(fullUserData);

      const currentUrl = this.router.url;
      if (fullUserData && (currentUrl === '/login' || currentUrl === '/register')) {
        this.router.navigate(['/home']);
      }
    });
  }
  // سجنال جاهزة للـ Guard بكرة
  isAdmin = computed(() => (this.currentUser() as any)?.role === 'admin');
  
  // طريقة جوجل (الأسرع)
  async loginWithGoogle() {
  const credential = await signInWithPopup(this.auth, new GoogleAuthProvider());
  // أول ما يدخل، ابعت بياناته للـ Firestore
  return this.updateUserData(credential.user, credential.user.displayName || '');
}

  // طريقة الإيميل (التسجيل)
  async signUpCustom(email: string, pass: string,userName:string) {
  const credential = await createUserWithEmailAndPassword(this.auth, email, pass);
  // لازم نبعت اليوزر الجديد للـ Firestore عشان يتكريت له Profile
  await this.updateUserData(credential.user, userName);
}

  // طريقة الإيميل (الدخول)
  async loginCustom(email: string, pass: string) {
    return await signInWithEmailAndPassword(this.auth, email, pass);
  }

  async resetPassword(email: string) {
    return await sendPasswordResetEmail(this.auth, email);
  }

  async logout() {
    try {
    await signOut(this.auth);
    // بعد ما يخرج، بنصفر السجنال ونوديه لصفحة اللوجن
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  } catch (error) {
    console.error('Logout Error:', error);
  }
  }
// 
 private async updateUserData(user: any,displayName: string) {
  const userRef = doc(this.firestore, `users/${user.uid}`);
  
  // أولاً: بنجيب البيانات الحالية لليوزر لو موجود (عشان نعرف الـ role الحقيقي بتاعه)
  // ده بيمنع إن السيستم يصفر الـ role بتاعتك كـ Admin لما تعمل Login
  const userSnap = await getDoc(userRef);
  let currentRole = 'user'; // القيمة الافتراضية لأي يوزر جديد

  if (userSnap.exists()) {
    const existingData = userSnap.data();
    currentRole = existingData['role'] || 'user'; // لو ليه رول قديم (زي admin) يحافظ عليه
  }

  const data: any = {
    uid: user.uid,
    email: user.email,
    displayName: displayName || user.displayName || 'New User',
    photoURL: user.photoURL || '',
    role: currentRole // هنا بنضمن إن اليوزر الجديد يبقى user والقديم ميتأثرش
  };

  return setDoc(userRef, data, { merge: true });
}
}
