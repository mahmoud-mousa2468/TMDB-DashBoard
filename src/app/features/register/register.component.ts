import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule,RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  authService = inject(AuthService);
  private router = inject(Router);

  // سجنالز لبيانات الفورم
  fullName = signal('');
  email = signal('');
  password = signal('');
  confirmPassword = signal('');
  
  errorMessage = signal('');
  isLoading = signal(false);

  async onRegister() {
    // 1. Validation بسيط قبل ما نكلم الـ API
    if (!this.email() || !this.password() || !this.fullName()) {
      this.errorMessage.set('All fields are required!');
      return;
    }

    if (this.password() !== this.confirmPassword()) {
      this.errorMessage.set('Passwords do not match!');
      return;
    }

    if (this.password().length < 6) {
      this.errorMessage.set('Password should be at least 6 characters');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    try {
      // 2. تنفيذ التسجيل في Firebase
      await this.authService.signUpCustom(this.email(), this.password(), this.fullName());
      
      // (اختياري) ممكن تحدث اسم اليوزر في Firebase profile هنا لو حابب
      this.router.navigate(['/home']); // حوله للهوم فوراً
    } catch (error: any) {
      // التعامل مع أخطاء Firebase المشهورة
      if (error.code === 'auth/email-already-in-use') {
        this.errorMessage.set('This email is already registered.');
      } else {
        this.errorMessage.set('Registration failed. Please try again.');
      }
    } finally {
      this.isLoading.set(false);
    }
  }
}
