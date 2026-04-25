import { Component, OnInit } from '@angular/core';
import { UsersService, UserAdminView } from '../../../../core/services/users.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {
  users: UserAdminView[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.usersService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Error al cargar la lista de usuarios. Verifica la conexión con el servidor.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }
}