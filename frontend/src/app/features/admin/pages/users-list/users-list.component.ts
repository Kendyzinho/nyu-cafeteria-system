import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService, UserAdminView } from '../../../../core/services/users.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {
  users: UserAdminView[] = [];
  filteredUsers: UserAdminView[] = []; 
  isLoading: boolean = true;
  searchTerm: string = ''; 

  // Modals state
  showFormModal: boolean = false;
  showDetailsModal: boolean = false;
  showDeleteModal: boolean = false;

  // Form and Selected Data
  userForm: FormGroup;
  selectedUser: UserAdminView | null = null;
  isEditing: boolean = false;

  // Alerts
  successMessage: string = '';

  constructor(private usersService: UsersService, private fb: FormBuilder) {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['Cliente', Validators.required],
      isResident: [false]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.usersService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.filteredUsers = [...this.users];
        this.isLoading = false;
      }
    });
  }

  filterUsers(): void {
    this.filteredUsers = this.users.filter(user => 
      user.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  toggleStatus(user: UserAdminView): void {
    const previousStatus = user.isActive;
    // Optimistic UI update
    user.isActive = !previousStatus;
    
    this.usersService.toggleUserStatus(user.id, previousStatus).subscribe({
      next: () => {
        this.filterUsers();
        this.showSuccess(user.isActive ? 'Usuario activado.' : 'Usuario suspendido.');
      },
      error: (err) => {
        // Revert on error
        user.isActive = previousStatus;
        this.showSuccess('Error al actualizar estado del usuario.');
        console.error(err);
      }
    });
  }

  getActiveCount(): number {
    return this.filteredUsers.filter(u => u.isActive).length;
  }

  // --- CRUD Local ---

  openCreateModal(): void {
    this.isEditing = false;
    this.selectedUser = null;
    this.userForm.reset({ role: 'Cliente', isResident: false });
    this.showFormModal = true;
  }

  openEditModal(user: UserAdminView): void {
    this.isEditing = true;
    this.selectedUser = user;
    this.userForm.patchValue({
      firstName: user.firstName,
      email: user.email,
      role: user.role,
      isResident: user.isResident
    });
    this.showFormModal = true;
  }

  closeFormModal(): void {
    this.showFormModal = false;
  }

  onSubmitForm(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const formValues = this.userForm.value;

    if (this.isEditing && this.selectedUser) {
      this.usersService.updateUser(this.selectedUser.id, {
        nombre: formValues.firstName,
        email: formValues.email,
        tipo: formValues.role,
        es_residente: formValues.isResident
      }).subscribe({
        next: () => {
          this.showSuccess('Usuario actualizado correctamente.');
          this.loadUsers();
          this.closeFormModal();
        },
        error: (err) => {
          this.showSuccess('Error al actualizar el usuario.');
          console.error(err);
        }
      });
    } else {
      this.usersService.createUser({
        nombre: formValues.firstName,
        email: formValues.email,
        tipo: formValues.role,
        es_residente: formValues.isResident,
        password: 'Password123!', // Clave por defecto para la creación desde el admin
        activo: true
      }).subscribe({
        next: () => {
          this.showSuccess('Usuario creado exitosamente.');
          this.loadUsers();
          this.closeFormModal();
        },
        error: (err) => {
          this.showSuccess('Error al crear el usuario.');
          console.error(err);
        }
      });
    }
  }

  // --- Delete ---

  openDeleteModal(user: UserAdminView): void {
    this.selectedUser = user;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.selectedUser = null;
  }

  confirmDelete(): void {
    if (this.selectedUser) {
      this.usersService.deleteUser(this.selectedUser.id).subscribe({
        next: () => {
          this.users = this.users.filter(u => u.id !== this.selectedUser!.id);
          this.filterUsers();
          this.showSuccess('Usuario eliminado.');
          this.closeDeleteModal();
        },
        error: () => {
          this.showSuccess('Error al eliminar el usuario.');
          this.closeDeleteModal();
        }
      });
    }
  }

  // --- View Details ---

  openDetailsModal(user: UserAdminView): void {
    this.selectedUser = user;
    this.showDetailsModal = true;
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedUser = null;
  }

  // --- Utils ---

  private showSuccess(message: string): void {
    this.successMessage = message;
    setTimeout(() => this.successMessage = '', 3000);
  }
}