import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-layout',
  template: `
    <div class="admin-layout">
      <aside class="sidebar">
        <div class="logo">Admin Panel</div>
        <nav>
          <a routerLink="/admin" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Dashboard</a>
          <a routerLink="/admin/users" routerLinkActive="active">Usuarios</a>
          <a routerLink="/admin/products" routerLinkActive="active">Productos</a>
          <a routerLink="/admin/menu" routerLinkActive="active">Menú Diario</a>
          <a routerLink="/admin/stock" routerLinkActive="active">Stock</a>
          <a routerLink="/" class="logout">Salir al sitio</a>
        </nav>
      </aside>
      <main>
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .admin-layout { display: flex; min-height: 100vh; }
    .sidebar {
      width: 240px;
      background: #2c211d;
      color: #c0a792;
      padding: 1rem;
      display: flex;
      flex-direction: column;
    }
    .logo { font-size: 1.5rem; font-weight: bold; text-align: center; padding-bottom: 1rem; }
    .sidebar nav { display: flex; flex-direction: column; gap: 0.5rem; }
    .sidebar nav a {
      color: #c0a792;
      text-decoration: none;
      padding: 0.75rem 1rem;
      border-radius: 4px;
      transition: background-color 0.2s, color 0.2s;
    }
    .sidebar nav a:hover, .sidebar nav a.active { background-color: #c0a792; color: #2c211d; }
    .sidebar .logout { margin-top: auto; background-color: #413330; }
    main { flex-grow: 1; padding: 2rem; background: #c0a792; }
  `]
})
export class AdminLayoutComponent { }