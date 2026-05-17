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
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['Cliente', Validators.required],
      planType: ['No asignado', Validators.required],
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
    // Local state toggle
    user.isActive = !user.isActive;
    this.filterUsers(); // update filtered list references if needed, although it modifies the object directly
    this.showSuccess(user.isActive ? 'Usuario activado.' : 'Usuario suspendido.');
  }

  getActiveCount(): number {
    return this.filteredUsers.filter(u => u.isActive).length;
  }

  // --- CRUD Local ---

  openCreateModal(): void {
    this.isEditing = false;
    this.selectedUser = null;
    this.userForm.reset({ role: 'Cliente', planType: 'No asignado', isResident: false });
    this.showFormModal = true;
  }

  openEditModal(user: UserAdminView): void {
    this.isEditing = true;
    this.selectedUser = user;
    this.userForm.patchValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      planType: user.planType,
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
      // Update local state
      this.selectedUser.firstName = formValues.firstName;
      this.selectedUser.lastName = formValues.lastName;
      this.selectedUser.email = formValues.email;
      this.selectedUser.role = formValues.role;
      this.selectedUser.planType = formValues.planType;
      this.selectedUser.isResident = formValues.isResident;
      this.showSuccess('Usuario actualizado correctamente.');
    } else {
      // Create local state
      const newUser: UserAdminView = {
        id: Math.floor(Math.random() * 1000000), // Temp ID
        firstName: formValues.firstName,
        lastName: formValues.lastName,
        email: formValues.email,
        role: formValues.role,
        planType: formValues.planType,
        isResident: formValues.isResident,
        isActive: true
      };
      this.users.unshift(newUser);
      this.showSuccess('Usuario creado exitosamente.');
    }

    this.filterUsers();
    this.closeFormModal();
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
      this.users = this.users.filter(u => u.id !== this.selectedUser!.id);
      this.filterUsers();
      this.showSuccess('Usuario eliminado.');
      this.closeDeleteModal();
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