import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-users-admin',
  templateUrl: './users-admin.component.html',
  styleUrls: ['./users-admin.component.css']
})
export class UsersAdminComponent implements OnInit {
  usuarios: any[] = [];
  apiUrl = 'http://localhost:3000/api';
  editandoId: number | null = null;
  private _backup: any = null;

  // Formulario de nuevo usuario
  nuevoUsuario = {
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    tipo: 'student'
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.http.get<any[]>(`${this.apiUrl}/users`).subscribe({
      next: (data) => this.usuarios = data,
      error: (err) => console.error('Error al cargar usuarios', err)
    });
  }

  registrarUsuario() {
    if (!this.nuevoUsuario.nombre || !this.nuevoUsuario.email || !this.nuevoUsuario.password) {
      alert('Completa todos los campos obligatorios');
      return;
    }

    this.http.post(`${this.apiUrl}/auth/register`, this.nuevoUsuario).subscribe({
      next: () => {
        alert('Usuario registrado exitosamente');
        this.nuevoUsuario = { nombre: '', apellido: '', email: '', password: '', tipo: 'student' };
        this.cargarUsuarios();
      },
      error: (err) => {
        alert(err.error?.message || 'Error al registrar usuario');
      }
    });
  }

  toggleMatricula(usuario: any) {
    const nuevoEstado = !usuario.matriculaActiva;
    this.http.put(`${this.apiUrl}/users/${usuario.id}`, { matriculaActiva: nuevoEstado }).subscribe({
      next: () => {
        usuario.matriculaActiva = nuevoEstado;
      },
      error: () => alert('Error al actualizar matrícula')
    });
  }

  toggleResidencia(usuario: any) {
    const nuevoEstado = !usuario.residenciaActiva;
    this.http.put(`${this.apiUrl}/users/${usuario.id}`, { residenciaActiva: nuevoEstado }).subscribe({
      next: () => {
        usuario.residenciaActiva = nuevoEstado;
      },
      error: () => alert('Error al actualizar residencia')
    });
  }

  editarUsuario(usuario: any) {
    this._backup = { nombre: usuario.nombre, apellido: usuario.apellido, email: usuario.email, tipo: usuario.tipo };
    this.editandoId = usuario.id;
  }

  cancelarEdicion(usuario: any) {
    Object.assign(usuario, this._backup);
    this.editandoId = null;
    this._backup = null;
  }

  guardarEdicion(usuario: any) {
    this.http.put(`${this.apiUrl}/users/${usuario.id}`, {
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      tipo: usuario.tipo,
    }).subscribe({
      next: () => { this.editandoId = null; this._backup = null; },
      error: () => alert('Error al guardar cambios')
    });
  }

  eliminarUsuario(usuario: any) {
    if (!confirm(`¿Eliminar a ${usuario.nombre} ${usuario.apellido}?`)) return;

    this.http.delete(`${this.apiUrl}/users/${usuario.id}`).subscribe({
      next: () => {
        this.usuarios = this.usuarios.filter(u => u.id !== usuario.id);
        alert('Usuario eliminado');
      },
      error: () => alert('Error al eliminar usuario')
    });
  }
}
