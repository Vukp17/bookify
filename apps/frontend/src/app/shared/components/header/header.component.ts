import { Component, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: false
})
export class HeaderComponent {
  @Input() isAuthenticated = false;
  @Input() currentUser: User | null = null;
  @Output() toggleSidenav = new EventEmitter<void>();

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onToggleSidenav(): void {
    this.toggleSidenav.emit();
  }

  onLogout(): void {
    this.authService.logout().subscribe(() => {
      this.authService.removeToken();
      this.router.navigate(['/auth/login']);
    });
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}
