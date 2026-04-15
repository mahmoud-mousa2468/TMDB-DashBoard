import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
 authService=inject(AuthService);
 private router = inject(Router);

  // سجنالز عشان نشيل قيم الفورم
  email = signal('');
  password = signal('');
  errorMessage = signal('');
  isLoading = signal(false);

  // 1. تسجيل الدخول العادي
  async onLogin() {
    if (!this.email() || !this.password()) {
      this.errorMessage.set('Please fill in all fields');
      return;
    }

    this.isLoading.set(true);
    try {
      await this.authService.loginCustom(this.email(), this.password());
      this.router.navigate(['/']); // وديه الهوم لو نجح
    } catch (error: any) {
      this.errorMessage.set('Invalid email or password');
    } finally {
      this.isLoading.set(false);
    }
  }

  // 2. تسجيل دخول جوجل
  async onGoogleLogin() {
    try {
      await this.authService.loginWithGoogle();
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Google Login Error', error);
    }
  }

  // 3. نسيان الباسورد
  async onForgotPassword() {
    if (!this.email()) {
      this.errorMessage.set('Please enter your email first');
      return;
    }
    
    try {
      await this.authService.resetPassword(this.email());
      alert('Password reset email sent! Check your inbox.');
    } catch (error) {
      this.errorMessage.set('Error sending reset email');
    }
  }
}
