import { Component, OnInit } from '@angular/core';
import { UsersService, UserAdminView } from '../../../../core/services/users.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {
  users: UserAdminView[] = [];
  filteredUsers: UserAdminView[] = []; // Array separado para la búsqueda dinámica
  isLoading: boolean = true;
  searchTerm: string = ''; // Variable conectada al buscador
  errorMessage: string = '';

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.usersService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.filteredUsers = data;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'No se pudo cargar la lista de usuarios.';
        this.isLoading = false;
      },
    });
  }

  // 1: Buscador en tiempo real
  filterUsers(): void {
    this.filteredUsers = this.users.filter(user => 
      user.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  // 2: Interactividad para cambiar estado
  toggleStatus(user: UserAdminView): void {
    const nextStatus = !user.isActive;
    this.usersService.toggleUserStatus(user.id, nextStatus).subscribe({
      next: () => {
        user.isActive = nextStatus;
        this.filterUsers();
      },
      error: () => {
        this.errorMessage = 'No se pudo actualizar el estado del usuario.';
      },
    });
  }

  // DINAMISMO 3: Cálculo de métricas
  getActiveCount(): number {
    return this.filteredUsers.filter(u => u.isActive).length;
  }
}
