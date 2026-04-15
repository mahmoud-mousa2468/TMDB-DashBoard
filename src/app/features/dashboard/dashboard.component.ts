import { Component, computed, inject, PLATFORM_ID, signal } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { FavouriteService } from '../../core/services/favourite.service';
import { AdminService } from '../../core/services/admin.service';
import { take } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  // حقن السيرفيس كـ public عشان الـ HTML يقدر يوصل للسجنالز اللي جواها
  public adminService = inject(AdminService);
  
  // بنعرف السجنالز هنا جوه الكومبوننت
  users = signal<any[]>([]);
  isLoading = signal(true);
private platformId = inject(PLATFORM_ID);
  ngOnInit() {
    // بنجيب الداتا "مرة واحدة" أول ما يفتح الداشبورد
    if (isPlatformBrowser(this.platformId)) {
    this.adminService.getAllUsers().pipe(take(1)).subscribe({
      next: (data) => {
        this.users.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }}
  userCount = computed(() => this.users().length);
  /**
   * تغيير دور المستخدم (Admin/User)
   * @param uid معرف المستخدم
   * @param isAdmin القيمة الجديدة
   */
  async changeRole(uid: string, isAdmin: boolean) {
    try {
      await this.adminService.toggleAdminRole(uid, isAdmin);
      console.log('Role updated successfully');
    } catch (error) {
      console.error('Error updating role:', error);
      alert('Failed to update role. Check console for details.');
    }
  }

  /**
   * حذف مستخدم نهائياً من الـ Firestore
   * @param uid معرف المستخدم
   */
  async removeUser(uid: string) {
    const confirmDelete = confirm('⚠️ WARNING: This action is permanent. Delete user?');
    if (confirmDelete) {
      try {
        await this.adminService.deleteUser(uid);
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  }

  /**
   * تحديث رسالة البانر العالمية
   * @param msg نص الرسالة
   * @param active حالة التفعيل
   */
  async updateBanner(msg: string, active: boolean) {
    if (active && !msg) {
      alert('Please enter a message first!');
      return;
    }
    
    try {
      await this.adminService.updateBanner(msg, active);
      if (active) alert('Banner Activated! 📢');
      else alert('Banner Disabled.');
    } catch (error) {
      console.error('Error updating banner:', error);
    }
  }
}