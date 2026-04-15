import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLinkActive,RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
isMenuOpen = false; // للموبايل لاحقاً
authService=inject(AuthService);
private router = inject(Router);
  private searchSubject = new Subject<string>();

  constructor() {
    // إعداد الـ Stream الخاص بالبحث
    this.searchSubject.pipe(
      debounceTime(300),         // استنى نص ثانية بعد آخر حرف (عشان الـ Performance)
      distinctUntilChanged(),    // لو كتب حرف ومسحه ورجعه تاني متبعتش طلب جديد
    ).subscribe(query => {
      // بنبعت كلمة البحث للـ URL عشان صفحة الـ Home تحس بيها
      this.router.navigate(['/'], { queryParams: { q: query } });
    });
  }

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchSubject.next(input.value);
  }
}
